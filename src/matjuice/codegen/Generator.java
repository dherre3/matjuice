/*
 *  Copyright 2014-2015, Vincent Foley-Bourgon, McGill University
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package matjuice.codegen;

import java.util.Set;
import java.util.Map;

import ast.Name;
import ast.NameExpr;
import matjuice.builtin_input.OneMatrixAndShapeBuiltinInputTransformer;
import matjuice.builtin_input.ResultInputTransformer;
import matjuice.builtin_input.ShapeBuiltinInputTransformer;
import matjuice.builtin_input.VectorBuiltinInputTransformer;
import matjuice.jsast.*;
import matjuice.analysis.ParameterCopyAnalysis;
import matjuice.analysis.LocalVars;
import matjuice.analysis.PointsToAnalysis;
import matjuice.transformer.ParameterCopyTransformer;
import matjuice.transformer.CopyInsertion;
import matjuice.transformer.MJCopyStmt;
import matjuice.utils.Utils;
import natlab.tame.builtin.Builtin;
import natlab.utils.NodeFinder;
import natlab.tame.tir.*;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.components.shape.DimValue;
import natlab.toolkits.rewrite.TempFactory;

public class Generator {
    private enum LoopDirection {Ascending, Descending, NonMoving, Unknown}

    private Set<String> locals;
    private IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis;
    private boolean doCopyInsertion;
    private long startTime = 0;
    private long endTime = 0;
    private boolean verbose = false;
    private boolean useWasm = false;
    public Generator(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis,
      boolean doCopyInsertion, boolean useWasm) {
        this.analysis = analysis;
        this.doCopyInsertion = doCopyInsertion;
        this.useWasm = useWasm;
    }

    public double getCopyInsertionTime() {
        return (endTime - startTime) / 1000.0;
    }

    /**
     * Transform a Tamer function into a JavaScript function.
     *
     * - "var" declarations will be added for the locals and temporaries
     * - formal parameters that might be written to will be cloned
     * - a return statement of the output parameter list is added at
     *   the end of the function
     *
     *   Note that if the same Tamer function is called from multiple call sites with
     *   values of different shapes, the interprocedural ValueAnalysis will produce multiple
     *   copies of the tirFunction that **share some internal nodes**. However the generation
     *   modifies the input function to add a return statement, potentially adding it multiple times
     *   if multiple variations of the function are generated. Since the generation
     *   relies on the identity of nodes to obtain analysis results we cannot create a copy before the
     *   generation...
     *
     *   At the moment we avoid the issue by only adding a return statement if there are none. Should the genFunction
     *   needs to be modified in the future, we should avoid mutating the input function during code generation. If
     *   that cannot be avoided, the genFunction implementation should be refactored to mutate the generated code
     *   rather than the input function.
     */
    public Function genFunction(TIRFunction tirFunction) {

        String functionName = FunctionRenamer.getFunctionName(tirFunction, analysis, useWasm);
        if (verbose) {
            System.out.println("genFunction(" + functionName + ")");
        }
        // Add an explicit return at the end of the function
        // if none is present.
        // This is somewhat of a hack, see the explanation in the comments at the top.
        // Better avoid it for future modifications, and still better to refactor to not
        // need the hack in the first place.
        TIRStatementList tirStmts = tirFunction.getStmtList();
        if (tirStmts.getChild(tirStmts.getNumChild()-1).getClass() != TIRReturnStmt.class) {
            addReturn(tirFunction);
        }
//

        // Identify locals in order to add proper "var" declarations in JS.
        locals = LocalVars.apply(tirFunction);

        // Do copy insertion
        if (doCopyInsertion) {
            startTime = System.currentTimeMillis();
            performCopyInsertion(tirFunction);
            endTime = System.currentTimeMillis();
        }


        // Do the statements first as some may create new locals.
        StmtSequence jsStmts = genStmtList(tirFunction.getStmtList());

        List<Identifier> jsArgs = new List<>();
        for (ast.Name argName : tirFunction.getInputParamList()) {
            jsArgs.add(new Identifier(argName.getID()));
        }

        // Add copies for non-scalar parameters when not doing copy insertion
        if (!doCopyInsertion) {
            for (ast.Name argName : tirFunction.getInputParamList()) {
                String arg = argName.getID();
                BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirFunction, arg);
                if (!bmv.getShape().isScalar()) {
                    List<Stmt> stmts = jsStmts.getStmtList();
                    List<Expr> args_input = new List<>();
                    args_input.add(new ExprId(arg));
                    if(useWasm) {
                        stmts.insertChild(
                                new StmtCall(
                                        new Opt<>(new Identifier(arg)),
                                        "wi.clone",
                                        args_input
                                ),
                                0
                        );
                    }else{
                        stmts.insertChild(
                                new StmtMethod(
                                        new Opt<>(new Identifier(arg)),
                                        "mj_clone",
                                        new ExprId(arg),
                                        new List<>()
                                ),
                                0
                        );
                    }
                    jsStmts.setStmtList(stmts);
                }
            }
        }

        List<Identifier> jsLocals = new List<>();
        for (String localName : locals) {
            jsLocals.add(new Identifier(localName));
        }

        return new Function(functionName, jsArgs, jsLocals, jsStmts);
    }

    private static void addReturn(TIRFunction tirFunction) {
        TIRStatementList stmts = tirFunction.getStmtList();
        TIRStmt ret = new TIRReturnStmt();
        stmts.add(ret);
        tirFunction.setStmtList(stmts);
    }

    private static TIRStatementList addReturn(TIRStatementList stmts) {
        TIRStmt ret = new TIRReturnStmt();
        stmts.add(ret);
        return stmts;
    }

    private static void performCopyInsertion(TIRFunction tirFunction) {
        // Identify the input parameters that need to be copied
        // and insert the appropriate MJCopyStmt nodes in tirFunction.
        Map<TIRStatementList, Set<String>> writtenParams = ParameterCopyAnalysis.apply(tirFunction);
        ParameterCopyTransformer.apply(tirFunction, writtenParams);

        // Insert copy statements to prevent aliasing.
        // 1. perform the points-to analysis
        // 2. insert MJCopyStmt nodes for one aliased variable
        // 3. re-run analysis and transformation
        // 4. iterate until fixed point
        PointsToAnalysis pta;
        do {
            pta = new PointsToAnalysis(tirFunction);
            tirFunction.tirAnalyze(pta);
        } while (CopyInsertion.apply(tirFunction, pta));
    }

    /**
     * Transform a Tamer statement into a JavaScript statement.
     * If an unsupported statement is passed, an exception
     * is thrown.
     */
    private Stmt genStmt(ast.Stmt tirStmt) {
        if (tirStmt instanceof MJCopyStmt)
            return genMJCopyStmt((MJCopyStmt) tirStmt);
        else if (tirStmt instanceof TIRCopyStmt)
            return genCopyStmt((TIRCopyStmt) tirStmt);
        else if (tirStmt instanceof TIRAssignLiteralStmt)
            return genAssignLiteralStmt((TIRAssignLiteralStmt) tirStmt);
        else if (tirStmt instanceof TIRArrayGetStmt)
            return genArrayGetStmt((TIRArrayGetStmt) tirStmt);
        else if (tirStmt instanceof TIRArraySetStmt)
            return genArraySetStmt((TIRArraySetStmt) tirStmt);
        else if (tirStmt instanceof TIRCallStmt)
            return genCallStmt((TIRCallStmt) tirStmt);
        else if (tirStmt instanceof TIRReturnStmt)
            return genReturnStmt((TIRReturnStmt) tirStmt);
        else if (tirStmt instanceof TIRBreakStmt)
            return new StmtBreak();
        else if (tirStmt instanceof TIRContinueStmt)
            return new StmtContinue();
        else if (tirStmt instanceof TIRIfStmt)
            return genIfStmt((TIRIfStmt) tirStmt);
        else if (tirStmt instanceof TIRWhileStmt)
            return genWhileStmt((TIRWhileStmt) tirStmt);
        else if (tirStmt instanceof TIRForStmt)
            return genForStmt((TIRForStmt) tirStmt);
        else if (tirStmt instanceof TIRCommentStmt) {
            // Return an empty sequence for a comment statement.
            return new StmtSequence();
        }
        else
            throw new UnsupportedOperationException(
                String.format("Statement not supported: %d. %s [%s]",
                  tirStmt.getStartLine(),
                  tirStmt.getPrettyPrinted(),
                  tirStmt.getClass().getName())
                );
    }

    private Stmt genMJCopyStmt(MJCopyStmt tirStmt) {
        String lhs = getSingleLhs(tirStmt);

        if(useWasm){
            List<Expr> args_input = new List<>();
            args_input.add(new ExprId(lhs));
            return new StmtCall(
                    new Opt<>(new Identifier(lhs)),
                    "wi.clone",
                    args_input
            );
        }else{
            return new StmtMethod(new Opt<>(new Identifier(lhs)), "mj_clone", new ExprId(lhs), new List<>());
        }


    }

    /**
     * Transform a statement of the form
     *   id1 = id2;
     * into JavaScript.  If id2 is not a scalar and may be written
     * to, we perform a deep copy.
     */
    private Stmt genCopyStmt(TIRCopyStmt tirStmt) {
        String lhs = getSingleLhs(tirStmt);
        Expr rhsExpr = genExpr(tirStmt.getRHS());
        if (doCopyInsertion) {
            return new StmtAssign(lhs, rhsExpr);
        } else {
            BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, tirStmt.getSourceName().getID());
            if (bmv.getShape().isScalar()) {
                return new StmtAssign(lhs, rhsExpr);
            } else {
                if(useWasm){
                    List<Expr> args_input = new List<>();
                    args_input.add(new ExprId(lhs));
                    return new StmtCall(
                            new Opt<>(new Identifier(lhs)),
                            "wi.clone",
                            args_input
                    );
                } else {
                    return new StmtMethod(
                            new Opt<>(new Identifier(lhs)),
                            "mj_clone",
                            rhsExpr,
                            new List<>()
                    );
                }

            }
        }
    }

    /**
     * Transform a statement of the form
     *   id = lit;
     * into JavaScript.  Literals are number literals (ints and floats),
     * strings, etc.
     */
    private Stmt genAssignLiteralStmt(TIRAssignLiteralStmt tirStmt) {
        String lhs = getSingleLhs(tirStmt);
        return new StmtAssign(lhs, genExpr(tirStmt.getRHS()));
    }

    /**
     * Transform a statement of the form
     *   return;
     * into JavaScript.  Because the way functions return values is
     * different in MATLAB and JavaScript, the helper `createReturnStmt`
     * performs some extra work.
     */
    private Stmt genReturnStmt(TIRReturnStmt tirStmt) {
        ast.Function astFunc = NodeFinder.findParent(ast.Function.class, tirStmt);
        return createReturnStmt(astFunc);
    }

    private Stmt createReturnStmt(ast.Function astFunc) {
        List<Identifier> returnNames = new List<>();
        for (ast.Name outParam: astFunc.getOutputParamList()) {
            returnNames.add(new Identifier(outParam.getID()));
        }

        // Choosing "return;", "return x;" or "return [x, y];"
        // is done in the pretty printer.
        return new StmtReturn(returnNames);
    }

    /**
     * Transform a call statement.  If the function is a MATLAB operator
     * (e.g. plus() or rem()), the call is replaced by a StmtBinop.  If
     * the function is a built-in, the "mc_" prefix is prepended and a
     * suffix describing the type (e.g. mc_plus_MM) will be appended.
     */
    private Stmt genCallStmt(TIRCallStmt tirStmt) {
        if (OperatorRenamer.isBasicArithmeticOperator(tirStmt, analysis)) {
            return genOp(tirStmt);
        }

        if(!useWasm) {
            List<Expr> args = new List<>();
            for (ast.Expr expr : tirStmt.getArguments()) {
                args.add(genExpr(expr));
            }

            String functionName = FunctionRenamer.getFunctionName(tirStmt, analysis, useWasm);

            if (tirStmt.isAssignToVar()) {
                return new StmtCall(
                        new Opt<Identifier>(new Identifier(tirStmt.getTargetName().getID())),
                        functionName,
                        args);
            }
            else if (tirStmt.getTargets().size() == 0) {
                return new StmtCall(
                        new Opt<Identifier>(),
                        functionName,
                        args);
            }
            else {
                String listTarget = newTemp();
                StmtCall funCall = new StmtCall(
                        new Opt<Identifier>(new Identifier(listTarget)),
                        functionName,
                        args);
                StmtSequence seq = new StmtSequence();
                seq.addStmt(funCall);
                int i = 0;
                for (ast.Expr expr : tirStmt.getTargets()) {
                    seq.addStmt(new StmtGet(
                            ((NameExpr) expr).getName().getID(),
                            listTarget,
                            new ExprInt(i)));
                    ++i;
                }
                return seq;
            }
        }else{

            String functionName = FunctionRenamer.getFunctionName(tirStmt, analysis, useWasm);
            boolean isVectorInput = FunctionRenamer.isVectorInput(tirStmt.getFunctionName().getID());
            boolean isBuiltIn = FunctionRenamer.isMatlabBuiltin(tirStmt.getFunctionName().getID());
            boolean isShapeBuiltin = FunctionRenamer.isShapeInput(tirStmt.getFunctionName().getID());
            boolean isBooleanBuiltin = tirStmt.getFunctionName().getID().equals("true")
                    ||tirStmt.getFunctionName().getID().equals("false");
            boolean isSpecialized = FunctionRenamer.isSpecializedFunction(tirStmt.getFunctionName().getID());
            boolean isAssignVar = tirStmt.isAssignToVar();
            boolean hasNoTarget = tirStmt.getTargets().size() == 0;
            boolean isListTarget = !isAssignVar && !hasNoTarget;
            StmtSequence seq = new StmtSequence();
            String listTarget = (isAssignVar) ? tirStmt.getTargetName().getID():(isListTarget)?newTemp():"";
            if(isBuiltIn && !isSpecialized) {
                // First process input
                if (isVectorInput) {
                    VectorBuiltinInputTransformer transformer = new VectorBuiltinInputTransformer(analysis, tirStmt, tirStmt.getArguments());
                    ResultInputTransformer result = transformer.transform();
                    seq = result.getStmts();
                    locals.addAll(result.getLocals());
                    List<Expr> args = new List<>(new ExprId(result.getTargetName()));
                    seq.addStmt(new StmtCall(new Opt<>(new Identifier(listTarget)),
                            "wi." + functionName,
                            args));
                } else if (isShapeBuiltin) {
                    ShapeBuiltinInputTransformer transformer =
                                new ShapeBuiltinInputTransformer(analysis, tirStmt, tirStmt.getArguments());
                    if (!transformer.isInForm()) {
                        ResultInputTransformer result = transformer.transform();
                        seq = result.getStmts();
                        locals.addAll(result.getLocals());
                        String input_target = result.getTargetName();
                        functionName = (isBuiltIn) ? "wi." + functionName : functionName;
                        seq.addStmt(new StmtCall(new Opt<>(new Identifier(listTarget)), functionName,
                                new List<>(new ExprId(input_target))));
                    } else {
                        genCallStmtDefaultInputWasm(seq, tirStmt, listTarget, isBuiltIn);
                    }
                }else if(FunctionRenamer.isOneMatrixAndShapeBuiltin(tirStmt.getFunctionName().getID())){
                    OneMatrixAndShapeBuiltinInputTransformer transformer =
                                new OneMatrixAndShapeBuiltinInputTransformer(analysis, tirStmt, tirStmt.getArguments());
                    if (!transformer.isInForm()) {
                        ResultInputTransformer result = transformer.transform();
                        seq = result.getStmts();
                        locals.addAll(result.getLocals());
                        String input_target = result.getTargetName();
                        NameExpr arrName = (NameExpr) transformer.matrix;
                        functionName = (isBuiltIn) ? "wi." + functionName : functionName;
                        seq.addStmt(new StmtCall(new Opt<>(new Identifier(listTarget)), functionName,
                                new List<>(new ExprId(arrName.getName().getID()), new ExprId(input_target))));
                    } else {
                        genCallStmtDefaultInputWasm(seq, tirStmt, listTarget, isBuiltIn);
                    }

                }else if(isBooleanBuiltin){
                    // TODO Fix this, tirStmt.getArguments().size() does not guarantee that is not a scalar
                    if(tirStmt.getArguments().size() > 0){
                        throw new Error("No support for current boolean builtins false|true that are not scalar");
                    }
                    seq.addStmt(new StmtAssign(listTarget,new ExprId(functionName)));
                    // TODO FIX THIS, this is incorrect. Assumption is that there is a lhs. Also
                    return seq;
                }else{
                    genCallStmtDefaultInputWasm(seq, tirStmt, listTarget,isBuiltIn);
                }
            }else{
                genCallStmtDefaultInputWasm(seq, tirStmt,listTarget, isBuiltIn);
            }
            // Generate result using list
            genAssignTargetsFromResult(seq,tirStmt, tirStmt.getArguments(), tirStmt.getFunctionName().getID(),listTarget,isListTarget, isAssignVar );
            return seq;
        }

    }
    private void genAssignTargetsFromResult(StmtSequence seq, TIRNode tirStmt, TIRCommaSeparatedList arguments,
                                            String callName, String listTarget, boolean isListTarget, boolean isAssignVar){
        if(isListTarget){
            int i = 1;
            TIRCallStmt call = (TIRCallStmt)tirStmt;
            for (ast.Expr expr :call.getTargets()){
                List<Expr> args_input = new List<Expr>();
                args_input.add(new ExprId(listTarget));
                args_input.add(new ExprInt(i));
                seq.addStmt(new StmtCall(
                        new Opt<>(new Identifier(((NameExpr) expr).getName().getID())),
                        "wi.get_array_index_f64",
                        args_input
                ));
                i++;
            }
        }else if(isAssignVar
                && !FunctionRenamer.isScalarOutput(
                callName)){
            if(FunctionRenamer.isSpecializedFunction(callName)){
                String suffix = FunctionRenamer.toSuffix((TIRCallStmt)tirStmt,  analysis);
                if(!suffix.contains("M")) return;
            }
            BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt,
                    listTarget);

            if(bmv.hasShape() && bmv.getShape().isScalar() && Builtin.getInstance(callName)!= null){
                seq.addStmt(new StmtCall(
                        new Opt<>(new Identifier(listTarget)),
                        "wi.get_array_index_f64",
                        new List<>(new ExprId(listTarget), new ExprInt(1))
                ));
            }
        }
    }
    private void genCallStmtDefaultInputWasm(StmtSequence seq, TIRCallStmt tirStmt, String listTarget, boolean isBuiltIn){
        List<Expr> args = new List<>();
        String functionName = FunctionRenamer.getFunctionName(tirStmt, analysis, useWasm);
        for (ast.Expr expr : tirStmt.getArguments()) {
            args.add(genExpr(expr));
        }
        boolean hasTarget = tirStmt.getNumTargets() > 0;
        functionName = (isBuiltIn)?"wi."+functionName:functionName;
        seq.addStmt(new StmtCall(
                (hasTarget)?new Opt<>(new Identifier(listTarget)):new Opt<>(),
                functionName,
                args));

    }

