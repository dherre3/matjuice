"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// declare var this.wi:any;
class NdArray extends Float64Array {
    constructor(wi, mxarray) {
        super(memory.buffer, wi.mxarray_core_get_array_ptr(mxarray), wi.numel(mxarray));
        this.wi = wi;
    }
    get_indices(indices) {
        if (this.isArrPtr(indices)) {
            return new NdArray(this.wi, this.wi.get_f64(this.arr_ptr, indices));
        }
        else {
            let indices_arr_ptr = this.wi.create_mxvector(indices.length, 5); // Create mxvector this.with int type
            indices.forEach((dimArr, indDim) => {
                let index_arr_ptr = this.wi.create_mxvector(dimArr.length);
                dimArr.forEach((val, indVal) => {
                    this.wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
                });
                this.wi.set_array_index_i32(indices_arr_ptr, indDim + 1, index_arr_ptr);
                return new NdArray(this.wi, this.wi.get_f64(this.arr_ptr, indices_arr_ptr));
            });
        }
    }
    set_indices(indices, values) {
        let indices_arr_ptr;
        let indices_val_arr_ptr;
        if (this.isArrPtr(indices)) {
            indices_arr_ptr = indices;
        }
        else {
            indices_arr_ptr = this.wi.create_mxvector(indices.length, 5); // Create mxvector this.with int type
            indices.forEach((dimArr, indDim) => {
                let index_arr_ptr = this.wi.create_mxvector(dimArr.length);
                this.wi.set_array_index_i32(indices_arr_ptr, indDim + 1, index_arr_ptr);
                dimArr.forEach((val, indVal) => {
                    this.wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
                });
            });
        }
        if (this.isArrPtr(values)) {
            indices_val_arr_ptr = values;
        }
        else {
            indices_val_arr_ptr = this.wi.create_mxvector(values.length);
            values.forEach((val, ind) => {
                this.wi.set_array_index_f64(indices_val_arr_ptr, ind + 1, val);
            });
        }
        this.wi.set_f64(this.arr_ptr, indices_arr_ptr, indices_val_arr_ptr);
    }
    numel() {
        return this.wi.numel(this.arr_ptr);
    }
    ndims() {
        return this.wi.ndims(this.arr_ptr);
    }
    length_M() {
        return this.wi.length_M(this.arr_ptr);
    }
    isrow() {
        return this.wi.isrow(this.arr_ptr);
    }
    iscolumn() {
        return this.wi.iscolumn(this.arr_ptr);
    }
    ismatrix() {
        return this.wi.ismatrix(this.arr_ptr);
    }
    isvector() {
        return this.wi.isvector(this.arr_ptr);
    }
    isempty() {
        return this.wi.isempty(this.arr_ptr);
    }
    isArrPtr(x) {
        return typeof x === "number";
    }
    isArrayVector(x) {
        return Array.isArray(x) && ((x.length > 0 && Array.isArray(x[0])) || true);
    }
    isArrayNumber(x) {
        return Array.isArray(x) && ((x.length > 0 && typeof x[0] === 'number') || true);
    }
}
exports.NdArray = NdArray;
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

