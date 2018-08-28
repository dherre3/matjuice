package matjuice.codegen;

import java.util.Arrays;
// Buu
public class FunctionRenamerWasm extends FunctionRenamer {
    private static String[] SPECIALIZED = {
            "plus", "minus", "mtimes", "rem", "mod", "mrdivide",
            "lt", "le", "gt", "ge", "eq", "ne", "length",
            "sin", "cos", "tan", "uminus", "exp", "rdivide", "round", "sqrt",
            "mpower", "floor", "ceil", "power", "abs", "fix", "and", "times",
            "log"
    };
    private static String[] NONSPECIALIZED = {
            "any", "assert"
    };
    static {
        // The specialized functions are ordered so that we can run a binary
        // search over them.
        Arrays.sort(SPECIALIZED, (s, t) -> s.compareTo(t));
        Arrays.sort(NONSPECIALIZED, (s, t) -> s.compareTo(t));
    }
}
