package matjuice.codegen.wasm_builtin;

import matjuice.jsast.StmtSequence;
import natlab.tame.builtin.Builtin;
import natlab.tame.builtin.BuiltinVisitor;

public class BuiltinWasmGeneratorVisitor extends BuiltinVisitor<ArgWasmInputBuiltinVisitor, StmtSequence> {
    @Override
    public StmtSequence caseBuiltin(Builtin builtin, ArgWasmInputBuiltinVisitor argInputBuiltinVisitor) {

        return null;

    }

    @Override
    public StmtSequence caseAbstractConcatenation(Builtin builtin, ArgWasmInputBuiltinVisitor argInputBuiltinVisitor) {
        // private generator for array of array

        return super.caseAbstractConcatenation(builtin, argInputBuiltinVisitor);
    }
    private StmtSequence generateVectorInput(){

        return null;
    }
}