function babai_MM(R, y){
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t10 = 0;
    var mc_t32 = 0;
    var mc_t11 = 0;
    var mc_t33 = 0;
    var mc_t12 = 0;
    var mc_t34 = 0;
    var mc_t13 = 0;
    var mc_t35 = 0;
    var mc_t14 = 0;
    var mc_t36 = 0;
    var mc_t15 = 0;
    var mc_t37 = 0;
    var mc_t16 = 0;
    var mc_t38 = 0;
    var mc_t17 = 0;
    var mc_t39 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var mc_t9 = 0;
    var par = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t6 = 0;
    var mc_t40 = 0;
    var ck = 0;
    var mc_t41 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var k = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var n = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var z_hat = 0;







    n = wi.length_M(y);
    mc_t26 = 1;
    mc_t32 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t32, 1, n);
    wi.set_array_index_f64(mc_t32, 2, mc_t26);
    z_hat = wi.zeros(mc_t32);
    mc_t9 = wi.get_array_index_f64(y, n);
    mc_t10 = wi.get_array_index_f64(R, (((n-1)+(1000*(n-1)))+1));
    mc_t8 = mc_t9 / mc_t10;
    mc_t6 = wi.round_S(mc_t8);
    wi.set_array_index_f64(z_hat, n, mc_t6);
    mc_t27 = 1;
    mc_t24 = n - mc_t27;
    mc_t28 = 1;
    mc_t25 = -mc_t28;
    mc_t31 = 1;
    for (k = mc_t24; k>=mc_t31; k = k+mc_t25) {
        mc_t16 = k;
        mc_t29 = 1;
        mc_t18 = k + mc_t29;
        mc_t19 = n;
        mc_t33 = wi.create_mxvector(2, 5);
        mc_t34 = wi.convert_scalar_to_mxarray(mc_t18);
        wi.set_array_index_i32(mc_t33, 1, mc_t34);
        mc_t35 = wi.convert_scalar_to_mxarray(mc_t19);
        wi.set_array_index_i32(mc_t33, 2, mc_t35);
        mc_t17 = wi.colon(mc_t33);
        mc_t36 = wi.create_mxvector(2, 5);
        mc_t37 = wi.convert_scalar_to_mxarray(mc_t16);
        wi.set_array_index_i32(mc_t36, 1, mc_t37);
        wi.set_array_index_i32(mc_t36, 2, mc_t17);
        mc_t11 = wi.get_f64(R, mc_t36);
        mc_t30 = 1;
        mc_t14 = k + mc_t30;
        mc_t15 = n;
        mc_t38 = wi.create_mxvector(2, 5);
        mc_t39 = wi.convert_scalar_to_mxarray(mc_t14);
        wi.set_array_index_i32(mc_t38, 1, mc_t39);
        mc_t40 = wi.convert_scalar_to_mxarray(mc_t15);
        wi.set_array_index_i32(mc_t38, 2, mc_t40);
        mc_t13 = wi.colon(mc_t38);
        mc_t41 = wi.create_mxvector(1, 5);
        wi.set_array_index_i32(mc_t41, 1, mc_t13);
        mc_t12 = wi.get_f64(z_hat, mc_t41);
        par = wi.mtimes_MM(mc_t11, mc_t12);
        par = wi.get_array_index_f64(par, 1);

        mc_t22 = wi.get_array_index_f64(y, k);
        mc_t23 = par;
        mc_t20 = mc_t22 - mc_t23;
        mc_t21 = wi.get_array_index_f64(R, (((k-1)+(1000*(k-1)))+1));
        ck = mc_t20 / mc_t21;
        mc_t7 = wi.round_S(ck);
        wi.set_array_index_f64(z_hat, k, mc_t7);
    }

    return z_hat;
}

function drv_babai_S(size){
    var R = 0;
    var t = 0;
    var vec = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var Y = 0;
    var i = 0;
    var mc_t42 = 0;
    var mc_t43 = 0;
    var mc_t0 = 0;
    mc_t0 = 1000;
    mc_t42 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t42, 1, mc_t0);
    wi.set_array_index_f64(mc_t42, 2, mc_t0);
    R = wi.randn(mc_t42);
    mc_t1 = 1000;
    mc_t2 = 1;
    mc_t43 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t43, 1, mc_t1);
    wi.set_array_index_f64(mc_t43, 2, mc_t2);
    Y = wi.randn(mc_t43);
    wi.tic();
    mc_t4 = 1;
    for (i = mc_t4; i<=size; i = i+1) {
        vec = babai_MM(R, Y);
    }
    t = wi.toc();
    wi.disp_S(t);

    return;
}
drv_babai_S(1);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
