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

function crnich_SSSSS(a, b, c, n, m){
    var mc_t134 = 0;
    var mc_t133 = 0;
    var mc_t132 = 0;
    var mc_t131 = 0;
    var mc_t130 = 0;
    var j1 = 0;
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t32 = 0;
    var mc_t33 = 0;
    var mc_t139 = 0;
    var mc_t34 = 0;
    var mc_t138 = 0;
    var mc_t35 = 0;
    var mc_t137 = 0;
    var mc_t36 = 0;
    var mc_t136 = 0;
    var mc_t37 = 0;
    var mc_t135 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var s1 = 0;
    var s2 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t54 = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var mc_t57 = 0;
    var mc_t58 = 0;
    var mc_t59 = 0;
    var U = 0;
    var X = 0;
    var mc_t40 = 0;
    var h = 0;
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
    var r = 0;
    var mc_t70 = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var mc_t74 = 0;
    var mc_t75 = 0;
    var mc_t76 = 0;
    var mc_t77 = 0;
    var mc_t78 = 0;
    var mc_t79 = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t60 = 0;
    var mc_t6 = 0;
    var mc_t61 = 0;
    var mc_t3 = 0;
    var mc_t62 = 0;
    var mc_t4 = 0;
    var mc_t63 = 0;
    var mc_t64 = 0;
    var mc_t65 = 0;
    var mc_t66 = 0;
    var mc_t67 = 0;
    var mc_t68 = 0;
    var mc_t69 = 0;
    var mc_t90 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var Va = 0;
    var mc_t12 = 0;
    var Vb = 0;
    var mc_t13 = 0;
    var Vc = 0;
    var mc_t14 = 0;
    var Vd = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var i1 = 0;
    var mc_t85 = 0;
    var mc_t86 = 0;
    var mc_t87 = 0;
    var mc_t88 = 0;
    var mc_t89 = 0;














































































    mc_t9 = a;
    mc_t52 = 1;
    mc_t10 = n - mc_t52;
    h = mc_t9 / mc_t10;
    mc_t11 = b;
    mc_t53 = 1;
    mc_t12 = m - mc_t53;
    k = mc_t11 / mc_t12;
    mc_t54 = 2;
    mc_t15 = wi.mpower_SS(c, mc_t54);
    mc_t16 = k;
    mc_t13 = mc_t15 * mc_t16;
    mc_t55 = 2;
    mc_t14 = wi.mpower_SS(h, mc_t55);
    r = mc_t13 / mc_t14;
    mc_t56 = 2;
    mc_t17 = mc_t56 / r;
    mc_t57 = 2;
    s1 = mc_t57 + mc_t17;
    mc_t58 = 2;
    mc_t18 = mc_t58 / r;
    mc_t59 = 2;
    s2 = mc_t18 - mc_t59;
    mc_t130 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t130, 1, n);
    wi.set_array_index_f64(mc_t130, 2, m);
    U = wi.zeros(mc_t130);
    mc_t60 = 1;
    mc_t32 = n - mc_t60;
    mc_t65 = 2;
    for (i1 = mc_t65; i1<=mc_t32; i1 = i1+1) {

        mc_t30 = wi.pi();
        mc_t31 = h;
        mc_t28 = mc_t30 * mc_t31;
        mc_t61 = 1;
        mc_t29 = i1 - mc_t61;
        mc_t27 = mc_t28 * mc_t29;
        mc_t19 = wi.sin_S(mc_t27);
        mc_t26 = wi.pi();
        mc_t62 = 3;
        mc_t24 = mc_t62 * mc_t26;
        mc_t25 = h;
        mc_t22 = mc_t24 * mc_t25;
        mc_t63 = 1;
        mc_t23 = i1 - mc_t63;
        mc_t21 = mc_t22 * mc_t23;
        mc_t20 = wi.sin_S(mc_t21);
        mc_t3 = mc_t19 + mc_t20;
        mc_t64 = 1;
        wi.set_array_index_f64(U, (((i1-1)+(2300*(mc_t64-1)))+1), mc_t3);
    }

    mc_t33 = s1;
    mc_t66 = 1;
    mc_t131 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t131, 1, mc_t66);
    wi.set_array_index_f64(mc_t131, 2, n);
    mc_t34 = wi.ones(mc_t131);
    Vd = wi.mtimes_SM(mc_t33, mc_t34);
    mc_t67 = 1;
    mc_t68 = 1;
    wi.set_array_index_f64(Vd, mc_t68, mc_t67);
    mc_t69 = 1;
    wi.set_array_index_f64(Vd, n, mc_t69);
    mc_t70 = 1;
    mc_t36 = n - mc_t70;
    mc_t71 = 1;
    mc_t132 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t132, 1, mc_t71);
    wi.set_array_index_f64(mc_t132, 2, mc_t36);
    mc_t35 = wi.ones(mc_t132);
    Va = wi.uminus_M(mc_t35);
    mc_t72 = 1;
    mc_t6 = n - mc_t72;
    mc_t73 = 0;
    wi.set_array_index_f64(Va, mc_t6, mc_t73);
    mc_t74 = 1;
    mc_t38 = n - mc_t74;
    mc_t75 = 1;
    mc_t133 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t133, 1, mc_t75);
    wi.set_array_index_f64(mc_t133, 2, mc_t38);
    mc_t37 = wi.ones(mc_t133);
    Vc = wi.uminus_M(mc_t37);
    mc_t76 = 0;
    mc_t77 = 1;
    wi.set_array_index_f64(Vc, mc_t77, mc_t76);
    mc_t78 = 1;
    mc_t134 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t134, 1, mc_t78);
    wi.set_array_index_f64(mc_t134, 2, n);
    Vb = wi.zeros(mc_t134);
    mc_t79 = 0;
    mc_t80 = 1;
    wi.set_array_index_f64(Vb, mc_t80, mc_t79);
    mc_t81 = 0;
    wi.set_array_index_f64(Vb, n, mc_t81);

    mc_t90 = 2;
    for (j1 = mc_t90; j1<=m; j1 = j1+1) {
        mc_t82 = 1;
        mc_t51 = n - mc_t82;
        mc_t88 = 2;
        for (i1 = mc_t88; i1<=mc_t51; i1 = i1+1) {
            mc_t83 = 1;
            mc_t49 = i1 - mc_t83;
            mc_t84 = 1;
            mc_t50 = j1 - mc_t84;
            mc_t45 = wi.get_array_index_f64(U, (((mc_t49-1)+(2300*(mc_t50-1)))+1));
            mc_t85 = 1;
            mc_t47 = i1 + mc_t85;
            mc_t86 = 1;
            mc_t48 = j1 - mc_t86;
            mc_t46 = wi.get_array_index_f64(U, (((mc_t47-1)+(2300*(mc_t48-1)))+1));
            mc_t39 = mc_t45 + mc_t46;
            mc_t41 = s2;
            mc_t43 = i1;
            mc_t87 = 1;
            mc_t44 = j1 - mc_t87;
            mc_t42 = wi.get_array_index_f64(U, (((mc_t43-1)+(2300*(mc_t44-1)))+1));
            mc_t40 = mc_t41 * mc_t42;
            mc_t4 = mc_t39 + mc_t40;
            wi.set_array_index_f64(Vb, i1, mc_t4);
        }
        X = tridiagonal_MMMMS(Va, Vd, Vc, Vb, n);
        mc_t5 = wi.transpose_M(X);
        mc_t89 = 1;
        mc_t135 = wi.create_mxvector(2, 5);
        mc_t136 = wi.convert_scalar_to_mxarray(mc_t89);
        wi.set_array_index_i32(mc_t135, 1, mc_t136);
        mc_t137 = wi.convert_scalar_to_mxarray(n);
        wi.set_array_index_i32(mc_t135, 2, mc_t137);
        mc_t7 = wi.colon(mc_t135);
        mc_t8 = j1;
        mc_t138 = wi.create_mxvector(2, 5);
        wi.set_array_index_i32(mc_t138, 1, mc_t7);
        mc_t139 = wi.convert_scalar_to_mxarray(mc_t8);
        wi.set_array_index_i32(mc_t138, 2, mc_t139);
        wi.set_f64(U, mc_t138, mc_t5);
    }

    return U;
}

