let memory = WebAssembly.Memory({initial:10});
const { TextDecoder,TextEncoder } = require('util');
function printError(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    throw new Error(string);
}

function printString(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    console.log(string);
}
function printWhos(size, bytes, class_type)
{
    let name_class = '';
    switch(class_name)
    {
        case 0:
            name_class = "double";
    }
}
function printInt(number)
{
    console.log(number);
    return number;
}
function printDouble(number)
{
    console.log(number);
    return number;
}
const libjs = {
    "js":{
        "mem":memory,
        "printError":printError,
        "printWho":printWhos,
        "printString":printString,
        "printDouble":printInt,
        "printDoubleNumber":printDouble,
        "printMarker":()=>console.log("MARKER"),
        "assert_header":1,
        "print_array_f64":printArrayDouble
    },
    "math":{
        ones:() => 1,
        rand:() => Math.random(),
        randn:() => randn_s(),
        randi:(max) => Math.floor(max*Math.random()),
        zeros:()=> 0,
        isnan: isNaN,
        power:Math.pow,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        exp: Math.exp,
        log: Math.log,
        log2: Math.log2,
        log10: Math.log10,
        pi:Math.PI,
        e:Math.E
    },
    "test":{
        "assert":assert
    }
};

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}
function printArrayDouble(arr_ptr, length) {
    let arr = new Float64Array(memory.buffer, arr_ptr, length);
    console.log(arr);
}

/////////////// ASSERT ////////////////////

function assert(condition, error_number) {
    let errors = {
        "0":"Invalid Assertion: class number is incorrect in function $mxarray_core_get_mclass",
        "1":"Invalid Assertion: elem_size number is incorrect in function $mxarray_core_set_type_attribute",
        "2":"Invalid Assertion: simple_class number is incorrect in function $mxarray_core_set_type_attribute",
        "3":"Invalid Assertion: complex number is incorrect in function $mxarray_core_set_type_attribute",
        "4":"Invalid Assertion: operation only valid for array type"
    };
    if(!condition)
    {
        throw new Error(errors[error_number]);
    }
}
// console.log("Dynamic array growth currently not supported in set.".length);


function randn_s() {
    let rand = 0;

    for (let i = 0; i < 10; i += 1) {
        rand += Math.random();
    }

    return rand / 10;
}
const fs = require("fs");
const file = fs.readFileSync("./builtins.wasm");

async function runner(){
    let wi;
    try{
        wi = await WebAssembly.instantiate(file, libjs);
    }catch(err){
        throw err;
    }
    wi = wi.instance.exports;
    let memory = wi.mem;


// BEGINNING OF PROGRAM

function main_S(size){
    var A = 0;
    var mc_t3 = 0;
    var mc_t1 = 0;
    var y = 0;
    var i = 0;
    var mc_t20 = 0;
    var mc_t0 = 0;
    mc_t1 = 1;
    mc_t20 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t20, 1, mc_t1);
    wi.set_array_index_f64(mc_t20, 2, size);
    A = wi.rand(mc_t20);

    y = bubble_M(A);


    mc_t3 = 1;
    for (i = mc_t3; i<=size; i = i+1) {
        mc_t0 = wi.get_array_index_f64(y, i);
        wi.disp_S(mc_t0);
    }

    return;
}

function bubble_M(A){
    var mc_t9 = 0;
    var temp = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t4 = 0;
    var i = 0;
    var j = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var n = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var x = 0;
    x = A;
    x = wi.clone(x);
    n = wi.length_M(x);
    mc_t12 = 1;
    mc_t11 = n - mc_t12;
    mc_t19 = 1;
    for (j = mc_t19; j<=mc_t11; j = j+1) {

        mc_t13 = 1;
        mc_t10 = n - mc_t13;
        mc_t18 = 1;
        for (i = mc_t18; i<=mc_t10; i = i+1) {
            mc_t5 = wi.get_array_index_f64(x, i);
            mc_t14 = 1;
            mc_t8 = i + mc_t14;
            mc_t6 = wi.get_array_index_f64(x, mc_t8);
            mc_t17 = mc_t5 > mc_t6;
            if (mc_t17) {
                temp = wi.get_array_index_f64(x, i);
                mc_t15 = 1;
                mc_t9 = i + mc_t15;
                mc_t4 = wi.get_array_index_f64(x, mc_t9);
                wi.set_array_index_f64(x, i, mc_t4);
                mc_t16 = 1;
                mc_t7 = i + mc_t16;
                wi.set_array_index_f64(x, mc_t7, temp);
            }
        }
    }
    return x;
}
main_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
