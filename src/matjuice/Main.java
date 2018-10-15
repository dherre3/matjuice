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

package matjuice;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.util.*;
import java.util.function.BiConsumer;

import matjuice.pretty.Pretty;
import matjuice.codegen.Generator;
import matjuice.codegen.FunctionRenamer;
import matjuice.jsast.Program;

import natlab.tame.BasicTamerTool;
import natlab.tame.callgraph.FunctionCollection;
import natlab.tame.callgraph.SimpleFunctionCollection;
import natlab.tame.callgraph.StaticFunction;
import natlab.tame.tir.*;
import natlab.tame.valueanalysis.IntraproceduralValueAnalysis;
import natlab.tame.valueanalysis.ValueAnalysis;
import natlab.tame.valueanalysis.aggrvalue.AggrValue;
import natlab.tame.valueanalysis.basicmatrix.BasicMatrixValue;

import natlab.toolkits.Context;
import natlab.toolkits.filehandling.GenericFile;
import natlab.toolkits.path.FileEnvironment;


import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import natlab.toolkits.path.FunctionReference;


public class Main {
    private static void usage() {
        System.err.println("Usage: java -cp MatJuice.jar natlab.backends.javascript.Main <matlab file> <output file> <shapes>");
        System.exit(1);
    }

    private static String slurp(BufferedReader in) {
        StringBuffer sb = new StringBuffer();
        while (true) {
            String line;
            try {
                line = in.readLine();
            } catch (IOException e) {
                return "";
            }
            if (line == null)
                return sb.toString();
            sb.append(line + "\n");
        }
    }

