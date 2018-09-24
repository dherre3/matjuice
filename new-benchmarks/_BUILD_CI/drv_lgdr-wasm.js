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

function PNxx_Legendre_vectN_MS(x, n){
    var mc_t134 = 0;
    var mc_t178 = 0;
    var mc_t133 = 0;
    var mc_t177 = 0;
    var mc_t132 = 0;
    var mc_t176 = 0;
    var mc_t131 = 0;
    var mc_t175 = 0;
    var mc_t130 = 0;
    var mc_t174 = 0;
    var mc_t173 = 0;
    var mc_t172 = 0;
    var mc_t171 = 0;
    var mc_t139 = 0;
    var mc_t138 = 0;
    var mc_t137 = 0;
    var mc_t136 = 0;
    var mc_t135 = 0;
    var mc_t179 = 0;
    var mc_t181 = 0;
    var mc_t180 = 0;
    var mc_t167 = 0;
    var mc_t123 = 0;
    var mc_t200 = 0;
    var mc_t122 = 0;
    var mc_t166 = 0;
    var mc_t121 = 0;
    var mc_t165 = 0;
    var mc_t164 = 0;
    var mc_t120 = 0;
    var mc_t163 = 0;
    var mc_t162 = 0;
    var mc_t161 = 0;
    var mc_t160 = 0;
    var mc_t129 = 0;
    var mc_t128 = 0;
    var mc_t127 = 0;
    var mc_t204 = 0;
    var mc_t126 = 0;
    var mc_t203 = 0;
    var mc_t169 = 0;
    var mc_t125 = 0;
    var mc_t202 = 0;
    var PNxxa = 0;
    var mc_t168 = 0;
    var mc_t124 = 0;
    var mc_t201 = 0;
    var mc_t170 = 0;
    var mc_t156 = 0;
    var mc_t112 = 0;
    var mc_t155 = 0;
    var mc_t199 = 0;
    var mc_t154 = 0;
    var mc_t198 = 0;
    var mc_t153 = 0;
    var mc_t197 = 0;
    var mc_t152 = 0;
    var mc_t196 = 0;
    var mc_t151 = 0;
    var mc_t195 = 0;
    var mc_t150 = 0;
    var mc_t194 = 0;
    var mc_t193 = 0;
    var mc_t119 = 0;
    var mc_t118 = 0;
    var mc_t117 = 0;
    var mc_t116 = 0;
    var mc_t159 = 0;
    var mc_t115 = 0;
    var mc_t158 = 0;
    var mc_t114 = 0;
    var mc_t157 = 0;
    var mc_t113 = 0;
    var mc_t145 = 0;
    var mc_t189 = 0;
    var mc_t144 = 0;
    var mc_t188 = 0;
    var mc_t143 = 0;
    var mc_t187 = 0;
    var mc_t142 = 0;
    var mc_t186 = 0;
    var mc_t141 = 0;
    var mc_t185 = 0;
    var mc_t140 = 0;
    var mc_t184 = 0;
    var mc_t183 = 0;
    var mc_t182 = 0;
    var j = 0;
    var mc_t149 = 0;
    var mc_t148 = 0;
    var mc_t147 = 0;
    var mc_t146 = 0;
    var mc_t192 = 0;
    var mc_t191 = 0;
    var mc_t190 = 0;













    mc_t116 = wi.length_M(x);
    mc_t142 = 1;
    mc_t117 = n + mc_t142;
    mc_t174 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t174, 1, mc_t116);
    wi.set_array_index_f64(mc_t174, 2, mc_t117);
    PNxxa = wi.zeros(mc_t174);
    mc_t143 = 0;
    mc_t144 = 1;
    mc_t175 = wi.create_mxvector(2, 5);
    mc_t176 = wi.colon_two(1, 5);
    wi.set_array_index_i32(mc_t175, 1, mc_t176);
    mc_t177 = wi.convert_scalar_to_mxarray(mc_t144);
    wi.set_array_index_i32(mc_t175, 2, mc_t177);
    mc_t178 = wi.create_mxvector(1);
    wi.set_array_index_f64(mc_t178, 1, mc_t143);
    wi.set_f64(PNxxa, mc_t175, mc_t178);
    mc_t148 = 0;
    mc_t147 = n > mc_t148;
    if (mc_t147) {
        mc_t145 = 0;
        mc_t146 = 2;
        mc_t179 = wi.create_mxvector(2, 5);
        mc_t180 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t179, 1, mc_t180);
        mc_t181 = wi.convert_scalar_to_mxarray(mc_t146);
        wi.set_array_index_i32(mc_t179, 2, mc_t181);
        mc_t182 = wi.create_mxvector(1);
        wi.set_array_index_f64(mc_t182, 1, mc_t145);
        wi.set_f64(PNxxa, mc_t179, mc_t182);
    }


    mc_t152 = 1;
    mc_t151 = n > mc_t152;
    if (mc_t151) {
        mc_t149 = 3;
        mc_t150 = 3;
        mc_t183 = wi.create_mxvector(2, 5);
        mc_t184 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t183, 1, mc_t184);
        mc_t185 = wi.convert_scalar_to_mxarray(mc_t150);
        wi.set_array_index_i32(mc_t183, 2, mc_t185);
        mc_t186 = wi.create_mxvector(1);
        wi.set_array_index_f64(mc_t186, 1, mc_t149);
        wi.set_f64(PNxxa, mc_t183, mc_t186);
    }


    mc_t156 = 2;
    mc_t155 = n > mc_t156;
    if (mc_t155) {
        mc_t118 = wi.transpose_M(x);
        mc_t153 = 15;
        mc_t112 = wi.mtimes_SM(mc_t153, mc_t118);
        mc_t154 = 4;
        mc_t187 = wi.create_mxvector(2, 5);
        mc_t188 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t187, 1, mc_t188);
        mc_t189 = wi.convert_scalar_to_mxarray(mc_t154);
        wi.set_array_index_i32(mc_t187, 2, mc_t189);
        wi.set_f64(PNxxa, mc_t187, mc_t112);
    }


    mc_t169 = 3;
    mc_t168 = n > mc_t169;
    if (mc_t168) {
        mc_t157 = 3;
        mc_t135 = n - mc_t157;
        mc_t167 = 1;
        for (j = mc_t167; j<=mc_t135; j = j+1) {
            mc_t158 = 1;
            mc_t134 = j + mc_t158;
            mc_t159 = 1;
            mc_t119 = mc_t159 / mc_t134;
            mc_t132 = j;
            mc_t160 = 5;
            mc_t161 = 2;
            mc_t133 = mc_t160 / mc_t161;
            mc_t131 = mc_t132 + mc_t133;
            mc_t162 = 2;
            mc_t129 = mc_t162 * mc_t131;
            mc_t130 = wi.transpose_M(x);
            mc_t126 = wi.mtimes_SM(mc_t129, mc_t130);
            mc_t163 = 3;
            mc_t128 = j + mc_t163;
            mc_t190 = wi.create_mxvector(2, 5);
            mc_t191 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t190, 1, mc_t191);
            mc_t192 = wi.convert_scalar_to_mxarray(mc_t128);
            wi.set_array_index_i32(mc_t190, 2, mc_t192);
            mc_t127 = wi.get_f64(PNxxa, mc_t190);
            mc_t121 = wi.times_MM(mc_t126, mc_t127);
            mc_t164 = 4;
            mc_t123 = j + mc_t164;
            mc_t165 = 2;
            mc_t125 = j + mc_t165;
            mc_t193 = wi.create_mxvector(2, 5);
            mc_t194 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t193, 1, mc_t194);
            mc_t195 = wi.convert_scalar_to_mxarray(mc_t125);
            wi.set_array_index_i32(mc_t193, 2, mc_t195);
            mc_t124 = wi.get_f64(PNxxa, mc_t193);
            mc_t122 = wi.mtimes_SM(mc_t123, mc_t124);
            mc_t120 = wi.minus_MM(mc_t121, mc_t122);
            mc_t113 = wi.mtimes_SM(mc_t119, mc_t120);
            mc_t166 = 4;
            mc_t115 = j + mc_t166;
            mc_t196 = wi.create_mxvector(2, 5);
            mc_t197 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t196, 1, mc_t197);
            mc_t198 = wi.convert_scalar_to_mxarray(mc_t115);
            wi.set_array_index_i32(mc_t196, 2, mc_t198);
            wi.set_f64(PNxxa, mc_t196, mc_t113);
        }

    }


    mc_t170 = 1;
    mc_t141 = n + mc_t170;
    mc_t173 = 1;
    for (j = mc_t173; j<=mc_t141; j = j+1) {
        mc_t199 = wi.create_mxvector(2, 5);
        mc_t200 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t199, 1, mc_t200);
        mc_t201 = wi.convert_scalar_to_mxarray(j);
        wi.set_array_index_i32(mc_t199, 2, mc_t201);
        mc_t136 = wi.get_f64(PNxxa, mc_t199);
        mc_t139 = j;
        mc_t171 = 1;
        mc_t172 = 2;
        mc_t140 = mc_t171 / mc_t172;
        mc_t138 = mc_t139 - mc_t140;
        mc_t137 = wi.sqrt_S(mc_t138);
        mc_t114 = wi.mtimes_MS(mc_t136, mc_t137);
        mc_t202 = wi.create_mxvector(2, 5);
        mc_t203 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t202, 1, mc_t203);
        mc_t204 = wi.convert_scalar_to_mxarray(j);
        wi.set_array_index_i32(mc_t202, 2, mc_t204);
        wi.set_f64(PNxxa, mc_t202, mc_t114);
    }


    return PNxxa;
}

