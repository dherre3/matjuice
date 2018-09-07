let memory = new WebAssembly.Memory({initial:32767});
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

function drv_clos_S(scale){
    var B = 0;
    var t = 0;
    var mc_t1 = 0;
    var time = 0;
    var N = 0;




    N = 450;
    wi.tic();
    mc_t1 = 1;
    B = closure_S(N);
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function closure_S(N){
    var jj = 0;
    var A = 0;
    var B = 0;
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t10 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var ii1 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var ii = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var mc_t25 = 0;
    var B1 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var t = 0;







































    wi.tic();
    mc_t28 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t28, 1, N);
    wi.set_array_index_f64(mc_t28, 2, N);
    A = wi.zeros(mc_t28);
    mc_t19 = 1;
    for (ii = mc_t19; ii<=N; ii = ii+1) {
        mc_t18 = 1;
        for (jj = mc_t18; jj<=N; jj = jj+1) {
            mc_t3 = ii * jj;
            mc_t12 = 2;
            mc_t4 = N / mc_t12;
            mc_t15 = mc_t3 < mc_t4;
            if (mc_t15) {
                mc_t5 = N - ii;
                mc_t6 = ii + jj;
                mc_t13 = 1;
                mc_t29 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t29, 1, mc_t5);
                wi.set_array_index_f64(mc_t29, 2, mc_t6);
                wi.set_array_value_multiple_indeces_f64(A, mc_t29, mc_t13);
                mc_t7 = ii;
                mc_t9 = N - ii;
                mc_t10 = jj;
                mc_t8 = mc_t9 - mc_t10;
                mc_t14 = 1;
                mc_t30 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t30, 1, mc_t7);
                wi.set_array_index_f64(mc_t30, 2, mc_t8);
                wi.set_array_value_multiple_indeces_f64(A, mc_t30, mc_t14);
            }
            mc_t17 = ii === jj;
            if (mc_t17) {
                mc_t16 = 1;
                mc_t31 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t31, 1, ii);
                wi.set_array_index_f64(mc_t31, 2, jj);
                wi.set_array_value_multiple_indeces_f64(A, mc_t31, mc_t16);
            }
        }
    }
    t = wi.toc();
    wi.disp_S(t);
    B = A;



    wi.tic();

    mc_t22 = 2;
    ii1 = N / mc_t22;
    mc_t25 = 1;
    mc_t24 = ii1 >= mc_t25;
    while (mc_t24) {
        B = wi.mtimes_MM(B, B);
        mc_t23 = 2;
        ii1 = ii1 / mc_t23;
        mc_t25 = 1;
        mc_t24 = ii1 >= mc_t25;
    }
    t = wi.toc();
    wi.disp_S(t);

    mc_t27 = 0;
    B1 = wi.gt_MS(B, mc_t27);

    return B1;
}
drv_clos_S(1);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
