const fs = require("fs");
const libjs = require("./lib_wasm.js");
const file = fs.readFileSync(__dirname+"/builtins.wasm");

(async ()=>{
    let wi;
    try{
        wi = await WebAssembly.instantiate(file, libjs);
    }catch(err){
        throw err;
    }
    wi = wi.instance.exports;
    let memory = wi.mem;