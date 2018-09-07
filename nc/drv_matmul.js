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

function drv_matmul_p_S(scale){
    var A = 0;
    var B = 0;
    var mc_t10 = 0;
    var mc_t0 = 0;
    var k = 0;
    var mc_t11 = 0;
    var m = 0;
    var n = 0;





    m = scale;
    mc_t0 = 2;
    k = scale / mc_t0;
    n = scale;

    mc_t10 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t10, 1, m);
    wi.set_array_index_f64(mc_t10, 2, k);
    A = wi.rand(mc_t10);
    mc_t11 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t11, 1, k);
    wi.set_array_index_f64(mc_t11, 2, n);
    B = wi.rand(mc_t11);


    matmul_p_MMSSS(A, B, m, k, n);

    return;
}

function matmul_p_MMSSS(A, B, m, k, n){
    var mc_t9 = 0;
    var mc_t7 = 0;
    var c = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var h = 0;
    var i = 0;
    var mc_t2 = 0;
    var j = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;

    mc_t12 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t12, 1, m);
    wi.set_array_index_f64(mc_t12, 2, n);
    c = wi.zeros(mc_t12);
    wi.tic()
    mc_t9 = 1;
    for (j = mc_t9; j<=n; j = j+1) {
        mc_t8 = 1;
        for (h = mc_t8; h<=k; h = h+1) {
            mc_t7 = 1;
            for (i = mc_t7; i<=m; i = i+1) {
                mc_t13 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t13, 1, i);
                wi.set_array_index_f64(mc_t13, 2, j);
                mc_t3 = wi.get_array_value_multiple_indeces_f64(c, mc_t13);
                mc_t14 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t14, 1, i);
                wi.set_array_index_f64(mc_t14, 2, h);
                mc_t5 = wi.get_array_value_multiple_indeces_f64(A, mc_t14);
                mc_t15 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t15, 1, h);
                wi.set_array_index_f64(mc_t15, 2, j);
                mc_t6 = wi.get_array_value_multiple_indeces_f64(B, mc_t15);
                mc_t4 = mc_t5 * mc_t6;
                mc_t2 = mc_t3 + mc_t4;
                mc_t16 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t16, 1, i);
                wi.set_array_index_f64(mc_t16, 2, j);
                wi.set_array_value_multiple_indeces_f64(c, mc_t16, mc_t2);
            }
        }
    }
    console.log(wi.toc())
    return c;
}
drv_matmul_p_S(100);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
