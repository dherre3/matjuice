package matjuice.builtin_input;

import ast.ColonExpr;
import ast.NameExpr;
import matjuice.jsast.*;
import matjuice.utils.Utils;
import natlab.tame.tir.*;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.components.shape.DimValue;
import natlab.toolkits.rewrite.TempFactory;

import java.util.ArrayList;

public class VectorBuiltinInputTransformer extends AbstractBuiltinInputTransformer<ResultInputTransformer> {
    public VectorBuiltinInputTransformer(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis, TIRNode stmt,
                                         TIRCommaSeparatedList arguments) {
        super(analysis, stmt,arguments );
    }
    public static void main(String[] args){
        System.out.println(generateParenthesis(4));
    }

    public static java.util.List<String> generateParenthesis(int n) {
        java.util.List<String> res = new ArrayList<>();
        if(n == 0) return res;
        java.util.List<String> nLess = generateParenthesis(n-1);
        if(nLess.isEmpty()) {
            res.add("()");
            return res;
        }
        for(String str: nLess){
            res.add( "(" + str + ")" );
            String str2 = "()" + str;
            String str3 = str + "()";
            if(!str2.equals(str3)){
                res.add( str2);
                res.add( str3);
            }else{
                res.add( str2);
            }

        }
        return res;
    }
    @Override
    public boolean isInForm() {
        return false; // Not all are Shape transformation of inputs
    }

    @Override
    protected ResultInputTransformer convertInput() {
            TIRCommaSeparatedList arguments = this.arguments;
            ResultInputTransformer result = new ResultInputTransformer();

            List<Expr> args = new List<>();
            // Create
            String input_arg = TempFactory.genFreshTempString();
            result.locals.add(input_arg);
            result.setTargetName(input_arg);
            result.addStmts(new StmtCall(
                    new Opt<>(new Identifier(input_arg)),
                    "wi.create_mxvector",
                    new List<Expr>(new ExprInt(arguments.size()), new ExprInt(5))
            ));
            // Go through each argument, if some are actual scalars
            int i = 1;
            for (ast.Expr expr :arguments) {
                if(expr instanceof NameExpr){
                    NameExpr nameExpr = (NameExpr) expr;
                    String name = nameExpr.getName().getID();
                    BasicMatrixValue bmv = Utils.getBasicMatrixValue(valueAnalysis, stmt, nameExpr.getName().getID());
                    if( bmv.getShape().isScalar()) {
                        name = TempFactory.genFreshTempString();
                        result.locals.add(name);
                        // Convert to array
                        result.addStmts(new StmtCall(new Opt<>(new Identifier(name)),"wi.convert_scalar_to_mxarray",
                                new List<Expr>(new ExprId(nameExpr.getName().getID()))));

                    }
                    result.addStmts(new StmtCall(
                            new Opt<>(),
                            "wi.set_array_index_i32",
                            new List<Expr>(new ExprId(input_arg),
                            new ExprInt(i), new ExprId(name))
                    ));

                }else if(expr instanceof ColonExpr){
                    String arrayName = (stmt instanceof TIRArrayGetStmt)?
                            ((TIRArrayGetStmt) stmt).getArrayName().getID():
                            ((TIRArraySetStmt) stmt).getArrayName().getID();
                    BasicMatrixValue bmv = Utils.getBasicMatrixValue(valueAnalysis, stmt,arrayName);
                    if(!bmv.hasShape()){
                        throw new Error("Could not get value shape for array name: "+arrayName);
                    }
                    java.util.ArrayList<String> l = new ArrayList<>();

                    java.util.List<DimValue> dimValues = bmv.getShape().getDimensions();
                    int val = dimValues.get(i-1).getIntValue();
                    String name = TempFactory.genFreshTempString();
                    result.locals.add(name);

                    result.addStmts(new StmtCall(new Opt<>(new Identifier(name)),"wi.colon_two",
                            new List<>(new ExprInt(1),new ExprInt(val))));
                    if(arguments.size() == 1){
                        result.addStmts(new StmtCall(new Opt<>(new Identifier(name)),"wi.transpose_M",
                                new List<>(new ExprId(name))));
                    }
                    result.addStmts(new StmtCall(
                            new Opt<>(),
                            "wi.set_array_index_i32",
                            new List<Expr>(new ExprId(input_arg),
                                    new ExprInt(i), new ExprId(name))
                    ));
                }
                else{
                    throw new Error("Only named expressions allowed");
                }
                i++;
            }
        return result;
    }
}
