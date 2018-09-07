let memory = WebAssembly.Memory({initial:10});
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

function main_S(size){
    var mc_t7 = 0;
    var mc_t8 = 0;
    var coins = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t40 = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var i = 0;
    var mc_t36 = 0;
    var mc_t37 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var t = 0;
    mc_t1 = 1;
    mc_t2 = 5;
    mc_t3 = 10;
    mc_t4 = 25;
    mc_t36 = wi.create_mxvector(4, 5);
    mc_t37 = wi.convert_scalar_to_mxarray(mc_t1);
    wi.set_array_index_i32(mc_t36, 1, mc_t37);
    mc_t38 = wi.convert_scalar_to_mxarray(mc_t2);
    wi.set_array_index_i32(mc_t36, 2, mc_t38);
    mc_t39 = wi.convert_scalar_to_mxarray(mc_t3);
    wi.set_array_index_i32(mc_t36, 3, mc_t39);
    mc_t40 = wi.convert_scalar_to_mxarray(mc_t4);
    wi.set_array_index_i32(mc_t36, 4, mc_t40);
    coins = wi.horzcat(mc_t36);
    wi.tic();
    mc_t8 = 0;
    for (i = mc_t8; i<=size; i = i+1) {
        mc_t7 = 4;
        make_change_MSS(coins, mc_t7, i);
    }
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function make_change_MSS(coins, n, amount){
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t32 = 0;
    var mc_t33 = 0;
    var mc_t34 = 0;
    var mc_t35 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t20 = 0;
    var mc_t64 = 0;
    var mc_t21 = 0;
    var mc_t65 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var A = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t10 = 0;
    var mc_t54 = 0;
    var mc_t11 = 0;
    var mc_t55 = 0;
    var mc_t12 = 0;
    var mc_t56 = 0;
    var mc_t13 = 0;
    var mc_t57 = 0;
    var N = 0;
    var mc_t14 = 0;
    var mc_t58 = 0;
    var mc_t15 = 0;
    var mc_t59 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var ways = 0;
    var T = 0;
    var mc_t41 = 0;
    var i = 0;
    var mc_t42 = 0;
    var j = 0;
    var mc_t43 = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var left_idx = 0;
    mc_t23 = 1;
    N = n + mc_t23;
    mc_t24 = 1;
    A = amount + mc_t24;
    mc_t41 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t41, 1, N);
    wi.set_array_index_f64(mc_t41, 2, A);
    T = wi.zeros(mc_t41);

    mc_t27 = 1;
    for (i = mc_t27; i<=N; i = i+1) {
        mc_t25 = 1;
        mc_t26 = 1;
        mc_t42 = wi.create_mxvector(1, 5);
        mc_t43 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t43, 1, i);
        wi.set_array_index_f64(mc_t43, 2, mc_t26);
        wi.set_array_index_i32(mc_t42, 1, mc_t43);
        mc_t44 = wi.create_mxvector(1);
        wi.set_array_index_f64(mc_t44, mc_t25);
        wi.set_f64(T, mc_t43, mc_t44);
    }

    mc_t35 = 2;
    for (i = mc_t35; i<=N; i = i+1) {
        mc_t34 = 2;
        for (j = mc_t34; j<=A; j = j+1) {
            mc_t45 = wi.create_mxvector(1, 5);
            mc_t46 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t46, 1, i);
            wi.set_array_index_f64(mc_t46, 2, j);
            wi.set_array_index_i32(mc_t45, 1, mc_t46);
            mc_t47 = wi.get_f64(T, mc_t45);
            mc_t12 = wi.get_array_index_f64(mc_t47, 1);
            mc_t28 = 1;
            mc_t14 = i - mc_t28;
            mc_t15 = j;
            mc_t48 = wi.create_mxvector(1, 5);
            mc_t49 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t49, 1, mc_t14);
            wi.set_array_index_f64(mc_t49, 2, mc_t15);
            wi.set_array_index_i32(mc_t48, 1, mc_t49);
            mc_t50 = wi.get_f64(T, mc_t48);
            mc_t13 = wi.get_array_index_f64(mc_t50, 1);
            mc_t10 = mc_t12 + mc_t13;
            mc_t51 = wi.create_mxvector(1, 5);
            mc_t52 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t52, 1, i);
            wi.set_array_index_f64(mc_t52, 2, j);
            mc_t52 = wi.set_array_index_i32(mc_t51, 1, mc_t52);
            mc_t53 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t53, mc_t10);
            wi.set_f64(T, mc_t52, mc_t53);
            mc_t29 = 1;
            mc_t16 = j - mc_t29;
            mc_t30 = 1;
            mc_t18 = i - mc_t30;
            mc_t17 = wi.get_array_index_f64(coins, mc_t18);
            left_idx = mc_t16 - mc_t17;
            mc_t33 = 0;
            mc_t32 = left_idx >= mc_t33;
            if (mc_t32) {
                mc_t54 = wi.create_mxvector(1, 5);
                mc_t55 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t55, 1, i);
                wi.set_array_index_f64(mc_t55, 2, j);
                wi.set_array_index_i32(mc_t54, 1, mc_t55);
                mc_t56 = wi.get_f64(T, mc_t54);
                mc_t19 = wi.get_array_index_f64(mc_t56, 1);
                mc_t21 = i;
                mc_t31 = 1;
                mc_t22 = left_idx + mc_t31;
                mc_t57 = wi.create_mxvector(1, 5);
                mc_t58 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t58, 1, mc_t21);
                wi.set_array_index_f64(mc_t58, 2, mc_t22);
                wi.set_array_index_i32(mc_t57, 1, mc_t58);
                mc_t59 = wi.get_f64(T, mc_t57);
                mc_t20 = wi.get_array_index_f64(mc_t59, 1);
                mc_t11 = mc_t19 + mc_t20;
                mc_t60 = wi.create_mxvector(1, 5);
                mc_t61 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t61, 1, i);
                wi.set_array_index_f64(mc_t61, 2, j);
                mc_t61 = wi.set_array_index_i32(mc_t60, 1, mc_t61);
                mc_t62 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t62, mc_t11);
                wi.set_f64(T, mc_t61, mc_t62);
            }
        }
    }
    mc_t63 = wi.create_mxvector(1, 5);
    mc_t64 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t64, 1, N);
    wi.set_array_index_f64(mc_t64, 2, A);
    wi.set_array_index_i32(mc_t63, 1, mc_t64);
    mc_t65 = wi.get_f64(T, mc_t63);
    ways = wi.get_array_index_f64(mc_t65, 1);
    return ways;
}
main_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