function PN_Legendre_vectN_MS(x, n){
    var mc_t211 = 0;
    var mc_t210 = 0;
    var mc_t30 = 0;
    var mc_t219 = 0;
    var mc_t31 = 0;
    var mc_t218 = 0;
    var mc_t32 = 0;
    var mc_t217 = 0;
    var mc_t33 = 0;
    var mc_t216 = 0;
    var mc_t34 = 0;
    var mc_t215 = 0;
    var mc_t35 = 0;
    var mc_t214 = 0;
    var mc_t213 = 0;
    var mc_t37 = 0;
    var mc_t212 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var mc_t9 = 0;
    var PNa = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t208 = 0;
    var mc_t20 = 0;
    var mc_t207 = 0;
    var mc_t21 = 0;
    var mc_t206 = 0;
    var mc_t22 = 0;
    var mc_t205 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var mc_t209 = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
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
    var mc_t222 = 0;
    var mc_t221 = 0;
    var mc_t220 = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t42 = 0;
    var j = 0;
    var mc_t43 = 0;
    var mc_t44 = 0;
    var mc_t227 = 0;
    var mc_t45 = 0;
    var mc_t226 = 0;
    var mc_t46 = 0;
    var mc_t225 = 0;
    var mc_t47 = 0;
    var mc_t224 = 0;
    var mc_t48 = 0;
    var mc_t223 = 0;
    var mc_t49 = 0;













    mc_t11 = wi.length_M(x);
    mc_t33 = 1;
    mc_t12 = n + mc_t33;
    mc_t205 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t205, 1, mc_t11);
    wi.set_array_index_f64(mc_t205, 2, mc_t12);
    PNa = wi.zeros(mc_t205);
    mc_t34 = 1;
    mc_t35 = 1;
    mc_t206 = wi.create_mxvector(2, 5);
    mc_t207 = wi.colon_two(1, 5);
    wi.set_array_index_i32(mc_t206, 1, mc_t207);
    mc_t208 = wi.convert_scalar_to_mxarray(mc_t35);
    wi.set_array_index_i32(mc_t206, 2, mc_t208);
    mc_t209 = wi.create_mxvector(1);
    wi.set_array_index_f64(mc_t209, 1, mc_t34);
    wi.set_f64(PNa, mc_t206, mc_t209);
    wi.size(PNa);
    mc_t39 = 0;
    mc_t38 = n > mc_t39;
    if (mc_t38) {
        mc_t7 = wi.transpose_M(x);
        mc_t37 = 2;
        mc_t210 = wi.create_mxvector(2, 5);
        mc_t211 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t210, 1, mc_t211);
        mc_t212 = wi.convert_scalar_to_mxarray(mc_t37);
        wi.set_array_index_i32(mc_t210, 2, mc_t212);
        wi.set_f64(PNa, mc_t210, mc_t7);
    }


    mc_t49 = 1;
    mc_t48 = n > mc_t49;
    if (mc_t48) {
        mc_t40 = 1;
        mc_t26 = n - mc_t40;
        mc_t47 = 1;
        for (j = mc_t47; j<=mc_t26; j = j+1) {
            mc_t41 = 1;
            mc_t25 = j + mc_t41;
            mc_t42 = 1;
            mc_t13 = mc_t42 / mc_t25;
            mc_t43 = 2;
            mc_t24 = mc_t43 * j;
            mc_t44 = 1;
            mc_t22 = mc_t24 + mc_t44;
            mc_t23 = wi.transpose_M(x);
            mc_t19 = wi.mtimes_SM(mc_t22, mc_t23);
            mc_t45 = 1;
            mc_t21 = j + mc_t45;
            mc_t213 = wi.create_mxvector(2, 5);
            mc_t214 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t213, 1, mc_t214);
            mc_t215 = wi.convert_scalar_to_mxarray(mc_t21);
            wi.set_array_index_i32(mc_t213, 2, mc_t215);
            mc_t20 = wi.get_f64(PNa, mc_t213);
            mc_t15 = wi.times_MM(mc_t19, mc_t20);
            mc_t17 = j;
            mc_t216 = wi.create_mxvector(2, 5);
            mc_t217 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t216, 1, mc_t217);
            mc_t218 = wi.convert_scalar_to_mxarray(j);
            wi.set_array_index_i32(mc_t216, 2, mc_t218);
            mc_t18 = wi.get_f64(PNa, mc_t216);
            mc_t16 = wi.mtimes_SM(mc_t17, mc_t18);
            mc_t14 = wi.minus_MM(mc_t15, mc_t16);
            mc_t8 = wi.mtimes_SM(mc_t13, mc_t14);
            mc_t46 = 2;
            mc_t10 = j + mc_t46;
            mc_t219 = wi.create_mxvector(2, 5);
            mc_t220 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t219, 1, mc_t220);
            mc_t221 = wi.convert_scalar_to_mxarray(mc_t10);
            wi.set_array_index_i32(mc_t219, 2, mc_t221);
            wi.set_f64(PNa, mc_t219, mc_t8);
        }

    }


    mc_t50 = 1;
    mc_t32 = n + mc_t50;
    mc_t53 = 1;
    for (j = mc_t53; j<=mc_t32; j = j+1) {
        mc_t222 = wi.create_mxvector(2, 5);
        mc_t223 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t222, 1, mc_t223);
        mc_t224 = wi.convert_scalar_to_mxarray(j);
        wi.set_array_index_i32(mc_t222, 2, mc_t224);
        mc_t27 = wi.get_f64(PNa, mc_t222);
        mc_t30 = j;
        mc_t51 = 1;
        mc_t52 = 2;
        mc_t31 = mc_t51 / mc_t52;
        mc_t29 = mc_t30 - mc_t31;
        mc_t28 = wi.sqrt_S(mc_t29);
        mc_t9 = wi.mtimes_MS(mc_t27, mc_t28);
        mc_t225 = wi.create_mxvector(2, 5);
        mc_t226 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t225, 1, mc_t226);
        mc_t227 = wi.convert_scalar_to_mxarray(j);
        wi.set_array_index_i32(mc_t225, 2, mc_t227);
        wi.set_f64(PNa, mc_t225, mc_t9);
    }

    return PNa;
}

