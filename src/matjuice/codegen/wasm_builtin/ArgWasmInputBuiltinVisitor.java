package matjuice.codegen.wasm_builtin;

import natlab.tame.tir.TIRCallStmt;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

public class ArgWasmInputBuiltinVisitor {
    IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis;
    TIRCallStmt stmt;

    public void setStmt(TIRCallStmt stmt) {
        this.stmt = stmt;
    }

    public TIRCallStmt getStmt() {
        return stmt;
    }

    public void setAnalysis(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis) {

        this.analysis = analysis;
    }

    public IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> getAnalysis() {

        return analysis;
    }

    public ArgWasmInputBuiltinVisitor(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis, TIRCallStmt stmt) {
        this.analysis = analysis;
        this.stmt = stmt;
    }
}
