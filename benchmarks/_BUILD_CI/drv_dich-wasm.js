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

function drv_dich_S(scale){
    var a = 0;
    var b = 0;
    var mc_t4 = 0;
    var h = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var mc_t0 = 0;
    var f1 = 0;
    var f2 = 0;
    var f3 = 0;
    var f4 = 0;
    var tol = 0;
    var t = 0;
    var U = 0;
    var time = 0;
    var max1 = 0;




    a = 4;
    b = 4;
    h = 0.030000000000000000000;
    mc_t1 = 5;
    mc_t0 = -mc_t1;
    mc_t2 = 10;
    tol = wi.mpower_SS(mc_t2, mc_t0);
    max1 = 1000;

    f1 = 20;
    f2 = 180;
    f3 = 80;
    f4 = 0;
    wi.tic();
    mc_t4 = 1;
    for (time = mc_t4; time<=scale; time = time+1) {
        U = dirich_SSSSSSSSS(f1, f2, f3, f4, a, b, h, tol, max1);
    }
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function dirich_SSSSSSSSS(f1, f2, f3, f4, a, b, h, tol, max1){
    var mc_t133 = 0;
    var mc_t132 = 0;
    var mc_t131 = 0;
    var mc_t130 = 0;
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
    var mc_t123 = 0;
    var mc_t122 = 0;
    var mc_t121 = 0;
    var mc_t120 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var mc_t129 = 0;
    var mc_t22 = 0;
    var mc_t128 = 0;
    var mc_t23 = 0;
    var mc_t127 = 0;
    var mc_t24 = 0;
    var mc_t126 = 0;
    var mc_t25 = 0;
    var mc_t125 = 0;
    var mc_t26 = 0;
    var mc_t124 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var mc_t112 = 0;
    var mc_t111 = 0;
    var mc_t110 = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t119 = 0;
    var mc_t54 = 0;
    var mc_t118 = 0;
    var mc_t55 = 0;
    var mc_t117 = 0;
    var mc_t116 = 0;
    var mc_t56 = 0;
    var mc_t115 = 0;
    var mc_t57 = 0;
    var mc_t114 = 0;
    var mc_t58 = 0;
    var mc_t113 = 0;
    var mc_t59 = 0;
    var U = 0;
    var mc_t101 = 0;
    var mc_t100 = 0;
    var err = 0;
    var mc_t40 = 0;
    var mc_t109 = 0;
    var mc_t41 = 0;
    var cnt = 0;
    var mc_t42 = 0;
    var mc_t108 = 0;
    var mc_t107 = 0;
    var mc_t43 = 0;
    var k = 0;
    var mc_t106 = 0;
    var mc_t44 = 0;
    var l = 0;
    var mc_t105 = 0;
    var mc_t45 = 0;
    var m = 0;
    var mc_t104 = 0;
    var mc_t46 = 0;
    var n = 0;
    var mc_t103 = 0;
    var mc_t47 = 0;
    var mc_t102 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var w = 0;
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
    var mc_t6 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t64 = 0;
    var mc_t65 = 0;
    var mc_t66 = 0;
    var mc_t67 = 0;
    var mc_t68 = 0;
    var mc_t69 = 0;
    var mc_t90 = 0;
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t94 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t98 = 0;
    var relx = 0;
    var mc_t10 = 0;
    var mc_t99 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var ave = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t86 = 0;
    var mc_t87 = 0;
    var mc_t88 = 0;
    var mc_t89 = 0;







































































    mc_t17 = a / h;
    mc_t16 = wi.fix_S(mc_t17);
    mc_t87 = 1;
    n = mc_t16 + mc_t87;
    mc_t19 = b / h;
    mc_t18 = wi.fix_S(mc_t19);
    mc_t88 = 1;
    m = mc_t18 + mc_t88;
    mc_t28 = a;
    mc_t29 = f1 + f2;
    mc_t24 = mc_t28 * mc_t29;
    mc_t26 = b;
    mc_t27 = f3 + f4;
    mc_t25 = mc_t26 * mc_t27;
    mc_t20 = mc_t24 + mc_t25;
    mc_t89 = 2;
    mc_t22 = mc_t89 * a;
    mc_t90 = 2;
    mc_t23 = mc_t90 * b;
    mc_t21 = mc_t22 + mc_t23;
    ave = mc_t20 / mc_t21;
    mc_t30 = ave;
    mc_t133 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t133, 1, n);
    wi.set_array_index_f64(mc_t133, 2, m);
    mc_t31 = wi.ones(mc_t133);
    U = wi.mtimes_SM(mc_t30, mc_t31);
    mc_t92 = 1;
    for (l = mc_t92; l<=m; l = l+1) {
        mc_t91 = 1;
        wi.set_array_index_f64(U, (((mc_t91-1)+(134*(l-1)))+1), f3);
        wi.set_array_index_f64(U, (((n-1)+(134*(l-1)))+1), f4);
    }

    mc_t94 = 1;
    for (k = mc_t94; k<=n; k = k+1) {
        mc_t93 = 1;
        wi.set_array_index_f64(U, (((k-1)+(134*(mc_t93-1)))+1), f1);
        wi.set_array_index_f64(U, (((k-1)+(134*(m-1)))+1), f2);
    }

    mc_t95 = 1;
    mc_t96 = 2;
    mc_t33 = wi.get_array_index_f64(U, (((mc_t95-1)+(134*(mc_t96-1)))+1));
    mc_t97 = 2;
    mc_t98 = 1;
    mc_t34 = wi.get_array_index_f64(U, (((mc_t97-1)+(134*(mc_t98-1)))+1));
    mc_t32 = mc_t33 + mc_t34;
    mc_t99 = 2;
    mc_t6 = mc_t32 / mc_t99;
    mc_t100 = 1;
    mc_t101 = 1;
    wi.set_array_index_f64(U, (((mc_t100-1)+(134*(mc_t101-1)))+1), mc_t6);
    mc_t102 = 1;
    mc_t38 = m - mc_t102;
    mc_t103 = 1;
    mc_t36 = wi.get_array_index_f64(U, (((mc_t103-1)+(134*(mc_t38-1)))+1));
    mc_t104 = 2;
    mc_t37 = wi.get_array_index_f64(U, (((mc_t104-1)+(134*(m-1)))+1));
    mc_t35 = mc_t36 + mc_t37;
    mc_t105 = 2;
    mc_t7 = mc_t35 / mc_t105;
    mc_t106 = 1;
    wi.set_array_index_f64(U, (((mc_t106-1)+(134*(m-1)))+1), mc_t7);
    mc_t107 = 1;
    mc_t42 = n - mc_t107;
    mc_t108 = 1;
    mc_t40 = wi.get_array_index_f64(U, (((mc_t42-1)+(134*(mc_t108-1)))+1));
    mc_t109 = 2;
    mc_t41 = wi.get_array_index_f64(U, (((n-1)+(134*(mc_t109-1)))+1));
    mc_t39 = mc_t40 + mc_t41;
    mc_t110 = 2;
    mc_t8 = mc_t39 / mc_t110;
    mc_t111 = 1;
    wi.set_array_index_f64(U, (((n-1)+(134*(mc_t111-1)))+1), mc_t8);
    mc_t112 = 1;
    mc_t48 = n - mc_t112;
    mc_t49 = m;
    mc_t44 = wi.get_array_index_f64(U, (((mc_t48-1)+(134*(mc_t49-1)))+1));
    mc_t46 = n;
    mc_t113 = 1;
    mc_t47 = m - mc_t113;
    mc_t45 = wi.get_array_index_f64(U, (((mc_t46-1)+(134*(mc_t47-1)))+1));
    mc_t43 = mc_t44 + mc_t45;
    mc_t114 = 2;
    mc_t9 = mc_t43 / mc_t114;
    wi.set_array_index_f64(U, (((n-1)+(134*(m-1)))+1), mc_t9);

    mc_t61 = wi.pi();
    mc_t115 = 1;
    mc_t62 = n - mc_t115;
    mc_t60 = mc_t61 / mc_t62;
    mc_t55 = wi.cos_S(mc_t60);
    mc_t58 = wi.pi();
    mc_t116 = 1;
    mc_t59 = m - mc_t116;
    mc_t57 = mc_t58 / mc_t59;
    mc_t56 = wi.cos_S(mc_t57);
    mc_t54 = mc_t55 + mc_t56;
    mc_t117 = 2;
    mc_t53 = wi.mpower_SS(mc_t54, mc_t117);
    mc_t118 = 4;
    mc_t52 = mc_t118 - mc_t53;
    mc_t51 = wi.sqrt_S(mc_t52);
    mc_t119 = 2;
    mc_t50 = mc_t119 + mc_t51;
    mc_t120 = 4;
    w = mc_t120 / mc_t50;
    err = 1;
    cnt = 0;

    mc_t12 = err > tol;
    if (mc_t12) {
        mc_t13 = cnt <= max1;
        mc_t11 = wi.and_SS(mc_t12, mc_t13);
    } else {
        mc_t11 = mc_t12;
    }
    while (mc_t11) {
        err = 0;
        mc_t121 = 1;
        mc_t86 = m - mc_t121;
        mc_t131 = 2;
        for (l = mc_t131; l<=mc_t86; l = l+1) {
            mc_t122 = 1;
            mc_t85 = n - mc_t122;
            mc_t130 = 2;
            for (k = mc_t130; k<=mc_t85; k = k+1) {
                mc_t64 = w;
                mc_t81 = k;
                mc_t123 = 1;
                mc_t82 = l + mc_t123;
                mc_t77 = wi.get_array_index_f64(U, (((mc_t81-1)+(134*(mc_t82-1)))+1));
                mc_t79 = k;
                mc_t124 = 1;
                mc_t80 = l - mc_t124;
                mc_t78 = wi.get_array_index_f64(U, (((mc_t79-1)+(134*(mc_t80-1)))+1));
                mc_t73 = mc_t77 + mc_t78;
                mc_t125 = 1;
                mc_t75 = k + mc_t125;
                mc_t76 = l;
                mc_t74 = wi.get_array_index_f64(U, (((mc_t75-1)+(134*(mc_t76-1)))+1));
                mc_t69 = mc_t73 + mc_t74;
                mc_t126 = 1;
                mc_t71 = k - mc_t126;
                mc_t72 = l;
                mc_t70 = wi.get_array_index_f64(U, (((mc_t71-1)+(134*(mc_t72-1)))+1));
                mc_t66 = mc_t69 + mc_t70;
                mc_t68 = wi.get_array_index_f64(U, (((k-1)+(134*(l-1)))+1));
                mc_t127 = 4;
                mc_t67 = mc_t127 * mc_t68;
                mc_t65 = mc_t66 - mc_t67;
                mc_t63 = mc_t64 * mc_t65;
                mc_t128 = 4;
                relx = mc_t63 / mc_t128;

                mc_t83 = wi.get_array_index_f64(U, (((k-1)+(134*(l-1)))+1));
                mc_t84 = relx;
                mc_t10 = mc_t83 + mc_t84;
                wi.set_array_index_f64(U, (((k-1)+(134*(l-1)))+1), mc_t10);
                mc_t15 = wi.abs_S(relx);
                mc_t129 = err <= mc_t15;
                if (mc_t129) {
                    err = wi.abs_S(relx);
                }
            }
        }
        mc_t132 = 1;
        cnt = cnt + mc_t132;
        mc_t12 = err > tol;
        if (mc_t12) {
            mc_t13 = cnt <= max1;
            mc_t11 = wi.and_SS(mc_t12, mc_t13);
        } else {
            mc_t11 = mc_t12;
        }
    }

    return U;
}
drv_dich_S(1);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