function drv_lgdr_S(scale){
    var mc_t233 = 0;
    var mc_t232 = 0;
    var PNa = 0;
    var PNxa = 0;
    var mc_t231 = 0;
    var mc_t230 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var i = 0;
    var mc_t229 = 0;
    var mc_t228 = 0;
    var n = 0;
    var PNxxa = 0;
    var x = 0;



    mc_t1 = 0;
    mc_t2 = 0.30000000000000000000;
    mc_t3 = 0.90000000000000000000;
    mc_t4 = 0.70000000000000000000;
    mc_t5 = 0.50000000000000000000;
    mc_t228 = wi.create_mxvector(5, 5);
    mc_t229 = wi.convert_scalar_to_mxarray(mc_t1);
    wi.set_array_index_i32(mc_t228, 1, mc_t229);
    mc_t230 = wi.convert_scalar_to_mxarray(mc_t2);
    wi.set_array_index_i32(mc_t228, 2, mc_t230);
    mc_t231 = wi.convert_scalar_to_mxarray(mc_t3);
    wi.set_array_index_i32(mc_t228, 3, mc_t231);
    mc_t232 = wi.convert_scalar_to_mxarray(mc_t4);
    wi.set_array_index_i32(mc_t228, 4, mc_t232);
    mc_t233 = wi.convert_scalar_to_mxarray(mc_t5);
    wi.set_array_index_i32(mc_t228, 5, mc_t233);
    x = wi.horzcat(mc_t228);
    n = 5;
    mc_t6 = 1;
    for (i = mc_t6; i<=scale; i = i+1) {
        PNa = PN_Legendre_vectN_MS(x, n);
        PNxa = PNx_Legendre_vectN_MS(x, n);
        PNxxa = PNxx_Legendre_vectN_MS(x, n);
    }

    return;
}

