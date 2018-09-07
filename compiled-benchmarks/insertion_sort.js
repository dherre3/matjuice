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

function insertion_sort_MS(A, n){
    var mc_t40 = 0;
    var mc_t30 = 0;
    var i = 0;
    var mc_t31 = 0;
    var j = 0;
    var mc_t32 = 0;
    var mc_t33 = 0;
    var mc_t34 = 0;
    var mc_t35 = 0;
    var mc_t36 = 0;
    var mc_t25 = 0;
    var mc_t37 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t38 = 0;
    var mc_t28 = 0;
    var mc_t39 = 0;
    var mc_t29 = 0;
    var t = 0;
    A = wi.clone(A);
    mc_t40 = 2;
    for (i = mc_t40; i<=n; i = i+1) {
        j = i;

        mc_t34 = 1;
        mc_t28 = j > mc_t34;
        if (mc_t28) {
            mc_t29 = wi.get_array_index_f64(A, j);
            mc_t35 = 1;
            mc_t31 = j - mc_t35;
            mc_t30 = wi.get_array_index_f64(A, mc_t31);
            mc_t28 = mc_t29 < mc_t30;
        } else {
            mc_t28 = false;
        }
        mc_t27 = mc_t28;
        while (mc_t27) {
            t = wi.get_array_index_f64(A, j);
            mc_t36 = 1;
            mc_t32 = j - mc_t36;
            mc_t25 = wi.get_array_index_f64(A, mc_t32);
            wi.set_array_index_f64(A, j, mc_t25);
            mc_t37 = 1;
            mc_t26 = j - mc_t37;
            wi.set_array_index_f64(A, mc_t26, t);
            mc_t38 = 1;
            j = j - mc_t38;
            mc_t39 = 1;
            mc_t33 = j > mc_t39;
            if (mc_t33) {
                mc_t29 = wi.get_array_index_f64(A, j);
                mc_t35 = 1;
                mc_t31 = j - mc_t35;
                mc_t30 = wi.get_array_index_f64(A, mc_t31);
                mc_t33 = mc_t29 < mc_t30;
            } else {
                mc_t33 = false;
            }
            mc_t27 = mc_t33;
        }
    }
    return A;
}

function main_S(size){
    var A = 0;
    var B = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t19 = 0;
    var ok = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var mc_t41 = 0;
    var i = 0;
    var mc_t20 = 0;
    var mc_t2 = 0;
    var mc_t42 = 0;
    var mc_t21 = 0;
    var mc_t43 = 0;
    var mc_t22 = 0;
    var mc_t0 = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var t = 0;
    mc_t4 = 1;
    mc_t41 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t41, 1, mc_t4);
    wi.set_array_index_f64(mc_t41, 2, size);
    A = wi.randn(mc_t41);
    mc_t6 = 0.55489370977495040000;
    mc_t7 = 0.49073352171125084000;
    mc_t8 = 0.40375233759650636000;
    mc_t9 = 0.51286861356494900000;
    mc_t10 = 0.49685939128889110000;
    mc_t11 = 0.71776140243551570000;
    mc_t12 = 0.49389463072297540000;
    mc_t13 = 0.48180762941994970000;
    mc_t14 = 0.48968235457991450000;
    mc_t15 = 0.60447122808418230000;
    mc_t42 = wi.create_mxvector(10, 5);
    mc_t43 = wi.convert_scalar_to_mxarray(mc_t6);
    wi.set_array_index_i32(mc_t42, 1, mc_t43);
    mc_t44 = wi.convert_scalar_to_mxarray(mc_t7);
    wi.set_array_index_i32(mc_t42, 2, mc_t44);
    mc_t45 = wi.convert_scalar_to_mxarray(mc_t8);
    wi.set_array_index_i32(mc_t42, 3, mc_t45);
    mc_t46 = wi.convert_scalar_to_mxarray(mc_t9);
    wi.set_array_index_i32(mc_t42, 4, mc_t46);
    mc_t47 = wi.convert_scalar_to_mxarray(mc_t10);
    wi.set_array_index_i32(mc_t42, 5, mc_t47);
    mc_t48 = wi.convert_scalar_to_mxarray(mc_t11);
    wi.set_array_index_i32(mc_t42, 6, mc_t48);
    mc_t49 = wi.convert_scalar_to_mxarray(mc_t12);
    wi.set_array_index_i32(mc_t42, 7, mc_t49);
    mc_t50 = wi.convert_scalar_to_mxarray(mc_t13);
    wi.set_array_index_i32(mc_t42, 8, mc_t50);
    mc_t51 = wi.convert_scalar_to_mxarray(mc_t14);
    wi.set_array_index_i32(mc_t42, 9, mc_t51);
    mc_t52 = wi.convert_scalar_to_mxarray(mc_t15);
    wi.set_array_index_i32(mc_t42, 10, mc_t52);
    A = wi.horzcat(mc_t42);
    wi.disp_M(A);
    wi.tic();
    B = insertion_sort_MS(A, size);
    t = wi.toc();
    wi.disp_M(B);
    ok = 1;
    mc_t19 = 1;
    mc_t3 = size - mc_t19;
    mc_t22 = 1;
    for (i = mc_t22; i<=mc_t3; i = i+1) {
        mc_t0 = wi.get_array_index_f64(B, i);
        mc_t20 = 1;
        mc_t2 = i + mc_t20;
        mc_t1 = wi.get_array_index_f64(B, mc_t2);
        mc_t21 = mc_t0 > mc_t1;
        if (mc_t21) {
            ok = 0;
            break;
        }
    }
    wi.disp_S(ok);
    wi.disp_S(t);
    return;
}
main_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