//    private Stmt genCallStmtWasm(TIRCallStmt tirStmt) {
//        String matlabFunctionName = tirStmt.getFunctionName().getID();
        // Take care of input arguments
        // take care of function call, is it specialized? Is it not specialized?
        // Then check how tirStmt is called.
        // Use get_scalar if scalar
//        Builtin builtin = Builtin.getInstance(tirStmt.getFunctionName().getID());
//        if(builtin == null){
////            ArgWasmInputBuiltinVisitor args = new ArgWasmInputBuiltinVisitor(analysis, tirStmt);
////            BuiltinWasmGeneratorVisitor visitor = new BuiltinWasmGeneratorVisitor();
////        BuiltinWasmGeneratorVisitor    StmtSequence seq = builtin.visit(visitor, args);
//        }else{
//
//        }
//        return null;
//    }


    /**
     * Transform an operator function call into an operator operation.
     * E.g. plus(x, y) => x+y
     */
    private Stmt genOp(TIRCallStmt tirStmt) {
        java.util.List<Expr> args = new java.util.ArrayList<>();
        for (ast.Expr arg : tirStmt.getArguments()) {
            args.add(genExpr(arg));
        }
        return OperatorRenamer.renameOperator(tirStmt, args);
    }


    /**
     * Transform a MATLAB array fetching operation into a JavaScript get
     * operation.  If the indices might represent a slice, a call to the
     * dynamic "mc_slice_get" function is made.  If all the indices are scalars
     * we convert them to a linearized index, perform bounds check on that index
     * and generate a JavaScript StmtGet.
     */
    private Stmt genArrayGetStmt(TIRArrayGetStmt tirStmt) {
        String dst = getSingleLhs(tirStmt);
        String src = tirStmt.getArrayName().getID();
            if (isSlicingOperation(tirStmt, tirStmt.getIndices())) {
                if(useWasm){
                    boolean isAssignVar = tirStmt.getTargets().size() ==1;
                    boolean isListTarget = tirStmt.getTargets().size()>1;
                    String listTarget = (isAssignVar)?
                            tirStmt.getTargetName().getID():(isListTarget)?newTemp():"";
                    // TODO: (dherre3) add other indexing expressions
                    VectorBuiltinInputTransformer transformer = new VectorBuiltinInputTransformer(analysis,tirStmt, tirStmt.getIndices());
                    ResultInputTransformer result = transformer.transform();
                    StmtSequence seq = result.getStmts();
                    locals.addAll(result.getLocals());
                    List<Expr> args = new List<>(new ExprId(tirStmt.getArrayName().getID()),new ExprId(result.getTargetName()));
                    seq.addStmt(new StmtCall(new Opt<>(new Identifier(listTarget)),
                            "wi.get_f64",
                            args));
                    genAssignTargetsFromResult(seq,tirStmt, tirStmt.getIndices(), "",
                            listTarget,isListTarget, isAssignVar );
                    return seq;
                }else {
                    ExprList indices = new ExprList();
                    for (ast.Expr index : tirStmt.getIndices()) {
                        indices.addValue(genExpr(index));
                    }
                    List<Expr> args = new List<>(new ExprId(src), indices);
                    return new StmtCall(new Opt<Identifier>(new Identifier(dst)), "mc_slice_get", args);

                }

            }
            else {
                ExprList indices = new ExprList();
                for (ast.Expr index : tirStmt.getIndices()) {
                    indices.addValue(genExpr(index));
                }
                if( useWasm ){
                    return genArrayGetStmtIndicesWasm( tirStmt, dst, src, indices);
                } else {
                    Expr indexingExpr = computeIndexJS(tirStmt, src, indices);
                    return new StmtGet(dst, src, indexingExpr);
                }
            /*
                List<Expr> args = new List<>(indices);
                return new StmtMethod(new Opt<Identifier>(new Identifier(dst)), "mj_get", new ExprId(src), args);
            */
            }
    }

    private Stmt genArrayGetStmtIndicesWasm(TIRArrayGetStmt node,  String dst, String arrayName, ExprList indices) {
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, node, arrayName);
        // Special case: row or column vector, indexing with only one expression.
        if ((bmv.getShape().isRowVector() || bmv.getShape().isColVector()) && indices.getNumValue() == 1) {
            Expr idx = indices.getValue(0);
            List<Expr> args = new List<Expr>(new ExprId(arrayName), idx);
            return new StmtCall(new Opt<>(new Identifier(dst)), "wi.get_array_index_f64", args);
        }else {
            StmtSequence seq = new StmtSequence();
            Expr expIndex = computeIndexWasm(node, arrayName,  indices);
            List<Expr> args = new List<>(new ExprId(arrayName), expIndex);
            return new StmtCall(new Opt<>(new Identifier(dst)), "wi.get_array_index_f64", args);
//            String indeces_arr = newTemp();
//            seq.addStmt(new StmtCall(new Opt<>(new Identifier(indeces_arr)),
//                    "wi.create_mxvector",new List<>(new ExprInt(node.getIndices().size()))));
//            int i =1;
//            for (ast.Expr index : node.getIndices()) {
//                NameExpr nameExpr = (NameExpr) index;
//                seq.addStmt(new StmtCall(new Opt<>(),
//                        "wi.set_array_index_f64",new List<>(
//                        new ExprId(indeces_arr),
//                        new ExprInt(i),
//                        new ExprId(nameExpr.getName().getID())
//
//                )));
//                i++;
//            }
//            seq.addStmt(new StmtCall(new Opt<>(new Identifier(dst)),
//                    "wi.get_array_value_multiple_indeces_f64",
//                    new List<>(new ExprId(node.getArrayName().getID()),
//                            new ExprId(indeces_arr))));
//
//
//
//            String tempArgList = newTemp();
//            List<Expr> input_args_vec = new List<>();
//            input_args_vec.add(new ExprInt(1));
//            input_args_vec.add(new ExprInt(5));
//            seq.addStmt(
//                    new StmtCall(
//                            new Opt<Identifier>(new Identifier(tempArgList)),
//                            "wi.create_mxvector",
//                            input_args_vec
//                    ));
//            // create array for inputs
//            String listArgsTarget = newTemp();
//            input_args_vec = new List<>(new ExprInt(indices.getNumValue()));
//            seq.addStmt(
//                    new StmtCall(
//                            new Opt<Identifier>(new Identifier(listArgsTarget)),
//                            "wi.create_mxvector",
//                            input_args_vec
//                    ));
//
//            setWasmDoubleArrayWithValues(indices, seq, listArgsTarget);
//            input_args_vec = new List<>(new ExprId(tempArgList),
//                    new ExprInt(1),new ExprId(listArgsTarget));
//            seq.addStmt(
//                    new StmtCall(
//                            new Opt<Identifier>(),
//                            "wi.set_array_index_i32",
//                            input_args_vec
//                    ));
//            String targetValTemp = newTemp();
//            List<Expr> set_args = new List<>(new ExprId(arrayName), new ExprId(tempArgList));
//            seq.addStmt(
//                    new StmtCall(
//                            new Opt<>(new Identifier(targetValTemp)),
//                            "wi.get_f64",
//                            set_args
//                    ));
//            seq.addStmt(
//                    new StmtCall(
//                            new Opt<>(new Identifier(dst)),
//                            "wi.get_array_index_f64",
//                            new List<>(new ExprId(targetValTemp),new ExprInt(1))
//                    ));
//            return seq;
        }
    }


    /**
     * Transform a MATLAB array set operation into a JavaScript set
     * operation.  If the indices might represent a slice, a call to the
     * dynamic "mc_slice_set" function is made.  If all the indices are scalars
     * we convert them to a linearized index, perform bounds check on that index
     * and generate a JavaScript StmtSet.
     */
    private Stmt genArraySetStmt(TIRArraySetStmt tirStmt) {
        String arr = tirStmt.getArrayName().getID();
        String val = tirStmt.getValueName().getID();
        if (isSlicingOperation(tirStmt, tirStmt.getIndices())) {
            if(useWasm){
                VectorBuiltinInputTransformer transformer = new VectorBuiltinInputTransformer(analysis, tirStmt, tirStmt.getIndices());
                ResultInputTransformer result = transformer.transform();
                StmtSequence seq = result.getStmts();
                locals.addAll(result.getLocals());
                // Generate values

                // Get shape of rhs
                BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, val);
                if(!bmv.hasShape()){
                    throw new Error("Shape information necessary for compilation");
                }
                String valArr = "" ;
                if(bmv.getShape().isScalar()){
                    valArr = newTemp();
                    seq.addStmt(new StmtCall(new Opt<>(new Identifier(valArr)),
                            "wi.create_mxvector",
                            new List<>(new ExprInt(1))));
                    seq.addStmt(new StmtCall(new Opt<>(),
                            "wi.set_array_index_f64",
                            new List<>(new ExprId(valArr), new ExprInt(1),
                                    genExpr(tirStmt.getRHS()))));
                }else{
                    valArr = ((NameExpr) tirStmt.getRHS()).getName().getID();
                }

                seq.addStmt(new StmtCall(new Opt<>(),
                        "wi.set_f64",
                        new List<>(new ExprId(tirStmt.getArrayName().getID()),
                                new ExprId(result.getTargetName()) ,
                                new ExprId(valArr))));
                return seq;
            }else{
                ExprList indices = new ExprList();
                for (ast.Expr index : tirStmt.getIndices()) {
                    indices.addValue(genExpr(index));
                }

                List<Expr> args = new List<>(new ExprId(arr), new ExprId(val), indices);

                BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, val);
                if (bmv.getShape().isScalar()) {
                    return new StmtCall(new Opt<Identifier>(), "mc_slice_set_scalar", args);
                }
                else {
                    return new StmtCall(new Opt<Identifier>(), "mc_slice_set", args);
                }
            }

        }
        else {

            if(useWasm){
                //set_array_value_multiple_indeces_f64
            //			wi.set_array_value_multiple_indeces_f64(arr._arr_ptr,values.arr_ptr, 100);
//                StmtSequence seq = new StmtSequence();
//                String indeces_arr = newTemp();
//                seq.addStmt(new StmtCall(new Opt<>(new Identifier(indeces_arr)),
//                        "wi.create_mxvector",new List<>(new ExprInt(tirStmt.getIndices().size()))));
//                int i =1;
//                for (ast.Expr index : tirStmt.getIndices()) {
//                    NameExpr nameExpr = (NameExpr) index;
//                    seq.addStmt(new StmtCall(new Opt<>(),
//                            "wi.set_array_index_f64",new List<>(
//                                    new ExprId(indeces_arr),
//                                    new ExprInt(i),
//                                    new ExprId(nameExpr.getName().getID())
//
//                    )));
//                    i++;
//                }
//
//
//                seq.addStmt(new StmtCall(new Opt<>(),
//                            "wi.set_array_value_multiple_indeces_f64",
//                            new List<>(new ExprId(tirStmt.getArrayName().getID()),
//                                    new ExprId(indeces_arr) ,
//                                    genExpr(tirStmt.getRHS()))));
//                return seq;

                ExprList indices = new ExprList();
                for (ast.Expr index : tirStmt.getIndices()) {
                    indices.addValue(genExpr(index));
                }
                Expr indexExp = computeIndexWasm(tirStmt, tirStmt.getArrayName().getID(),indices);
                return new StmtCall(new Opt<>(),
                        "wi.set_array_index_f64",
                        new List<>(new ExprId(tirStmt.getArrayName().getID()),
                                indexExp,
                                genExpr(tirStmt.getRHS())));




            }else {
                ExprList indices = new ExprList();
                for (ast.Expr index : tirStmt.getIndices()) {
                    indices.addValue(genExpr(index));
                }

                Expr indexExp = computeIndexJS(tirStmt, arr, indices);
                return new StmtSet(arr, indexExp, val);
            /*
            List<Expr> args = new List<>(new ExprId(val), indices);
            return new StmtMethod(
                new Opt<>(new Identifier(arr)),
                "mj_set",
                new ExprId(arr),
                args);
            */
            }
        }
    }

    /**
     * Transform a MATLAB if statement into a JavaScript if statement.  The
     * pretty printer is responsible for not displaying the else part if it
     * contains 0 statements.
     */
    private Stmt genIfStmt(TIRIfStmt tirStmt) {
        String condVar = tirStmt.getConditionVarName().getID();
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, condVar);
        boolean isScalar = bmv.getShape().isScalar();
        if (isScalar) {
            return new StmtIf(
                condVar,
                genStmtList(tirStmt.getIfStatements()),
                genStmtList(tirStmt.getElseStatements()));
        } else {
            String temp = newTemp();
            StmtSequence seq = new StmtSequence();
            seq.addStmt(new StmtCall(
                  new Opt<>(new Identifier(temp)),
                  "mj_forall",
                  new List<>(new ExprId(condVar))
              )
            );
            seq.addStmt(new StmtIf(
                  temp,
                  genStmtList(tirStmt.getIfStatements()),
                  genStmtList(tirStmt.getElseStatements())
              )
            );
            return seq;
        }
    }

    /**
     * Transform a MATLAB while statement into JavaScript.
     */
    private Stmt genWhileStmt(TIRWhileStmt tirStmt) {
        String condVar = tirStmt.getCondition().getName().getID();
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, condVar);
        boolean isScalar = bmv.getShape().isScalar();
        return new StmtWhile(
            isScalar ? new ExprId(condVar) : new ExprAny(String.format("mc_forall(%s)", condVar)),
            genStmtList(tirStmt.getStatements())
        );
    }

    /**
     * Transform a MATLAB for loop into an equivalent JavaScript
     * while loop.  For simplicity's sake, our JavaScript IR does
     * not have a for loop.
     */
    private Stmt genForStmt(TIRForStmt tirStmt) {
        LoopDirection direction = loopDir(tirStmt);
        switch (direction) {
        case Ascending:
        case Descending:
            return genStaticForStmt(tirStmt, direction);
        case Unknown:
            return genDynamicForStmt(tirStmt);
        default:
            /* UNREACHABLE */
            return genDynamicForStmt(tirStmt);
        }
    }


    /**
     * Generate a for loop when the direction can be known statically.
     */
    private Stmt genStaticForStmt(TIRForStmt tirStmt, LoopDirection direction) {
        Binop cmpOp = (direction == LoopDirection.Ascending) ? Binop.Le : Binop.Ge;
        String iterVar = tirStmt.getLoopVarName().getID();
        Expr incr = tirStmt.hasIncr() ? new ExprId(tirStmt.getIncName().getID()) : new ExprInt(1);
        StmtSequence body = genStmtList(tirStmt.getStatements());

        return new StmtFor(
            iterVar,
            new ExprId(tirStmt.getLowerName().getID()),
            new ExprId(tirStmt.getUpperName().getID()),
            incr,
            cmpOp,
            Binop.Add,
            body
            );
    }


    private Stmt genDynamicForStmt(TIRForStmt tirStmt) {
        String testFunc = newTemp();
        StmtSequence seq = new StmtSequence();

        Expr from = new ExprId(tirStmt.getLowerName().getID());
        Expr to = new ExprId(tirStmt.getUpperName().getID());
        Expr step = tirStmt.hasIncr() ? new ExprId(tirStmt.getIncName().getID()) : new ExprInt(1);
        Expr loopVar = new ExprId(tirStmt.getLoopVarName().getID());

        seq.addStmt(new StmtCall(
              new Opt<Identifier>(new Identifier(testFunc)),
              "loop_direction",
              new List<Expr>(from, step, to)
              )
            );

        String testVar = newTemp();
        seq.addStmt(new StmtCall(new Opt<>(new Identifier(testVar)), testFunc, new List<Expr>(loopVar, to)));

        StmtSequence body = genStmtList(tirStmt.getStatements());
        body.addStmt(new StmtBinop(
              tirStmt.getLoopVarName().getID(),
              Binop.Add,
              loopVar,
              step));
        body.addStmt(new StmtCall(
              new Opt<>(new Identifier(testVar)),
              testFunc,
              new List<>(loopVar, to)));
        seq.addStmt(new StmtWhile(new ExprId(testVar), body));
        return seq;
    }

    private StmtSequence genStmtList(TIRStatementList tirStmts) {
        StmtSequence seq = new StmtSequence();
        for (ast.Stmt stmt : tirStmts) {
            seq.addStmt(genStmt(stmt));
        }
        return seq;
    }


    private Expr genExpr(ast.Expr expr) {
        if (expr instanceof ast.IntLiteralExpr)
            return genIntLiteralExpr((ast.IntLiteralExpr) expr);
        if (expr instanceof ast.FPLiteralExpr)
            return genFPLiteralExpr((ast.FPLiteralExpr) expr);
        if (expr instanceof ast.StringLiteralExpr){
            return genStringLiteralExpr((ast.StringLiteralExpr) expr);
        }
        if (expr instanceof ast.NameExpr)
            return genNameExpr((ast.NameExpr) expr);
        if (expr instanceof ast.ColonExpr)
            return new ExprId("MC_COLON");

        throw new UnsupportedOperationException(
            String.format("Expr node not supported. %d:%d: [%s] [%s]",
              expr.getStartLine(), expr.getStartColumn(),
              expr.getPrettyPrinted(), expr.getClass().getName())
            );
    }

    /**
     * Convert an integer literal into JavaScript.
     * @param expr
     * @return
     */
    private ExprInt genIntLiteralExpr(ast.IntLiteralExpr expr) {
        return new ExprInt(Integer.parseInt(expr.getValue().getText()));
    }


    /**
     * Convert a double literal into JavaScript.
     * @param expr
     * @return
     */
    private ExprFloat genFPLiteralExpr(ast.FPLiteralExpr expr) {
        return new ExprFloat(Double.parseDouble(expr.getValue().getText()));
    }



    /**
     * Convert a string literal into JavaScript.
     *
     * TODO: handle escaping.
     * @param expr
     * @return
     */
    private ExprString genStringLiteralExpr(ast.StringLiteralExpr expr) {
        String value = expr.getValue();
        StringBuffer buf = new StringBuffer();
        for (int i = 0; i < value.length(); ++i) {
            if (value.charAt(i) == '"')
                buf.append("\\\"");
            else
                buf.append(value.charAt(i));
        }
        return new ExprString(buf.toString());
    }

    private Expr genNameExpr(ast.NameExpr expr) {
        String varName = expr.getName().getID();
        return new ExprId(varName);
    }

    private static String getSingleLhs(TIRAbstractAssignToVarStmt tirStmt) {
        String ret = null;
        for (String name : tirStmt.getLValues())
            ret = name;
        return ret;
    }

    private String getSingleLhs(TIRAbstractAssignToListStmt tirStmt) {
        String ret = null;
        for (String name : tirStmt.getLValues())
            ret = name;
        return ret;
    }

    /**
     * Take a list of 1-based indices and generate a 0-based linearized index that will be stored
     * in the variable name referred by [linearizedIndex].
     */
    private StmtSequence genIndexingComputation(TIRStmt tirStmt, String arrayName, TIRCommaSeparatedList indices, String linearizedIndex) {
        // Small optimization for when indexing is done with a single index.
        if (indices.size() == 1) {
            return new StmtSequence(new List<>(
                  new StmtBinop(linearizedIndex, Binop.Sub, new ExprId(indices.getName(0).getID()), new ExprInt(1))
                  ));
        }

        // General case for >= 2 indices.
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, arrayName);
        java.util.List<DimValue> dims = bmv.getShape().getDimensions();

        StmtSequence seq = new StmtSequence();

        String stride = newTemp();
        String scratch = newTemp();

        seq.addStmt(new StmtAssign(stride, new ExprInt(1)));
        seq.addStmt(new StmtAssign(linearizedIndex, new ExprInt(0)));

        int i = 0;
        for (ast.Expr tirIndex : indices) {
            seq.addStmt(new StmtBinop(scratch, Binop.Sub, genExpr(tirIndex), new ExprInt(1)));
            seq.addStmt(new StmtBinop(scratch, Binop.Mul, new ExprId(scratch), new ExprId(stride)));
            seq.addStmt(new StmtBinop(linearizedIndex, Binop.Add, new ExprId(linearizedIndex), new ExprId(scratch)));

            int dimensionSize = (i < dims.size() && dims.get(i).hasIntValue()) ? dims.get(i).getIntValue() : 1;
            seq.addStmt(new StmtBinop(stride, Binop.Mul, new ExprId(stride), new ExprInt(dimensionSize)));
            ++i;
        }
        return seq;
    }

    private boolean isSlicingOperation(TIRStmt tirStmt, TIRCommaSeparatedList indices) {
        for (ast.Expr index : indices) {
            if (index instanceof ast.ColonExpr)
                return true;
            if (index instanceof ast.NameExpr) {
                ast.Name indexName = ((ast.NameExpr) index).getName();
                BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, indexName.getID());
                if (!bmv.getShape().isScalar())
                    return true;
            }
        }
        return false;
    }

    private String newTemp() {
        String tmp = TempFactory.genFreshTempString();
        locals.add(tmp);
        return tmp;
    }

    /**
     * Try to statically determine whether a for loop is ascending or descending.
     * @param forStmt the foor loop
     * @return an enum value that says whether the loop ascends, descends or its direction is unknown.
     */
    private LoopDirection loopDir(TIRForStmt forStmt) {
        // If no explicit increment, then it defaults to 1.
        if (!forStmt.hasIncr()) {
            return LoopDirection.Ascending;
        }

        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, forStmt, forStmt.getIncName().getID());

        if (bmv.hasRangeValue()) {
            if (bmv.getRangeValue().isRangeValuePositive())
                return LoopDirection.Ascending;
            else if (bmv.getRangeValue().isRangeValueNegative())
                return LoopDirection.Descending;
            else
                return LoopDirection.Unknown;
        }else {
            return LoopDirection.Unknown;
        }
    }

    private Integer[] computeStride(TIRNode node, String arrayName) {
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, node, arrayName);
        int numDimensions = bmv.getShape().getDimensions().size();
        Integer[] stride = new Integer[numDimensions];
        stride[0] = 1;

        for (int i = 1; i < numDimensions; ++i) {
            DimValue dv = bmv.getShape().getDimensions().get(i-1);
            if (dv.hasIntValue()) {
                stride[i] = stride[i-1] * dv.getIntValue();
            } else {
                break;
            }
        }

        return stride;
    }
    private Expr computeIndexWasm(TIRNode node, String arrayName, ExprList indices) {
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, node, arrayName);
        // Special case: row or column vector, indexing with only one expression.
        if ((bmv.getShape().isRowVector() || bmv.getShape().isColVector()) && indices.getNumValue() == 1) {
            Expr idx = indices.getValue(0);
            return  idx;
        }
        Integer[] stride = computeStride(node, arrayName);
        Expr indexExp = new ExprOp(Binop.Sub, indices.getValue(0), new ExprInt(1));
        for (int i = 1; i < indices.getNumValue(); ++i) {
            Expr strideExp;
            if (stride[i] != null) {
                strideExp = new ExprInt(stride[i]);
            } else {
                strideExp = new ExprAny(String.format("wi.get_array_stride(%s, %d)", arrayName, i));
            }
            indexExp = new ExprOp(
                    Binop.Add,
                    indexExp,
                    new ExprOp(Binop.Mul, strideExp, new ExprOp(Binop.Sub, indices.getValue(i), new ExprInt(1)))
            );
        }
        indexExp = new ExprOp(Binop.Add, indexExp, new ExprInt(1));
        return indexExp;
    }
    private Expr computeIndexJS(TIRNode node, String arrayName, ExprList indices) {
        BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, node, arrayName);
        // Special case: row or column vector, indexing with only one expression.
        if ((bmv.getShape().isRowVector() || bmv.getShape().isColVector()) && indices.getNumValue() == 1) {
            Expr idx = indices.getValue(0);
            return new ExprOp(Binop.Sub, idx, new ExprInt(1));
        }
        Integer[] stride = computeStride(node, arrayName);
        Expr indexExp = new ExprOp(Binop.Sub, indices.getValue(0), new ExprInt(1));
        for (int i = 1; i < indices.getNumValue(); ++i) {
            Expr strideExp;
            if (stride[i] != null) {
                strideExp = new ExprInt(stride[i]);
            } else {
                strideExp = new ExprAny(String.format("%s.mj_stride()[%d]", arrayName, i));
            }
            indexExp = new ExprOp(
                Binop.Add,
                indexExp,
                new ExprOp(Binop.Mul, strideExp, new ExprOp(Binop.Sub, indices.getValue(i), new ExprInt(1)))
            );
        }
        return indexExp;
    }
}
