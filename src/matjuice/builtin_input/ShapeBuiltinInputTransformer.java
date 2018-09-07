/*
 *  Copyright (c) 2018. David Fernando Herrera, McGill University
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 *  this file except in compliance with the License.
 *  You may obtain a copy of the License at:
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under
 *  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 *  OF ANY KIND, either express or implied. See the License for the specific language
 *  governing permissions and limitations under the License.
 */

package matjuice.builtin_input;

import ast.FPLiteralExpr;
import ast.Name;
import ast.NameExpr;
import matjuice.jsast.*;
import matjuice.utils.Utils;
import natlab.FPNumericLiteralValue;
import natlab.tame.tir.TIRCallStmt;
import natlab.tame.tir.TIRCommaSeparatedList;
import natlab.tame.tir.TIRNode;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.components.shape.DimValue;
import natlab.toolkits.rewrite.TempFactory;

import java.util.ArrayList;
import java.util.HashSet;

public class ShapeBuiltinInputTransformer extends AbstractBuiltinInputTransformer<ResultInputTransformer> {

    public ShapeBuiltinInputTransformer(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis,
                                        TIRNode stmt, TIRCommaSeparatedList arguments) {
        super(analysis, stmt, arguments);
    }

    public boolean isInForm() {
        if(arguments.size() == 1){
            NameExpr nameExpr = (NameExpr)arguments.getChild(0);
            BasicMatrixValue bmv = Utils.getBasicMatrixValue(valueAnalysis,stmt,
                    nameExpr.getName().getID());
            if(bmv.hasShape()&&!bmv.getShape().isScalar() && bmv.getShape().getDimensions().size() == 2){
                java.util.List<DimValue> dimValues = bmv.getShape().getDimensions();
                return dimValues.get(0).getIntValue() == 1 && dimValues.get(1).getIntValue() >= 2;
            }
        }
        return false;
    }

    @Override
    public ResultInputTransformer convertInput() {
        ResultInputTransformer result = new ResultInputTransformer();
        TIRCommaSeparatedList args = arguments;
        int sizeArgs = arguments.size();
        String input_arg = TempFactory.genFreshTempString();
        result.setTargetName(input_arg);
        result.addLocal(input_arg);
        if(sizeArgs == 0){
            result.addStmts(new StmtCall(
                    new Opt<>(new Identifier(input_arg)),
                    "wi.create_mxvector",
                    new List<>(new ExprInt(2))
            ));
            result.addStmts(new StmtCall(
                    new Opt<>(),
                    "wi.set_array_index_f64",
                    new List<>(new ExprId(input_arg),new ExprInt(1),
                            new ExprInt(1))
            ),new StmtCall(
                    new Opt<>(),
                    "wi.set_array_index_f64",
                    new List<>(new ExprId(input_arg),new ExprInt(2),new ExprInt(1))
            ));
        }else if(sizeArgs == 1){
            NameExpr nameExpr = (NameExpr)arguments.getChild(0);
            BasicMatrixValue bmv = Utils.getBasicMatrixValue(valueAnalysis,stmt,
                    nameExpr.getName().getID());
            if(bmv.hasShape() && bmv.getShape().isScalar()){
                result.addStmts(new StmtCall(
                        new Opt<>(new Identifier(input_arg)),
                        "wi.create_mxvector",
                        new List<Expr>(new ExprInt(2))
                ));
                result.addStmts(new StmtCall(
                        new Opt<>(),
                        "wi.set_array_index_f64",
                        new List<Expr>(new ExprId(input_arg),new ExprInt(1),
                                new ExprId(((NameExpr)args.getChild(0)).getName().getID()))
                ));
                result.addStmts(new StmtCall(
                        new Opt<>(),
                        "wi.set_array_index_f64",
                        new List<Expr>(new ExprId(input_arg),new ExprInt(2),
                                new ExprId(((NameExpr)args.getChild(0)).getName().getID()))
                ));
            }else if(bmv.hasShape()&&!bmv.getShape().isRowVector()) {
                throw new Error("Size vector should be a row vector with real elements.");
            }
        }else{
            result.addStmts(new StmtCall(
                    new Opt<>(new Identifier(input_arg)),
                    "wi.create_mxvector",
                    new List<>(new ExprInt(sizeArgs))
            ));
            // There are more than two arguments
            int i = 0;
            for(ast.Expr argExpr: arguments){
                ast.NameExpr nameExpr = (ast.NameExpr) argExpr;
                BasicMatrixValue matVal = Utils.getBasicMatrixValue(valueAnalysis,stmt, nameExpr.getName().getID());
                System.out.println(matVal);
                if(!matVal.hasShape() || !matVal.getShape().isScalar()){
                    throw new Error("Size inputs must be scalar.");
                }
                result.addStmts(new StmtCall(
                        new Opt<>(),
                        "wi.set_array_index_f64",
                        new List<>(new ExprId(input_arg),new ExprInt(i+1),
                                new ExprId(nameExpr.getName().getID()))
                ));
                i++;
            }
        }
        return result;
    }
}