function PNx_Legendre_vectN_MS(x, n){
    var mc_t255 = 0;
    var mc_t254 = 0;
    var mc_t253 = 0;
    var mc_t252 = 0;
    var mc_t70 = 0;
    var mc_t251 = 0;
    var mc_t71 = 0;
    var mc_t250 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var mc_t74 = 0;
    var mc_t75 = 0;
    var mc_t76 = 0;
    var mc_t77 = 0;
    var mc_t78 = 0;
    var mc_t259 = 0;
    var mc_t79 = 0;
    var mc_t258 = 0;
    var mc_t257 = 0;
    var mc_t256 = 0;
    var mc_t244 = 0;
    var mc_t243 = 0;
    var mc_t242 = 0;
    var mc_t241 = 0;
    var mc_t240 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t64 = 0;
    var mc_t65 = 0;
    var mc_t66 = 0;
    var mc_t249 = 0;
    var mc_t67 = 0;
    var mc_t248 = 0;
    var mc_t68 = 0;
    var mc_t247 = 0;
    var mc_t69 = 0;
    var mc_t246 = 0;
    var mc_t245 = 0;
    var mc_t111 = 0;
    var PNxa = 0;
    var mc_t90 = 0;
    var mc_t110 = 0;
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t94 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t54 = 0;
    var mc_t98 = 0;
    var mc_t239 = 0;
    var mc_t99 = 0;
    var mc_t55 = 0;
    var mc_t238 = 0;
    var mc_t56 = 0;
    var mc_t237 = 0;
    var mc_t57 = 0;
    var mc_t236 = 0;
    var mc_t58 = 0;
    var mc_t235 = 0;
    var mc_t59 = 0;
    var mc_t234 = 0;
    var mc_t101 = 0;
    var mc_t100 = 0;
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t260 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t109 = 0;
    var mc_t86 = 0;
    var mc_t108 = 0;
    var mc_t87 = 0;
    var mc_t107 = 0;
    var j = 0;
    var mc_t88 = 0;
    var mc_t106 = 0;
    var mc_t89 = 0;
    var mc_t105 = 0;
    var mc_t104 = 0;
    var mc_t103 = 0;
    var mc_t102 = 0;













    mc_t58 = wi.length_M(x);
    mc_t84 = 1;
    mc_t59 = n + mc_t84;
    mc_t234 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t234, 1, mc_t58);
    wi.set_array_index_f64(mc_t234, 2, mc_t59);
    PNxa = wi.zeros(mc_t234);
    mc_t85 = 0;
    mc_t86 = 1;
    mc_t235 = wi.create_mxvector(2, 5);
    mc_t236 = wi.colon_two(1, 5);
    wi.set_array_index_i32(mc_t235, 1, mc_t236);
    mc_t237 = wi.convert_scalar_to_mxarray(mc_t86);
    wi.set_array_index_i32(mc_t235, 2, mc_t237);
    mc_t238 = wi.create_mxvector(1);
    wi.set_array_index_f64(mc_t238, 1, mc_t85);
    wi.set_f64(PNxa, mc_t235, mc_t238);
    mc_t90 = 0;
    mc_t89 = n > mc_t90;
    if (mc_t89) {
        mc_t87 = 1;
        mc_t88 = 2;
        mc_t239 = wi.create_mxvector(2, 5);
        mc_t240 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t239, 1, mc_t240);
        mc_t241 = wi.convert_scalar_to_mxarray(mc_t88);
        wi.set_array_index_i32(mc_t239, 2, mc_t241);
        mc_t242 = wi.create_mxvector(1);
        wi.set_array_index_f64(mc_t242, 1, mc_t87);
        wi.set_f64(PNxa, mc_t239, mc_t242);
    }


    mc_t94 = 1;
    mc_t93 = n > mc_t94;
    if (mc_t93) {
        mc_t60 = wi.transpose_M(x);
        mc_t91 = 3;
        mc_t54 = wi.mtimes_SM(mc_t91, mc_t60);
        mc_t92 = 3;
        mc_t243 = wi.create_mxvector(2, 5);
        mc_t244 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t243, 1, mc_t244);
        mc_t245 = wi.convert_scalar_to_mxarray(mc_t92);
        wi.set_array_index_i32(mc_t243, 2, mc_t245);
        wi.set_f64(PNxa, mc_t243, mc_t54);
    }


    mc_t107 = 2;
    mc_t106 = n > mc_t107;
    if (mc_t106) {
        mc_t95 = 2;
        mc_t77 = n - mc_t95;
        mc_t105 = 1;
        for (j = mc_t105; j<=mc_t77; j = j+1) {
            mc_t96 = 1;
            mc_t76 = j + mc_t96;
            mc_t97 = 1;
            mc_t61 = mc_t97 / mc_t76;
            mc_t74 = j;
            mc_t98 = 3;
            mc_t99 = 2;
            mc_t75 = mc_t98 / mc_t99;
            mc_t73 = mc_t74 + mc_t75;
            mc_t100 = 2;
            mc_t71 = mc_t100 * mc_t73;
            mc_t72 = wi.transpose_M(x);
            mc_t68 = wi.mtimes_SM(mc_t71, mc_t72);
            mc_t101 = 2;
            mc_t70 = j + mc_t101;
            mc_t246 = wi.create_mxvector(2, 5);
            mc_t247 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t246, 1, mc_t247);
            mc_t248 = wi.convert_scalar_to_mxarray(mc_t70);
            wi.set_array_index_i32(mc_t246, 2, mc_t248);
            mc_t69 = wi.get_f64(PNxa, mc_t246);
            mc_t63 = wi.times_MM(mc_t68, mc_t69);
            mc_t102 = 2;
            mc_t65 = j + mc_t102;
            mc_t103 = 1;
            mc_t67 = j + mc_t103;
            mc_t249 = wi.create_mxvector(2, 5);
            mc_t250 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t249, 1, mc_t250);
            mc_t251 = wi.convert_scalar_to_mxarray(mc_t67);
            wi.set_array_index_i32(mc_t249, 2, mc_t251);
            mc_t66 = wi.get_f64(PNxa, mc_t249);
            mc_t64 = wi.mtimes_SM(mc_t65, mc_t66);
            mc_t62 = wi.minus_MM(mc_t63, mc_t64);
            mc_t55 = wi.mtimes_SM(mc_t61, mc_t62);
            mc_t104 = 3;
            mc_t57 = j + mc_t104;
            mc_t252 = wi.create_mxvector(2, 5);
            mc_t253 = wi.colon_two(1, 5);
            wi.set_array_index_i32(mc_t252, 1, mc_t253);
            mc_t254 = wi.convert_scalar_to_mxarray(mc_t57);
            wi.set_array_index_i32(mc_t252, 2, mc_t254);
            wi.set_f64(PNxa, mc_t252, mc_t55);
        }

    }


    mc_t108 = 1;
    mc_t83 = n + mc_t108;
    mc_t111 = 1;
    for (j = mc_t111; j<=mc_t83; j = j+1) {
        mc_t255 = wi.create_mxvector(2, 5);
        mc_t256 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t255, 1, mc_t256);
        mc_t257 = wi.convert_scalar_to_mxarray(j);
        wi.set_array_index_i32(mc_t255, 2, mc_t257);
        mc_t78 = wi.get_f64(PNxa, mc_t255);
        mc_t81 = j;
        mc_t109 = 1;
        mc_t110 = 2;
        mc_t82 = mc_t109 / mc_t110;
        mc_t80 = mc_t81 - mc_t82;
        mc_t79 = wi.sqrt_S(mc_t80);
        mc_t56 = wi.mtimes_MS(mc_t78, mc_t79);
        mc_t258 = wi.create_mxvector(2, 5);
        mc_t259 = wi.colon_two(1, 5);
        wi.set_array_index_i32(mc_t258, 1, mc_t259);
        mc_t260 = wi.convert_scalar_to_mxarray(j);
        wi.set_array_index_i32(mc_t258, 2, mc_t260);
        wi.set_f64(PNxa, mc_t258, mc_t56);
    }


    return PNxa;
}
drv_lgdr_S(1);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
