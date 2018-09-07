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

import matjuice.utils.Utils;


import java.util.*;

import natlab.tame.builtin.Builtin;
import natlab.tame.tir.TIRCommaSeparatedList;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.tir.TIRCallStmt;
import natlab.tame.tir.TIRFunction;
import natlab.tame.valueanalysis.value.Args;

/**
 * Rename JavaScript function calls; the prefix "mc_" is added to all built-in
 * calls; A suffix describing the shape of the parameters is also added with
 * "S" representing a scalar parameter and "M" a matrix parameter.
 *
 * If the function call is an arithmetic operation on two scalars available in
 * JavaScript, we replace the function call node with a binary expression node.
 *
 * e.g. plus(3, 4) => 3 + 4
 *      times([1 2 3], 4) => mc_times_MS([1 2 3], 4)
 *
 * @author vfoley1
 * @author Erick Lavoie
 *
 */
public class FunctionRenamer {
        /*
     * Array of builtins that we should add a type suffix to. Mostly variadic
     * functions.
     */

    private static String[] SPECIALIZED = {
            "plus", "minus", "mtimes", "rem", "mod", "mrdivide",
            "lt", "le", "gt", "ge", "eq", "ne", "length",
            "sin", "cos", "tan", "uminus", "exp", "rdivide", "round", "sqrt",
            "mpower", "floor", "ceil", "power", "abs", "fix", "and", "times",
            "log","disp","round","transpose"
    };

    private static String[] SHAPE_INPUT = {
            "randn","zeros","eye","rand","ones"
    };

    private static String[] VECTOR_INPUT = {
            "vertcat","horzcat","colon","get","set"
    };
    private static String[] NONSPECIALIZED = {
            "any", "assert"
    };
    private static String[] SCALAR_OUTPUT = {
            "length","ndims","isscalar","isempty","isrow","iscolumn","isvector","ismatrix","numel","tic","toc","pi","e"
    };
    private static String[] ONE_MATRIX_AND_SHAPE = {
            "reshape","randi"
    };
    static {
        // The specialized functions are ordered so that we can run a binary
        // search over them.
        Arrays.sort(SPECIALIZED, (s, t) -> s.compareTo(t));
        Arrays.sort(SCALAR_OUTPUT, (s, t) -> s.compareTo(t));
        Arrays.sort(NONSPECIALIZED, (s, t) -> s.compareTo(t));
        Arrays.sort(VECTOR_INPUT, Comparator.naturalOrder());
        Arrays.sort(SHAPE_INPUT, Comparator.naturalOrder());
        Arrays.sort(ONE_MATRIX_AND_SHAPE, Comparator.naturalOrder());

    }
    public static boolean isScalarOutput(String funcName){
        return Arrays.binarySearch(SCALAR_OUTPUT, funcName,Comparator.naturalOrder()) >= 0;
    }
    public static boolean isVectorInput(String funcName){
        return Arrays.binarySearch(VECTOR_INPUT, funcName,Comparator.naturalOrder()) >= 0;
    }
    public static boolean isShapeInput(String funcName){
        return Arrays.binarySearch(SHAPE_INPUT, funcName,Comparator.naturalOrder()) >= 0;
    }
    public static boolean isMatlabBuiltin(String funcName ){
        return Builtin.getInstance(funcName) != null;
    }
    public static String toSuffix(Args<AggrValue<BasicMatrixValue>> args) {
        String suffix = "";

        for (Object arg : args) {
            BasicMatrixValue bmv = (BasicMatrixValue) arg;
            if (bmv.hasShape() && bmv.getShape().isScalar())
                suffix += "S";
            else
                suffix += "M";
        }

        return suffix;
    }

    public static String toSuffix(TIRCallStmt tirStmt, IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {
        String suffix = "";
        for (ast.Expr argExpr : tirStmt.getArguments()) {
           ast.NameExpr nameExpr = (ast.NameExpr) argExpr;
           BasicMatrixValue bmv = Utils.getBasicMatrixValue(analysis, tirStmt, nameExpr.getName().getID());
            if (bmv.hasShape() && bmv.getShape().isScalar())
                suffix += "S";
            else
                suffix += "M";
        }
        return suffix;
    }

    public static String getFunctionName(TIRCallStmt tirStmt,
      IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis, boolean useWasm) {
        String functionName = tirStmt.getFunctionName().getID();
        String suffix = toSuffix(tirStmt, analysis);

        if (Builtin.getInstance(functionName) == null) {
            return functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else if (Arrays.binarySearch(SPECIALIZED, functionName, (s, t) -> s.compareTo(t)) >= 0) {
            return ((useWasm)?"":"mc_") +functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else {
            return  ((useWasm)?"":"mc_") +functionName;
        }
    }
    public static Boolean isSpecializedFunction(String name){
        return Arrays.binarySearch(SPECIALIZED, name, Comparator.naturalOrder()) >=0;
    }

    public static String getFunctionName(TIRFunction function,
                                         IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis, boolean useWasm) {
        String functionName = function.getName().getID();
        String suffix = toSuffix(analysis.getArgs());

        // Add suffix or otherwise, redefine a builtin when a function name shadows one of them
        if (Builtin.getInstance(functionName) == null) {
            return functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else if (Arrays.binarySearch(SPECIALIZED, functionName, (s, t) -> s.compareTo(t)) >= 0) {
            return ((useWasm)?"":"mc_") +functionName + (suffix.equals("") ? "" : "_" + suffix);
        } else {
            throw new Error("Unsupported redefinition of builtin function " + functionName);
        }
    }

    public static boolean isOneMatrixAndShapeBuiltin(String name) {
        return Arrays.binarySearch(ONE_MATRIX_AND_SHAPE, name, Comparator.naturalOrder()) >=0;

    }
}
