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

function drv_mcpi_p_S(scale){
    var t = 0;
    var mc_t2 = 0;
    wi.tic();
    mc_t2 = 50000;
    mcpi_p_SS(scale, mc_t2);
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function mcpi_p_SS(N, P){
    var mc_t9 = 0;
    var temp = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t6 = 0;
    var mc_t4 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var myRes = 0;
    var temp2 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var result = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var x = 0;
    var y = 0;
    result = 0;

    mc_t16 = 1;
    for (temp = mc_t16; temp<=P; temp = temp+1) {
        myRes = 0;
        mc_t8 = N / P;
        mc_t15 = 1;
        for (temp2 = mc_t15; temp2<=mc_t8; temp2 = temp2+1) {
            mc_t10 = 1;
            mc_t18 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t18, 1, mc_t10);
            wi.set_array_index_f64(mc_t18, 2, mc_t10);
            x = wi.rand(mc_t18);
            x = wi.get_array_index_f64(x, 1);
            mc_t11 = 1;
            mc_t19 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t19, 1, mc_t11);
            wi.set_array_index_f64(mc_t19, 2, mc_t11);
            y = wi.rand(mc_t19);
            y = wi.get_array_index_f64(y, 1);
            mc_t6 = x * x;
            mc_t7 = y * y;
            mc_t4 = mc_t6 + mc_t7;
            mc_t14 = 1;
            mc_t13 = mc_t4 <= mc_t14;
            if (mc_t13) {
                mc_t12 = 1;
                myRes = myRes + mc_t12;
            }
        }
        result = result + myRes;
    }
    mc_t9 = result / N;
    mc_t17 = 4;
    result = mc_t9 * mc_t17;
    return result;
}
drv_mcpi_p_S(10000);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