function drv_crni_S(scale){
    var a = 0;
    var b = 0;
    var c = 0;
    var t = 0;
    var U = 0;
    var mc_t1 = 0;
    var time = 0;
    var m = 0;
    var n = 0;







    a = 2.5000000000000000000;

    b = 1.5000000000000000000;

    c = 5;

    m = 2300;

    n = 2300;

    wi.tic();
    mc_t1 = 1;
    for (time = mc_t1; time<=scale; time = time+1) {
        U = crnich_SSSSS(a, b, c, n, m);
    }
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function tridiagonal_MMMMS(A, D, C, B, n){
    var mc_t112 = 0;
    var mc_t111 = 0;
    var mc_t110 = 0;
    var mult = 0;
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t94 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t119 = 0;
    var mc_t98 = 0;
    var mc_t118 = 0;
    var mc_t99 = 0;
    var mc_t117 = 0;
    var mc_t116 = 0;
    var mc_t115 = 0;
    var mc_t114 = 0;
    var mc_t113 = 0;
    var X = 0;
    var mc_t101 = 0;
    var mc_t123 = 0;
    var mc_t122 = 0;
    var mc_t100 = 0;
    var mc_t121 = 0;
    var mc_t120 = 0;
    var mc_t140 = 0;
    var mc_t109 = 0;
    var mc_t108 = 0;
    var mc_t107 = 0;
    var mc_t129 = 0;
    var k = 0;
    var mc_t106 = 0;
    var mc_t128 = 0;
    var mc_t105 = 0;
    var mc_t127 = 0;
    var mc_t104 = 0;
    var mc_t126 = 0;
    var mc_t103 = 0;
    var mc_t125 = 0;
    var mc_t124 = 0;
    var mc_t102 = 0;
    D = wi.clone(D);
    B = wi.clone(B);



















































    mc_t124 = 2;
    for (k = mc_t124; k<=n; k = k+1) {
        mc_t120 = 1;
        mc_t98 = k - mc_t120;
        mc_t95 = wi.get_array_index_f64(A, mc_t98);
        mc_t121 = 1;
        mc_t97 = k - mc_t121;
        mc_t96 = wi.get_array_index_f64(D, mc_t97);
        mult = mc_t95 / mc_t96;
        mc_t99 = wi.get_array_index_f64(D, k);
        mc_t101 = mult;
        mc_t122 = 1;
        mc_t103 = k - mc_t122;
        mc_t102 = wi.get_array_index_f64(C, mc_t103);
        mc_t100 = mc_t101 * mc_t102;
        mc_t91 = mc_t99 - mc_t100;
        wi.set_array_index_f64(D, k, mc_t91);
        mc_t104 = wi.get_array_index_f64(B, k);
        mc_t106 = mult;
        mc_t123 = 1;
        mc_t108 = k - mc_t123;
        mc_t107 = wi.get_array_index_f64(B, mc_t108);
        mc_t105 = mc_t106 * mc_t107;
        mc_t92 = mc_t104 - mc_t105;
        wi.set_array_index_f64(B, k, mc_t92);
    }

    mc_t125 = 1;
    mc_t140 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t140, 1, mc_t125);
    wi.set_array_index_f64(mc_t140, 2, n);
    X = wi.zeros(mc_t140);
    mc_t109 = wi.get_array_index_f64(B, n);
    mc_t110 = wi.get_array_index_f64(D, n);
    mc_t93 = mc_t109 / mc_t110;
    wi.set_array_index_f64(X, n, mc_t93);

    mc_t126 = 1;
    mc_t118 = n - mc_t126;
    mc_t127 = 1;
    mc_t119 = -mc_t127;
    mc_t129 = 1;
    for (k = mc_t118; k>=mc_t129; k = k+mc_t119) {
        mc_t113 = wi.get_array_index_f64(B, k);
        mc_t115 = wi.get_array_index_f64(C, k);
        mc_t128 = 1;
        mc_t117 = k + mc_t128;
        mc_t116 = wi.get_array_index_f64(X, mc_t117);
        mc_t114 = mc_t115 * mc_t116;
        mc_t111 = mc_t113 - mc_t114;
        mc_t112 = wi.get_array_index_f64(D, k);
        mc_t94 = mc_t111 / mc_t112;
        wi.set_array_index_f64(X, k, mc_t94);
    }



    return X;
}
drv_crni_S(1);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
