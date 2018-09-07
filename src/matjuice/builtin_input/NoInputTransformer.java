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

import natlab.tame.tir.TIRCallStmt;
import natlab.tame.tir.TIRCommaSeparatedList;
import natlab.tame.tir.TIRNode;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

public class NoInputTransformer extends AbstractBuiltinInputTransformer {

    public NoInputTransformer(IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> analysis, TIRNode stmt, TIRCommaSeparatedList arguments) {
        super(analysis, stmt, arguments);
    }

    @Override
    public boolean isInForm() {
        if(arguments.size() > 0){
            throw new TooManyInputsExpection("", 0);
        }
        return true;
    }

    @Override
    protected TIRCommaSeparatedList convertInput() {
        return null;
    }
}
