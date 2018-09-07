package matjuice.builtin_input;

import matjuice.jsast.Stmt;
import matjuice.jsast.StmtSequence;

import java.util.HashSet;

public class ResultInputTransformer {

    HashSet<String> locals = new HashSet<>();
    StmtSequence stmts = new StmtSequence();
    String target_name;
    public  ResultInputTransformer() {
    }
    public ResultInputTransformer(HashSet<String> locals, StmtSequence stmts) {
        this.locals = locals;
        this.stmts = stmts;
    }
    public HashSet<String> getLocals() {
        return locals;
    }
    public void setTargetName(String name){
        target_name = name;
    }
    public String getTargetName(){
        return target_name;
    }
    public StmtSequence getStmts() {
        return stmts;
    }

    public void addStmts(Stmt... stmt){
        for (Stmt aStmt : stmt) {
            stmts.addStmt(aStmt);
        }
    }

    public void addLocal(String local){
        locals.add(local);
    }
}
