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

function bubble_M(A){
    var mc_t9 = 0;
    var mc_t7 = 0;
    var temp = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t20 = 0;
    var i = 0;
    var j = 0;
    var mc_t10 = 0;
    var mc_t21 = 0;
    var mc_t11 = 0;
    var mc_t22 = 0;
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
    var Afloat = new Float64Array(memory.buffer, wi.mxarray_core_get_array_ptr(A), wi.numel(A));
    // A = wi.clone(A);
    n = wi.length_M(A);
    mc_t13 = 1;
    mc_t12 = n - mc_t13;
    mc_t20 = 1;
    for (j = mc_t20; j<=mc_t12; j = j+1) {

        mc_t14 = 1;
        mc_t11 = n - mc_t14;
        mc_t19 = 1;
        for (i = mc_t19; i<=mc_t11; i = i+1) {
            mc_t7 = Afloat[i-1];
            // mc_t7 = wi.get_array_index_f64(A, i);
            mc_t15 = 1;
            mc_t9 = i + mc_t15;
            // mc_t8 = wi.get_array_index_f64(A, mc_t9);
            mc_t8 = Afloat[mc_t9-1];
            mc_t18 = mc_t7 > mc_t8;
            if (mc_t18) {
                // temp = wi.get_array_index_f64(A, i);
                temp = Afloat[i-1]
                mc_t16 = 1;
                mc_t10 = i + mc_t16;
                // mc_t5 = wi.get_array_index_f64(A, mc_t10);
                mc_t5 = Afloat[ mc_t10 - 1 ];
                // mc_t21 = wi.create_mxvector(1);
                // wi.set_array_index_f64(mc_t21, 1, i);
                // wi.set_array_value_multiple_indeces_f64(A, mc_t21, mc_t5);
                Afloat[i-1] = mc_t5;
                mc_t17 = 1;
                mc_t6 = i + mc_t17;
                // mc_t22 = wi.create_mxvector(1);
                // wi.set_array_index_f64(mc_t22, 1, mc_t6);
                Afloat[mc_t6-1] = temp;
                // wi.set_array_value_multiple_indeces_f64(A, mc_t22, temp);
            }
        }
    }
    x = A;

    return x;
}

function drv_bubble_S(size){
    var A = 0;
    var t = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var y = 0;
    var mc_t0 = 0;
    var mc_t23 = 0;
    mc_t0 = 1;
    mc_t1 = 10000;
    mc_t23 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t23, 1, mc_t0);
    wi.set_array_index_f64(mc_t23, 2, mc_t1);
    A = wi.randn(mc_t23);
    wi.tic();
    for(var i = 0;i<10;i++){
        mc_t2 = 100000000;
        A = wi.mtimes_SM(mc_t2, A);

    }
    t = wi.toc();
    wi.disp_S(t);

    mc_t2 = 100000;
    A = wi.mtimes_SM(mc_t2, A);
    wi.tic();
    y = bubble_M(A);
    t = wi.toc();
    wi.disp_S(t);
    wi.disp_S(A);

    return y;
}
drv_bubble_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
