let memory = WebAssembly.Memory({initial:32767});
const { TextDecoder,TextEncoder } = require('util');
function printError(offset, length) {
    var bytes = new Uint8Array(libjs.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    throw new Error(string);
}

function printString(offset, length) {
    var bytes = new Uint8Array(libjs.js.mem.buffer, offset, length);
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
        "printTime":printTime,
        "printError":printError,
        "printWho":printWhos,
        "printString":printString,
        "printDouble":printInt,
        "printDoubleNumber":printDouble,
        "printMarker":()=>console.log("MARKER"),
        "assert_header":1,
        "print_array_f64":printArrayDouble,
        "time":()=>Date.now()
    },
    "math":{
        ones:() => 1,
        rand:() => Math.random(),
        randn:() => randn_s(),
        randi:(max) => Math.ceil(max*Math.random()),
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
        pi:()=>Math.PI,
        e:()=>Math.E
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


function printTime(time){
    console.log(`Elapsed time is ${time/1000} seconds.`);
    return time;
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

function drv_collatz_S(scale){
    var t = 0;
    var length = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var i = 0;
    var max_num = 0;
    var max_length = 0;
    max_length = 0;
    max_num = 0;
    wi.tic();
    mc_t2 = 1;
    for (i = mc_t2; i<=scale; i = i+1) {
        length = collatz_S(i);
        mc_t1 = length > max_length;
        if (mc_t1) {
            max_length = length;
            max_num = i;
        }
    }
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function collatz_S(n){
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t6 = 0;
    var mc_t4 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var y = 0;
    y = 0;
    mc_t15 = 1;
    mc_t14 = n > mc_t15;
    while (mc_t14) {
        mc_t7 = 2;
        mc_t4 = wi.mod_SS(n, mc_t7);
        mc_t12 = 0;
        mc_t11 = mc_t4 === mc_t12;
        if (mc_t11) {
            mc_t8 = 2;
            n = n / mc_t8;
        } else {
            mc_t9 = 3;
            mc_t6 = mc_t9 * n;
            mc_t10 = 1;
            n = mc_t6 + mc_t10;
        }
        mc_t13 = 1;
        y = y + mc_t13;
        mc_t15 = 1;
        mc_t14 = n > mc_t15;
    }
    return y;
}
drv_collatz_S(100000);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
