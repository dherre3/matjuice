package matjuice.builtin_input;

import ast.Expr;
import ast.List;
import matjuice.jsast.StmtSequence;
import natlab.tame.tir.TIRCommaSeparatedList;
import natlab.tame.tir.TIRNode;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

public class OneMatrixAndShapeBuiltinInputTransformer extends AbstractBuiltinInputTransformer<ResultInputTransformer> {
    public Expr matrix;
    public TIRCommaSeparatedList shapeArgs;
    public ShapeBuiltinInputTransformer shapeTransformer;
    public OneMatrixAndShapeBuiltinInputTransformer(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis, TIRNode stmt, TIRCommaSeparatedList arguments) {
        super(analysis, stmt, arguments);
        List<Expr> args = arguments.copy();
        this.matrix = args.getChild(0);
        args.removeChild(0);
        this.shapeArgs = new TIRCommaSeparatedList(args);
        shapeTransformer =  new ShapeBuiltinInputTransformer(valueAnalysis, stmt, shapeArgs);
    }

    @Override
    public boolean isInForm() {
        return shapeTransformer.isInForm();
    }

    @Override
    protected ResultInputTransformer convertInput() {
        return shapeTransformer.transform();
    }
}
