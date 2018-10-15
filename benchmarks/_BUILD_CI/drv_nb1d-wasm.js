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

function drv_nb1d_S(scale){
    var seed = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var T = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var Vx = 0;
    var mc_t8 = 0;
    var Vy = 0;
    var mc_t5 = 0;
    var Vz = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var Rx = 0;
    var mc_t4 = 0;
    var Ry = 0;
    var mc_t1 = 0;
    var Rz = 0;
    var mc_t2 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var mc_t0 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t89 = 0;
    var mc_t24 = 0;
    var m = 0;
    var n = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var dT = 0;
    var mc_t27 = 0;
    var Fx = 0;
    var Fy = 0;
    var Fz = 0;
    var t = 0;





    seed = 1;
    scale = 4;
    mc_t10 = 0.40000000000000000000;
    mc_t1 = wi.mpower_SS(scale, mc_t10);
    mc_t11 = 30;
    mc_t0 = mc_t1 * mc_t11;
    n = wi.round_S(mc_t0);

    mc_t12 = 0.50000000000000000000;
    mc_t13 = 0.083300000000000000000;
    dT = mc_t12 * mc_t13;
    mc_t14 = 0.50000000000000000000;
    mc_t15 = 32.436200000000000000;
    mc_t2 = mc_t14 * mc_t15;
    mc_t3 = wi.sqrt_S(scale);
    T = mc_t2 * mc_t3;
    mc_t16 = 1;
    mc_t17 = 0.10000000000000000000;
    mc_t4 = rand1_SSS(n, mc_t16, mc_t17);
    mc_t18 = 1000.2300000000000000;
    Rx = wi.mtimes_MS(mc_t4, mc_t18);
    mc_t19 = 1;
    mc_t20 = 0.40000000000000000000;
    mc_t5 = rand1_SSS(n, mc_t19, mc_t20);
    mc_t21 = 1000.2300000000000000;
    Ry = wi.mtimes_MS(mc_t5, mc_t21);
    mc_t22 = 1;
    mc_t23 = 0.90000000000000000000;
    mc_t6 = rand1_SSS(n, mc_t22, mc_t23);
    mc_t24 = 1000.2300000000000000;
    Rz = wi.mtimes_MS(mc_t6, mc_t24);

    mc_t8 = n;
    mc_t25 = 0.40000000000000000000;
    mc_t9 = -mc_t25;
    mc_t26 = 1;
    mc_t7 = rand1_SSS(mc_t8, mc_t26, mc_t9);
    mc_t27 = 345;
    m = wi.mtimes_MS(mc_t7, mc_t27);
    wi.tic();
    mc_t89 = nbody1d_SMMMMSS(n, Rx, Ry, Rz, m, dT, T);
    Fx = wi.get_array_index_f64(mc_t89, 1);
    Fy = wi.get_array_index_f64(mc_t89, 2);
    Fz = wi.get_array_index_f64(mc_t89, 3);
    Vx = wi.get_array_index_f64(mc_t89, 4);
    Vy = wi.get_array_index_f64(mc_t89, 5);
    Vz = wi.get_array_index_f64(mc_t89, 6);
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function rand1_SSS(m, n, seed){
    var mc_t90 = 0;
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var i = 0;
    var mc_t75 = 0;
    var mc_t86 = 0;
    var mc_t76 = 0;
    var mc_t87 = 0;
    var j = 0;
    var mc_t77 = 0;
    var mc_t88 = 0;
    var mc_t78 = 0;
    var M = 0;
    var mc_t79 = 0;

    mc_t76 = seed;
    mc_t77 = m * n;
    seed = mc_t76 + mc_t77;
    mc_t90 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t90, 1, m);
    wi.set_array_index_f64(mc_t90, 2, n);
    M = wi.zeros(mc_t90);
    mc_t88 = 1;
    for (i = mc_t88; i<=m; i = i+1) {
        mc_t87 = 1;
        for (j = mc_t87; j<=n; j = j+1) {
            mc_t84 = 1;
            mc_t75 = wi.mod_SS(seed, mc_t84);
            wi.set_array_index_f64(M, (((i-1)+(wi.get_array_stride(M, 1)*(j-1)))+1), mc_t75);
            mc_t80 = seed;
            mc_t82 = wi.get_array_index_f64(M, (((i-1)+(wi.get_array_stride(M, 1)*(j-1)))+1));
            mc_t85 = 100;
            mc_t83 = wi.sqrt_S(mc_t85);
            mc_t81 = mc_t82 * mc_t83;
            mc_t78 = mc_t80 + mc_t81;
            mc_t86 = 2;
            mc_t79 = wi.sqrt_S(mc_t86);
            seed = mc_t78 + mc_t79;
        }
    }
    return M;
}

