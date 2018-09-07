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

function get_array_S(scale){
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t33 = 0;
    var mc_t34 = 0;
    var mc_t37 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t4 = 0;
    var mc_t62 = 0;
    var mc_t1 = 0;
    var mc_t63 = 0;
    var mc_t20 = 0;
    var mc_t2 = 0;
    var mc_t64 = 0;
    var mc_t21 = 0;
    var mc_t65 = 0;
    var mc_t0 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t29 = 0;
    var A = 0;
    var B = 0;
    var D = 0;
    var mc_t50 = 0;
    var G = 0;
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
    var mc_t14 = 0;
    var mc_t58 = 0;
    var mc_t15 = 0;
    var mc_t59 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var e = 0;
    var i = 0;
    var mc_t42 = 0;
    var mc_t43 = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var t = 0;
    scale = 1000000;
    wi.tic();

    mc_t5 = 2;
    mc_t6 = 1;
    mc_t42 = wi.create_mxvector(2, 5);
    mc_t43 = wi.convert_scalar_to_mxarray(mc_t5);
    wi.set_array_index_i32(mc_t42, 1, mc_t43);
    mc_t44 = wi.convert_scalar_to_mxarray(mc_t6);
    wi.set_array_index_i32(mc_t42, 2, mc_t44);
    mc_t4 = wi.horzcat(mc_t42);
    mc_t8 = 2;
    mc_t9 = 3;
    mc_t45 = wi.create_mxvector(2, 5);
    mc_t46 = wi.convert_scalar_to_mxarray(mc_t8);
    wi.set_array_index_i32(mc_t45, 1, mc_t46);
    mc_t47 = wi.convert_scalar_to_mxarray(mc_t9);
    wi.set_array_index_i32(mc_t45, 2, mc_t47);
    mc_t7 = wi.horzcat(mc_t45);
    mc_t48 = wi.create_mxvector(2, 5);
    wi.set_array_index_i32(mc_t48, 1, mc_t4);
    wi.set_array_index_i32(mc_t48, 2, mc_t7);
    G = wi.vertcat(mc_t48);

    mc_t10 = 3;
    mc_t11 = 6;
    mc_t12 = 2;
    mc_t49 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t49, 1, mc_t10);
    wi.set_array_index_f64(mc_t49, 2, mc_t11);
    wi.set_array_index_f64(mc_t49, 3, mc_t12);
    A = wi.ones(mc_t49);
    mc_t13 = 3;
    mc_t14 = 2;
    mc_t15 = 1;
    e = wi.get_array_index_f64(A, ((((mc_t13-1)+(3*(mc_t14-1)))+(18*(mc_t15-1)))+1));
    wi.disp_M(G);

    mc_t18 = 2;
    mc_t19 = 3;
    mc_t50 = wi.create_mxvector(2, 5);
    mc_t51 = wi.convert_scalar_to_mxarray(mc_t18);
    wi.set_array_index_i32(mc_t50, 1, mc_t51);
    mc_t52 = wi.convert_scalar_to_mxarray(mc_t19);
    wi.set_array_index_i32(mc_t50, 2, mc_t52);
    mc_t0 = wi.horzcat(mc_t50);
    mc_t20 = 2;
    mc_t21 = 8;
    mc_t53 = wi.create_mxvector(3, 5);
    mc_t54 = wi.convert_scalar_to_mxarray(mc_t20);
    wi.set_array_index_i32(mc_t53, 1, mc_t54);
    wi.set_array_index_i32(mc_t53, 2, mc_t0);
    mc_t55 = wi.convert_scalar_to_mxarray(mc_t21);
    wi.set_array_index_i32(mc_t53, 3, mc_t55);
    A = wi.colon(mc_t53);

    wi.disp_M(A);

    mc_t23 = 3;
    mc_t24 = 7;
    mc_t25 = 3;
    mc_t56 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t56, 1, mc_t23);
    wi.set_array_index_f64(mc_t56, 2, mc_t24);
    wi.set_array_index_f64(mc_t56, 3, mc_t25);
    B = wi.ones(mc_t56);
    mc_t26 = 1;
    mc_t27 = 2;
    mc_t57 = wi.create_mxvector(2, 5);
    mc_t58 = wi.convert_scalar_to_mxarray(mc_t26);
    wi.set_array_index_i32(mc_t57, 1, mc_t58);
    mc_t59 = wi.convert_scalar_to_mxarray(mc_t27);
    wi.set_array_index_i32(mc_t57, 2, mc_t59);
    mc_t1 = wi.colon(mc_t57);
    mc_t29 = 1;
    mc_t30 = 2;
    mc_t60 = wi.create_mxvector(2, 5);
    mc_t61 = wi.convert_scalar_to_mxarray(mc_t29);
    wi.set_array_index_i32(mc_t60, 1, mc_t61);
    mc_t62 = wi.convert_scalar_to_mxarray(mc_t30);
    wi.set_array_index_i32(mc_t60, 2, mc_t62);
    mc_t2 = wi.horzcat(mc_t60);
    mc_t31 = 2;
    mc_t63 = wi.create_mxvector(3, 5);
    wi.set_array_index_i32(mc_t63, 1, mc_t1);
    wi.set_array_index_i32(mc_t63, 2, mc_t2);
    mc_t64 = wi.convert_scalar_to_mxarray(mc_t31);
    wi.set_array_index_i32(mc_t63, 3, mc_t64);
    D = wi.get_f64(B, mc_t63);

    wi.disp_M(D);
    mc_t33 = 7;
    mc_t34 = 2;
    mc_t65 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t65, 1, scale);
    wi.set_array_index_f64(mc_t65, 2, mc_t33);
    wi.set_array_index_f64(mc_t65, 3, mc_t34);
    wi.tic();
    B = wi.randn(mc_t65);
    var t2 = wi.toc();
    wi.tic();
    A = wi.randn2(mc_t65);
    t = wi.toc();
    // wi.disp_M(A)
    console.log("ALLOCATION TOTAL TIME: ",t,t2, wi.numel(A));
    wi.tic();
    let Afloat = new Float64Array(memory.buffer, wi.mxarray_core_get_array_ptr(A),wi.numel(A));
    mc_t39 = 1;
    for (i = mc_t39; i<=scale; i = i+1) {
        mc_t37 = 7;
        mc_t38 = 2;
        Afloat[(((i-1)+(1000000*(mc_t37-1)))+(7000000*(mc_t38-1)))] = i;
    }
    // wi.disp_M(A);
    t = wi.toc();
    wi.disp_S(t);
    return;
}
get_array_S(1);
}
runner()
    .then((res)=>{})
    .catch((err)=>{
    throw err;
});