    public static void main(String[] args) {
        boolean verbose = true;
        CommandLineOptions opts = new CommandLineOptions();
        JCommander jcommander = new JCommander(opts, args);
        jcommander.setProgramName("matjuice");

        if (opts.help) {
            jcommander.usage();
            System.exit(0);
        }

        if (opts.arguments.size() < 3) {
            usage();
        }

        String matlabFile = opts.arguments.get(0);
        String javascriptFile = opts.arguments.get(1);

        // The last arguments are the shape information of the parameters of the entry function.
        int numberOfShapes = opts.arguments.size() - 2;
        String[] shapeDesc = new String[numberOfShapes]; // E.g. "DOUBLE&1*1&REAL"
        for (int i = 2; i < opts.arguments.size(); ++i) {
            shapeDesc[i-2] = opts.arguments.get(i);
        }
        System.out.println(shapeDesc[0]);
        // Compilation time
        long startTime = 0;     // start time of the whole compilation
        long endTime = 0;       // end time of the whole compilation
        double totalPtCiTime = 0.0; // total time of PT/CI time

        startTime = System.currentTimeMillis();

        GenericFile gfile = GenericFile.create(matlabFile);
        if (!gfile.exists()) {
            System.err.printf("Error: file '%s' does not exist.%n", gfile.getName());
            System.exit(1);
        }

        FileEnvironment fenv = new FileEnvironment(gfile);
        ValueAnalysis<AggrValue<BasicMatrixValue>> analysis = BasicTamerTool.analyze(shapeDesc, fenv);
        Set generated = new HashSet<String>();
        Program program = new Program();
        String entryPointName = analysis.getMainNode().getFunction().getName();
        String suffixEntry= "";
        String entryPointShape = null;

//        SimpleFunctionCollection callgraph = new SimpleFunctionCollection(fenv);
        int numFunctions = analysis.getNodeList().size();
        for (int i = 0; i < numFunctions; ++i) {

            IntraproceduralValueAnalysis<AggrValue<BasicMatrixValue>> funcAnalysis = analysis.getNodeList().get(i).getAnalysis();
            if(funcAnalysis.getTree().getName().getID().equals(entryPointName)){
                suffixEntry = FunctionRenamer.toSuffix(funcAnalysis.getArgs());
                entryPointName+="_"+suffixEntry;
            }
            // Fixed point iterator inputs

//            if(opts.useWasm){
//                boolean transformed = true;
//                while(transformed){
//                    TIRFunction function = funcAnalysis.getTree();
//                    System.out.println(function.getPrettyPrinted());
//                    transformed = BuiltinInputTransformer.apply(function, funcAnalysis);
//                    List<StaticFunction> funcList = analysis.getFunctionCollection().getAllFunctions();
//                    for (StaticFunction temp : funcList) {
//                        if (temp.getName().equals(function.getName().getID())) {
//                            temp.setAst(function);
//                            break;
//                        }
//                    }
//                    analysis = BasicTamerTool.analyze(callgraph, shapeDesc);
//                    funcAnalysis = analysis.getNodeList().get(i).getAnalysis();
//                }

//            }

            String functionName = funcAnalysis.getTree().getName().getID();

            String suffix = FunctionRenamer.toSuffix(funcAnalysis.getArgs());
            if (!suffix.equals("")) {
                functionName += "_" + suffix;
            }

            if (!generated.contains(functionName)) {
                TIRFunction matlabFunction = funcAnalysis.getTree();
                Generator gen = new Generator(funcAnalysis, opts.doCopyInsertion, opts.useWasm);
                program.addFunction(gen.genFunction(matlabFunction));
                generated.add(functionName);
                System.out.println("Generated: " + functionName);
                totalPtCiTime += gen.getCopyInsertionTime();
            }

        }
        endTime = System.currentTimeMillis();

        // End of compilation
        if (opts.timeCompilation) {
            double total = (endTime - startTime) / 1000.0;
            System.out.printf("MATJUICE: PT/CI compile time: %.3f secs\n", totalPtCiTime);
            System.out.printf("MATJUICE: Total compile time: %.3f secs\n", total);
            System.out.printf("MATJUICE: Ratio PT/CI:Total : %.3f\n", totalPtCiTime / total);
        }


        // Write out the JavaScript program.
        // TODO: Better error messages.
        FileWriter out = null;
        FileWriter wasmOut = null;
        String[] jsDeps = {
            "mjapi.js",
            "lib.js"
        };
        String[] wasmDeps = {
                "ndarray.js",
                "lib_wasm.js",
                "wasm_loader.js"
        };
        String[] wasmFiles = {
            "builtins.wasm"
        };


        try {
            out = new FileWriter(javascriptFile);
            File file = new File(javascriptFile);

            String path = file.getParentFile().getAbsolutePath();
            if( opts.useWasm ){
                writeResources(out, wasmDeps);
            }else{
                writeResources(out, jsDeps);
            }
            out.write(String.format("%n%n// BEGINNING OF PROGRAM%n%n"));
            out.write(Pretty.display(program.pp()));
            out.write('\n');
            out.write(String.format("%s(1);", entryPointName));
            out.write('\n');
            if( opts.useWasm) {
                out.write("}\n" +
                        "runner().then((res)=>{}).catch((err)=>{\n" +
                        "    throw err;\n" +
                        "});\n");
                for (String wasmFile : wasmFiles) {
                    String wasmPath = combinePaths(path, wasmFile);
                    File wasmFileObj = getResourceAsFile("/"+ wasmFile);
                    try (
                        FileChannel sourceChannel = new FileInputStream(wasmFileObj).getChannel();
                         FileChannel destChannel = new FileOutputStream(wasmPath).getChannel()) {
                        destChannel.transferFrom(sourceChannel, 0, sourceChannel.size());
                    }catch (Exception e){
                        System.err.println(e.getMessage());

                    }
                }
            }
        }
        catch (Exception exc) {
            System.err.println("Error: cannot write to " + exc.getMessage());
        }
        finally {
            try {
                out.close();
            }
            catch (IOException e) {}
        }
    }
    private static String combinePaths(String path1, String path2)
    {
        File file1 = new File(path1);
        File file2 = new File(file1, path2);
        return file2.getPath();
    }
    private static void writeResources(FileWriter out, String[] wasmDeps) throws IOException {
        for (String wasmDep: wasmDeps) {
            InputStream stream = Main.class.getResourceAsStream("/" + wasmDep);
            if (stream != null) {
                BufferedReader in = new BufferedReader(new InputStreamReader(stream));
                out.write(slurp(in));
            }else{
                System.err.println("Error: cannot write to " + wasmDep);
            }
        }
    }
    private static File getResourceAsFile(String resourcePath) {
        try {
            InputStream in = Main.class.getResourceAsStream(resourcePath);
            if (in == null) {
                System.err.println("Error: cannot write to " + resourcePath);
                return null;
            }

            File tempFile = File.createTempFile(String.valueOf(in.hashCode()), ".tmp");
            tempFile.deleteOnExit();

            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                //copy stream
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }
            return tempFile;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}


@Parameters(separators = "=")
final class CommandLineOptions {
    @Parameter
    public java.util.List<String> arguments = new ArrayList<String>();

    @Parameter(names={ "-h", "--help" }, help=true, description="display this help message")
    public boolean help = false;
    @Parameter(names={ "--use-wasm" }, description="Use wasm built-ins instead of the JavaScript implemented built-ins")
    public boolean useWasm = false;
    @Parameter(names={ "--rename-operators" }, arity=1, description="replace scalar functions with JavaScript operators")
    public boolean renameOperators = true;

    @Parameter(names={ "--inline-indexing" }, arity=1, description="replace mj_get/mj_set with JavaScript indexing")
    public boolean inlineIndexing= true;

    @Parameter(names={ "--enable-bounds-checking" }, arity=1, description="generate bounds checking code")
    public boolean enableBoundsChecking = true;

    @Parameter(names={ "--copy-insertion" }, arity=1, description="do points-to analysis and copy insertion")
    public boolean doCopyInsertion = true;

    @Parameter(names={ "--time" }, arity=1, description="time compilation time")
    public boolean timeCompilation = false;
}