function nbody1d_SMMMMSS(n, Rx, Ry, Rz, m, dT, T){
    var mc_t70 = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var mc_t74 = 0;
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t32 = 0;
    var mc_t33 = 0;
    var mc_t34 = 0;
    var mc_t35 = 0;
    var mc_t36 = 0;
    var mc_t37 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t64 = 0;
    var mc_t65 = 0;
    var dry = 0;
    var mc_t66 = 0;
    var drx = 0;
    var mc_t67 = 0;
    var fry = 0;
    var mc_t68 = 0;
    var drz = 0;
    var frx = 0;
    var mc_t69 = 0;
    var frz = 0;
    var ax = 0;
    var ay = 0;
    var az = 0;
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t50 = 0;
    var mc_t94 = 0;
    var G = 0;
    var mc_t51 = 0;
    var mc_t95 = 0;
    var mc_t52 = 0;
    var mc_t96 = 0;
    var mc_t53 = 0;
    var mc_t54 = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var M = 0;
    var mc_t57 = 0;
    var mc_t58 = 0;
    var mc_t59 = 0;
    var Vx = 0;
    var Vy = 0;
    var Vz = 0;
    var f = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t42 = 0;
    var mc_t43 = 0;
    var k = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var Fx = 0;
    var r = 0;
    var Fy = 0;
    var Fz = 0;
    var t = 0;


























































    mc_t65 = 1;
    mc_t91 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t91, 1, n);
    wi.set_array_index_f64(mc_t91, 2, mc_t65);
    Fx = wi.zeros(mc_t91);
    mc_t66 = 1;
    mc_t92 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t92, 1, n);
    wi.set_array_index_f64(mc_t92, 2, mc_t66);
    Fy = wi.zeros(mc_t92);
    mc_t67 = 1;
    mc_t93 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t93, 1, n);
    wi.set_array_index_f64(mc_t93, 2, mc_t67);
    Fz = wi.zeros(mc_t93);

    mc_t68 = 1;
    mc_t94 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t94, 1, n);
    wi.set_array_index_f64(mc_t94, 2, mc_t68);
    Vx = wi.zeros(mc_t94);
    mc_t69 = 1;
    mc_t95 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t95, 1, n);
    wi.set_array_index_f64(mc_t95, 2, mc_t69);
    Vy = wi.zeros(mc_t95);
    mc_t70 = 1;
    mc_t96 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t96, 1, n);
    wi.set_array_index_f64(mc_t96, 2, mc_t70);
    Vz = wi.zeros(mc_t96);

    G = 1.0000000000000000000e-11;


    mc_t74 = 1;
    for (t = mc_t74; t<=T; t = t+dT) {
        mc_t73 = 1;
        for (k = mc_t73; k<=n; k = k+1) {



            mc_t33 = Rx;
            mc_t34 = wi.get_array_index_f64(Rx, k);
            drx = wi.minus_MS(mc_t33, mc_t34);
            mc_t35 = Ry;
            mc_t36 = wi.get_array_index_f64(Ry, k);
            dry = wi.minus_MS(mc_t35, mc_t36);
            mc_t37 = Rz;
            mc_t38 = wi.get_array_index_f64(Rz, k);
            drz = wi.minus_MS(mc_t37, mc_t38);



            mc_t41 = wi.times_MM(drx, drx);
            mc_t42 = wi.times_MM(dry, dry);
            mc_t39 = wi.plus_MM(mc_t41, mc_t42);
            mc_t40 = wi.times_MM(drz, drz);
            r = wi.plus_MM(mc_t39, mc_t40);
            mc_t71 = 1.0000000000000000000;
            wi.set_array_index_f64(r, k, mc_t71);




            mc_t43 = m;
            mc_t44 = wi.get_array_index_f64(m, k);
            M = wi.mtimes_MS(mc_t43, mc_t44);
            mc_t72 = 0.0000000000000000000;
            wi.set_array_index_f64(M, k, mc_t72);



            mc_t45 = G;
            mc_t46 = wi.rdivide_MM(M, r);
            f = wi.mtimes_SM(mc_t45, mc_t46);



            r = wi.sqrt_M(r);
            drx = wi.rdivide_MM(drx, r);
            dry = wi.rdivide_MM(dry, r);
            drz = wi.rdivide_MM(drz, r);



            frx = wi.times_MM(f, drx);
            fry = wi.times_MM(f, dry);
            frz = wi.times_MM(f, drz);

            mc_t47 = wi.mean(frx);
            mc_t47 = wi.get_array_index_f64(mc_t47, 1);
            mc_t48 = n;
            mc_t30 = mc_t47 * mc_t48;
            wi.set_array_index_f64(Fx, k, mc_t30);
            mc_t49 = wi.mean(fry);
            mc_t49 = wi.get_array_index_f64(mc_t49, 1);
            mc_t50 = n;
            mc_t31 = mc_t49 * mc_t50;
            wi.set_array_index_f64(Fy, k, mc_t31);
            mc_t51 = wi.mean(frz);
            mc_t51 = wi.get_array_index_f64(mc_t51, 1);
            mc_t52 = n;
            mc_t32 = mc_t51 * mc_t52;
            wi.set_array_index_f64(Fz, k, mc_t32);

        }



        ax = wi.rdivide_MM(Fx, m);
        ay = wi.rdivide_MM(Fy, m);
        az = wi.rdivide_MM(Fz, m);



        mc_t53 = Vx;
        mc_t54 = wi.mtimes_MS(ax, dT);
        Vx = wi.plus_MM(mc_t53, mc_t54);
        mc_t55 = Vy;
        mc_t56 = wi.mtimes_MS(ay, dT);
        Vy = wi.plus_MM(mc_t55, mc_t56);
        mc_t57 = Vz;
        mc_t58 = wi.mtimes_MS(az, dT);
        Vz = wi.plus_MM(mc_t57, mc_t58);



        mc_t59 = Rx;
        mc_t60 = wi.mtimes_MS(Vx, dT);
        Rx = wi.plus_MM(mc_t59, mc_t60);
        mc_t61 = Ry;
        mc_t62 = wi.mtimes_MS(Vy, dT);
        Ry = wi.plus_MM(mc_t61, mc_t62);
        mc_t63 = Rz;
        mc_t64 = wi.mtimes_MS(Vz, dT);
        Rz = wi.plus_MM(mc_t63, mc_t64);

    }


    return [Fx, Fy, Fz, Vx, Vy, Vz];
}
drv_nb1d_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
