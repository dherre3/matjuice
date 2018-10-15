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

function fdtd_SSSSSSSS(Lx, Ly, Lz, Nx, Ny, Nz, nrm, Nt){
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
    var eps0 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var c0 = 0;
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
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t42 = 0;
    var mc_t43 = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var n = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var Cx = 0;
    var Cy = 0;
    var Cz = 0;
    var Dt = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var Ex = 0;
    var mc_t19 = 0;
    var Ey = 0;
    var Ez = 0;
    var mc_t417 = 0;
    var mc_t416 = 0;
    var mc_t415 = 0;
    var mc_t414 = 0;
    var mc_t413 = 0;
    var mc_t412 = 0;
    var mc_t411 = 0;
    var mc_t410 = 0;
    var mc_t419 = 0;
    var mc_t418 = 0;
    var mc_t406 = 0;
    var mc_t405 = 0;
    var mc_t404 = 0;
    var mc_t403 = 0;
    var mc_t402 = 0;
    var mc_t401 = 0;
    var mc_t400 = 0;
    var Hx = 0;
    var Hy = 0;
    var Hz = 0;
    var mc_t409 = 0;
    var mc_t408 = 0;
    var mc_t407 = 0;
    var mc_t211 = 0;
    var mc_t332 = 0;
    var mc_t453 = 0;
    var mc_t210 = 0;
    var mc_t331 = 0;
    var mc_t452 = 0;
    var mc_t330 = 0;
    var mc_t451 = 0;
    var mc_t450 = 0;
    var Ets = 0;
    var mc_t219 = 0;
    var mc_t218 = 0;
    var mc_t339 = 0;
    var mc_t217 = 0;
    var mc_t338 = 0;
    var mc_t459 = 0;
    var mc_t216 = 0;
    var mc_t337 = 0;
    var mc_t458 = 0;
    var mc_t215 = 0;
    var mc_t336 = 0;
    var mc_t457 = 0;
    var mc_t214 = 0;
    var mc_t335 = 0;
    var mc_t456 = 0;
    var mc_t213 = 0;
    var mc_t334 = 0;
    var mc_t455 = 0;
    var mc_t212 = 0;
    var mc_t333 = 0;
    var mc_t454 = 0;
    var mc_t200 = 0;
    var mc_t321 = 0;
    var mc_t442 = 0;
    var mc_t320 = 0;
    var mc_t441 = 0;
    var mc_t440 = 0;
    var mc_t208 = 0;
    var mc_t329 = 0;
    var mc_t207 = 0;
    var mc_t328 = 0;
    var mc_t449 = 0;
    var mc_t206 = 0;
    var mc_t327 = 0;
    var mc_t448 = 0;
    var mc_t205 = 0;
    var mc_t326 = 0;
    var mc_t447 = 0;
    var mc_t204 = 0;
    var mc_t325 = 0;
    var mc_t446 = 0;
    var mc_t203 = 0;
    var mc_t324 = 0;
    var mc_t445 = 0;
    var mc_t202 = 0;
    var mc_t323 = 0;
    var mc_t444 = 0;
    var mc_t201 = 0;
    var mc_t322 = 0;
    var mc_t443 = 0;
    var mc_t209 = 0;
    var mc_t310 = 0;
    var mc_t431 = 0;
    var mc_t430 = 0;
    var mc_t318 = 0;
    var mc_t439 = 0;
    var mc_t317 = 0;
    var mc_t438 = 0;
    var mc_t316 = 0;
    var mc_t437 = 0;
    var mc_t315 = 0;
    var mc_t436 = 0;
    var mc_t314 = 0;
    var mc_t435 = 0;
    var mc_t313 = 0;
    var mc_t434 = 0;
    var mc_t312 = 0;
    var mc_t433 = 0;
    var mc_t311 = 0;
    var mc_t432 = 0;
    var mc_t319 = 0;
    var mc_t420 = 0;
    var mc_t307 = 0;
    var mc_t428 = 0;
    var mc_t306 = 0;
    var mc_t427 = 0;
    var mc_t305 = 0;
    var mc_t426 = 0;
    var mc_t304 = 0;
    var mc_t425 = 0;
    var mc_t303 = 0;
    var mc_t424 = 0;
    var mc_t302 = 0;
    var mc_t423 = 0;
    var mc_t301 = 0;
    var mc_t422 = 0;
    var mc_t300 = 0;
    var mc_t421 = 0;
    var mc_t309 = 0;
    var mc_t308 = 0;
    var mc_t429 = 0;
    var mc_t134 = 0;
    var mc_t255 = 0;
    var mc_t376 = 0;
    var mc_t497 = 0;
    var mc_t133 = 0;
    var mc_t254 = 0;
    var mc_t375 = 0;
    var mc_t496 = 0;
    var mc_t132 = 0;
    var mc_t253 = 0;
    var mc_t374 = 0;
    var mc_t495 = 0;
    var mc_t131 = 0;
    var mc_t252 = 0;
    var mc_t373 = 0;
    var mc_t494 = 0;
    var mc_t130 = 0;
    var mc_t251 = 0;
    var mc_t372 = 0;
    var mc_t493 = 0;
    var mc_t250 = 0;
    var mc_t371 = 0;
    var mc_t492 = 0;
    var mc_t370 = 0;
    var mc_t491 = 0;
    var mc_t490 = 0;
    var mc_t139 = 0;
    var mc_t138 = 0;
    var mc_t259 = 0;
    var mc_t137 = 0;
    var mc_t258 = 0;
    var mc_t379 = 0;
    var mc_t136 = 0;
    var mc_t257 = 0;
    var mc_t378 = 0;
    var mc_t135 = 0;
    var mc_t256 = 0;
    var mc_t377 = 0;
    var mc_t498 = 0;
    var mc_t123 = 0;
    var mc_t244 = 0;
    var mc_t365 = 0;
    var mc_t486 = 0;
    var mc_t122 = 0;
    var mc_t243 = 0;
    var mc_t364 = 0;
    var mc_t485 = 0;
    var mc_t121 = 0;
    var mc_t242 = 0;
    var mc_t363 = 0;
    var mc_t484 = 0;
    var mc_t241 = 0;
    var mc_t120 = 0;
    var mc_t362 = 0;
    var mc_t483 = 0;
    var mc_t240 = 0;
    var mc_t361 = 0;
    var mc_t482 = 0;
    var mc_t360 = 0;
    var mc_t481 = 0;
    var mc_t480 = 0;
    var mc_t129 = 0;
    var mc_t128 = 0;
    var mc_t249 = 0;
    var mc_t127 = 0;
    var mc_t248 = 0;
    var mc_t369 = 0;
    var mc_t126 = 0;
    var mc_t247 = 0;
    var mc_t368 = 0;
    var mc_t489 = 0;
    var mc_t125 = 0;
    var mc_t246 = 0;
    var mc_t367 = 0;
    var mc_t488 = 0;
    var mc_t124 = 0;
    var mc_t245 = 0;
    var mc_t366 = 0;
    var mc_t487 = 0;
    var mc_t112 = 0;
    var mc_t233 = 0;
    var mc_t354 = 0;
    var mc_t475 = 0;
    var mc_t111 = 0;
    var mc_t232 = 0;
    var mc_t353 = 0;
    var mc_t474 = 0;
    var mc_t110 = 0;
    var mc_t231 = 0;
    var mc_t352 = 0;
    var mc_t473 = 0;
    var mc_t230 = 0;
    var mc_t351 = 0;
    var mc_t472 = 0;
    var mc_t350 = 0;
    var mc_t471 = 0;
    var mc_t470 = 0;
    var mc_t119 = 0;
    var mc_t118 = 0;
    var mc_t239 = 0;
    var mc_t117 = 0;
    var mc_t238 = 0;
    var mc_t359 = 0;
    var mc_t116 = 0;
    var mc_t237 = 0;
    var mc_t358 = 0;
    var mc_t479 = 0;
    var mc_t115 = 0;
    var mc_t236 = 0;
    var mc_t357 = 0;
    var mc_t478 = 0;
    var mc_t114 = 0;
    var mc_t235 = 0;
    var mc_t356 = 0;
    var mc_t477 = 0;
    var mc_t113 = 0;
    var mc_t234 = 0;
    var mc_t355 = 0;
    var mc_t476 = 0;
    var mc_t222 = 0;
    var mc_t101 = 0;
    var mc_t343 = 0;
    var mc_t464 = 0;
    var mc_t221 = 0;
    var mc_t100 = 0;
    var mc_t342 = 0;
    var mc_t463 = 0;
    var mc_t220 = 0;
    var mc_t341 = 0;
    var mc_t462 = 0;
    var mc_t340 = 0;
    var mc_t461 = 0;
    var mc_t460 = 0;
    var mc_t109 = 0;
    var mc_t108 = 0;
    var mc_t229 = 0;
    var mc_t107 = 0;
    var mc_t228 = 0;
    var mc_t349 = 0;
    var mc_t106 = 0;
    var mc_t227 = 0;
    var mc_t348 = 0;
    var mc_t469 = 0;
    var mc_t226 = 0;
    var mc_t105 = 0;
    var mc_t347 = 0;
    var mc_t468 = 0;
    var mc_t225 = 0;
    var mc_t104 = 0;
    var mc_t346 = 0;
    var mc_t467 = 0;
    var mc_t224 = 0;
    var mc_t103 = 0;
    var mc_t345 = 0;
    var mc_t466 = 0;
    var mc_t223 = 0;
    var mc_t102 = 0;
    var mc_t344 = 0;
    var mc_t465 = 0;
    var mc_t178 = 0;
    var mc_t299 = 0;
    var mc_t177 = 0;
    var mc_t298 = 0;
    var mc_t176 = 0;
    var mc_t297 = 0;
    var mc_t175 = 0;
    var mc_t296 = 0;
    var mc_t174 = 0;
    var mc_t295 = 0;
    var mc_t173 = 0;
    var mc_t294 = 0;
    var mc_t172 = 0;
    var mc_t293 = 0;
    var mc_t171 = 0;
    var mc_t292 = 0;
    var mc_t179 = 0;
    var mc_t181 = 0;
    var mc_t180 = 0;
    var mc_t167 = 0;
    var mc_t288 = 0;
    var mc_t166 = 0;
    var mc_t287 = 0;
    var mc_t165 = 0;
    var mc_t286 = 0;
    var mc_t164 = 0;
    var mc_t285 = 0;
    var mc_t163 = 0;
    var mc_t284 = 0;
    var mc_t162 = 0;
    var mc_t283 = 0;
    var mc_t161 = 0;
    var mc_t282 = 0;
    var mc_t160 = 0;
    var mc_t281 = 0;
    var mc_t169 = 0;
    var mc_t168 = 0;
    var mc_t289 = 0;
    var mc_t170 = 0;
    var mc_t291 = 0;
    var mc_t290 = 0;
    var mc_t156 = 0;
    var mc_t277 = 0;
    var mc_t398 = 0;
    var mc_t155 = 0;
    var mc_t276 = 0;
    var mc_t397 = 0;
    var mc_t154 = 0;
    var mc_t275 = 0;
    var mc_t396 = 0;
    var mc_t153 = 0;
    var mc_t274 = 0;
    var mc_t395 = 0;
    var mc_t152 = 0;
    var mc_t273 = 0;
    var mc_t394 = 0;
    var mc_t151 = 0;
    var mc_t272 = 0;
    var mc_t393 = 0;
    var mc_t150 = 0;
    var mc_t271 = 0;
    var mc_t392 = 0;
    var mc_t270 = 0;
    var mc_t391 = 0;
    var mc_t159 = 0;
    var mc_t158 = 0;
    var mc_t279 = 0;
    var mc_t157 = 0;
    var mc_t278 = 0;
    var mc_t399 = 0;
    var mc_t280 = 0;
    var mc_t145 = 0;
    var mc_t266 = 0;
    var mc_t387 = 0;
    var mc_t144 = 0;
    var mc_t265 = 0;
    var mc_t386 = 0;
    var mc_t143 = 0;
    var mc_t264 = 0;
    var mc_t385 = 0;
    var mc_t142 = 0;
    var mc_t263 = 0;
    var mc_t384 = 0;
    var mc_t141 = 0;
    var mc_t262 = 0;
    var mc_t383 = 0;
    var mc_t140 = 0;
    var mc_t261 = 0;
    var mc_t382 = 0;
    var mc_t260 = 0;
    var mc_t381 = 0;
    var mc_t380 = 0;
    var mc_t149 = 0;
    var mc_t148 = 0;
    var mc_t269 = 0;
    var mc_t268 = 0;
    var mc_t147 = 0;
    var mc_t389 = 0;
    var mc_t146 = 0;
    var mc_t388 = 0;
    var mc_t390 = 0;
    var mc_t199 = 0;
    var mc_t198 = 0;
    var mc_t197 = 0;
    var mc_t196 = 0;
    var mc_t195 = 0;
    var mc_t194 = 0;
    var mc_t193 = 0;
    var mc_t189 = 0;
    var mc_t188 = 0;
    var mc_t187 = 0;
    var mc_t186 = 0;
    var mc_t185 = 0;
    var mc_t184 = 0;
    var mc_t183 = 0;
    var mc_t182 = 0;
    var mc_t192 = 0;
    var mc_t191 = 0;
    var mc_t190 = 0;
    var mc_t70 = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var mc_t74 = 0;
    var mu0 = 0;
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
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t94 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t98 = 0;
    var mc_t99 = 0;
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






























































    eps0 = 8.8541878000000000000e-12;

    mc_t13 = wi.pi();
    mc_t174 = 4.0000000000000000000e-07;
    mu0 = mc_t174 * mc_t13;

    c0 = 299792458;


    Cx = Nx / Lx;
    Cy = Ny / Ly;
    Cz = Nz / Lz;


    mc_t14 = c0 * nrm;
    mc_t175 = 1;
    Dt = mc_t175 / mc_t14;



    mc_t15 = Nx;
    mc_t176 = 1;
    mc_t16 = Ny + mc_t176;
    mc_t177 = 1;
    mc_t17 = Nz + mc_t177;
    mc_t269 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t269, 1, mc_t15);
    wi.set_array_index_f64(mc_t269, 2, mc_t16);
    wi.set_array_index_f64(mc_t269, 3, mc_t17);
    Ex = wi.zeros(mc_t269);
    mc_t178 = 1;
    mc_t18 = Nx + mc_t178;
    mc_t19 = Ny;
    mc_t179 = 1;
    mc_t20 = Nz + mc_t179;
    mc_t270 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t270, 1, mc_t18);
    wi.set_array_index_f64(mc_t270, 2, mc_t19);
    wi.set_array_index_f64(mc_t270, 3, mc_t20);
    Ey = wi.zeros(mc_t270);
    mc_t180 = 1;
    mc_t21 = Nx + mc_t180;
    mc_t181 = 1;
    mc_t22 = Ny + mc_t181;
    mc_t23 = Nz;
    mc_t271 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t271, 1, mc_t21);
    wi.set_array_index_f64(mc_t271, 2, mc_t22);
    wi.set_array_index_f64(mc_t271, 3, mc_t23);
    Ez = wi.zeros(mc_t271);
    mc_t182 = 1;
    mc_t24 = Nx + mc_t182;
    mc_t25 = Ny;
    mc_t26 = Nz;
    mc_t272 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t272, 1, mc_t24);
    wi.set_array_index_f64(mc_t272, 2, mc_t25);
    wi.set_array_index_f64(mc_t272, 3, mc_t26);
    Hx = wi.zeros(mc_t272);
    mc_t27 = Nx;
    mc_t183 = 1;
    mc_t28 = Ny + mc_t183;
    mc_t29 = Nz;
    mc_t273 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t273, 1, mc_t27);
    wi.set_array_index_f64(mc_t273, 2, mc_t28);
    wi.set_array_index_f64(mc_t273, 3, mc_t29);
    Hy = wi.zeros(mc_t273);
    mc_t30 = Nx;
    mc_t31 = Ny;
    mc_t184 = 1;
    mc_t32 = Nz + mc_t184;
    mc_t274 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t274, 1, mc_t30);
    wi.set_array_index_f64(mc_t274, 2, mc_t31);
    wi.set_array_index_f64(mc_t274, 3, mc_t32);
    Hz = wi.zeros(mc_t274);


    mc_t185 = 3;
    mc_t275 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t275, 1, Nt);
    wi.set_array_index_f64(mc_t275, 2, mc_t185);
    Ets = wi.zeros(mc_t275);


    mc_t186 = 1;
    mc_t187 = 1;
    mc_t188 = 2;
    mc_t189 = 2;
    wi.set_array_index_f64(Ex, ((((mc_t187-1)+(25*(mc_t188-1)))+(525*(mc_t189-1)))+1), mc_t186);
    mc_t190 = 2;
    mc_t191 = 2;
    mc_t192 = 1;
    mc_t193 = 2;
    wi.set_array_index_f64(Ey, ((((mc_t191-1)+(26*(mc_t192-1)))+(520*(mc_t193-1)))+1), mc_t190);
    mc_t194 = 3;
    mc_t195 = 2;
    mc_t196 = 2;
    mc_t197 = 1;
    wi.set_array_index_f64(Ez, ((((mc_t195-1)+(26*(mc_t196-1)))+(546*(mc_t197-1)))+1), mc_t194);


    mc_t268 = 1;
    for (n = mc_t268; n<=Nt; n = n+1) {

        mc_t33 = Hx;
        mc_t35 = Dt / mu0;
        mc_t198 = 1;
        mc_t52 = Nz + mc_t198;
        mc_t199 = 2;
        mc_t276 = wi.create_mxvector(2, 5);
        mc_t277 = wi.convert_scalar_to_mxarray(mc_t199);
        wi.set_array_index_i32(mc_t276, 1, mc_t277);
        mc_t278 = wi.convert_scalar_to_mxarray(mc_t52);
        wi.set_array_index_i32(mc_t276, 2, mc_t278);
        mc_t51 = wi.colon(mc_t276);
        mc_t279 = wi.create_mxvector(3, 5);
        mc_t280 = wi.colon_two(1, 26);
        wi.set_array_index_i32(mc_t279, 1, mc_t280);
        mc_t281 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t279, 2, mc_t281);
        wi.set_array_index_i32(mc_t279, 3, mc_t51);
        mc_t48 = wi.get_f64(Ey, mc_t279);
        mc_t200 = 1;
        mc_t282 = wi.create_mxvector(2, 5);
        mc_t283 = wi.convert_scalar_to_mxarray(mc_t200);
        wi.set_array_index_i32(mc_t282, 1, mc_t283);
        mc_t284 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t282, 2, mc_t284);
        mc_t50 = wi.colon(mc_t282);
        mc_t285 = wi.create_mxvector(3, 5);
        mc_t286 = wi.colon_two(1, 26);
        wi.set_array_index_i32(mc_t285, 1, mc_t286);
        mc_t287 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t285, 2, mc_t287);
        wi.set_array_index_i32(mc_t285, 3, mc_t50);
        mc_t49 = wi.get_f64(Ey, mc_t285);
        mc_t46 = wi.minus_MM(mc_t48, mc_t49);
        mc_t47 = Cz;
        mc_t37 = wi.mtimes_MS(mc_t46, mc_t47);
        mc_t201 = 1;
        mc_t45 = Ny + mc_t201;
        mc_t202 = 2;
        mc_t288 = wi.create_mxvector(2, 5);
        mc_t289 = wi.convert_scalar_to_mxarray(mc_t202);
        wi.set_array_index_i32(mc_t288, 1, mc_t289);
        mc_t290 = wi.convert_scalar_to_mxarray(mc_t45);
        wi.set_array_index_i32(mc_t288, 2, mc_t290);
        mc_t44 = wi.colon(mc_t288);
        mc_t291 = wi.create_mxvector(3, 5);
        mc_t292 = wi.colon_two(1, 26);
        wi.set_array_index_i32(mc_t291, 1, mc_t292);
        wi.set_array_index_i32(mc_t291, 2, mc_t44);
        mc_t293 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t291, 3, mc_t293);
        mc_t41 = wi.get_f64(Ez, mc_t291);
        mc_t203 = 1;
        mc_t294 = wi.create_mxvector(2, 5);
        mc_t295 = wi.convert_scalar_to_mxarray(mc_t203);
        wi.set_array_index_i32(mc_t294, 1, mc_t295);
        mc_t296 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t294, 2, mc_t296);
        mc_t43 = wi.colon(mc_t294);
        mc_t297 = wi.create_mxvector(3, 5);
        mc_t298 = wi.colon_two(1, 26);
        wi.set_array_index_i32(mc_t297, 1, mc_t298);
        wi.set_array_index_i32(mc_t297, 2, mc_t43);
        mc_t299 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t297, 3, mc_t299);
        mc_t42 = wi.get_f64(Ez, mc_t297);
        mc_t39 = wi.minus_MM(mc_t41, mc_t42);
        mc_t40 = Cy;
        mc_t38 = wi.mtimes_MS(mc_t39, mc_t40);
        mc_t36 = wi.minus_MM(mc_t37, mc_t38);
        mc_t34 = wi.mtimes_SM(mc_t35, mc_t36);
        Hx = wi.plus_MM(mc_t33, mc_t34);
        mc_t53 = Hy;
        mc_t55 = Dt / mu0;
        mc_t204 = 1;
        mc_t72 = Nx + mc_t204;
        mc_t205 = 2;
        mc_t300 = wi.create_mxvector(2, 5);
        mc_t301 = wi.convert_scalar_to_mxarray(mc_t205);
        wi.set_array_index_i32(mc_t300, 1, mc_t301);
        mc_t302 = wi.convert_scalar_to_mxarray(mc_t72);
        wi.set_array_index_i32(mc_t300, 2, mc_t302);
        mc_t71 = wi.colon(mc_t300);
        mc_t303 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t303, 1, mc_t71);
        mc_t304 = wi.colon_two(1, 21);
        wi.set_array_index_i32(mc_t303, 2, mc_t304);
        mc_t305 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t303, 3, mc_t305);
        mc_t68 = wi.get_f64(Ez, mc_t303);
        mc_t206 = 1;
        mc_t306 = wi.create_mxvector(2, 5);
        mc_t307 = wi.convert_scalar_to_mxarray(mc_t206);
        wi.set_array_index_i32(mc_t306, 1, mc_t307);
        mc_t308 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t306, 2, mc_t308);
        mc_t70 = wi.colon(mc_t306);
        mc_t309 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t309, 1, mc_t70);
        mc_t310 = wi.colon_two(1, 21);
        wi.set_array_index_i32(mc_t309, 2, mc_t310);
        mc_t311 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t309, 3, mc_t311);
        mc_t69 = wi.get_f64(Ez, mc_t309);
        mc_t66 = wi.minus_MM(mc_t68, mc_t69);
        mc_t67 = Cx;
        mc_t57 = wi.mtimes_MS(mc_t66, mc_t67);
        mc_t207 = 1;
        mc_t65 = Nz + mc_t207;
        mc_t208 = 2;
        mc_t312 = wi.create_mxvector(2, 5);
        mc_t313 = wi.convert_scalar_to_mxarray(mc_t208);
        wi.set_array_index_i32(mc_t312, 1, mc_t313);
        mc_t314 = wi.convert_scalar_to_mxarray(mc_t65);
        wi.set_array_index_i32(mc_t312, 2, mc_t314);
        mc_t64 = wi.colon(mc_t312);
        mc_t315 = wi.create_mxvector(3, 5);
        mc_t316 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t315, 1, mc_t316);
        mc_t317 = wi.colon_two(1, 21);
        wi.set_array_index_i32(mc_t315, 2, mc_t317);
        wi.set_array_index_i32(mc_t315, 3, mc_t64);
        mc_t61 = wi.get_f64(Ex, mc_t315);
        mc_t209 = 1;
        mc_t318 = wi.create_mxvector(2, 5);
        mc_t319 = wi.convert_scalar_to_mxarray(mc_t209);
        wi.set_array_index_i32(mc_t318, 1, mc_t319);
        mc_t320 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t318, 2, mc_t320);
        mc_t63 = wi.colon(mc_t318);
        mc_t321 = wi.create_mxvector(3, 5);
        mc_t322 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t321, 1, mc_t322);
        mc_t323 = wi.colon_two(1, 21);
        wi.set_array_index_i32(mc_t321, 2, mc_t323);
        wi.set_array_index_i32(mc_t321, 3, mc_t63);
        mc_t62 = wi.get_f64(Ex, mc_t321);
        mc_t59 = wi.minus_MM(mc_t61, mc_t62);
        mc_t60 = Cz;
        mc_t58 = wi.mtimes_MS(mc_t59, mc_t60);
        mc_t56 = wi.minus_MM(mc_t57, mc_t58);
        mc_t54 = wi.mtimes_SM(mc_t55, mc_t56);
        Hy = wi.plus_MM(mc_t53, mc_t54);
        mc_t73 = Hz;
        mc_t75 = Dt / mu0;
        mc_t210 = 1;
        mc_t92 = Ny + mc_t210;
        mc_t211 = 2;
        mc_t324 = wi.create_mxvector(2, 5);
        mc_t325 = wi.convert_scalar_to_mxarray(mc_t211);
        wi.set_array_index_i32(mc_t324, 1, mc_t325);
        mc_t326 = wi.convert_scalar_to_mxarray(mc_t92);
        wi.set_array_index_i32(mc_t324, 2, mc_t326);
        mc_t91 = wi.colon(mc_t324);
        mc_t327 = wi.create_mxvector(3, 5);
        mc_t328 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t327, 1, mc_t328);
        wi.set_array_index_i32(mc_t327, 2, mc_t91);
        mc_t329 = wi.colon_two(1, 16);
        wi.set_array_index_i32(mc_t327, 3, mc_t329);
        mc_t88 = wi.get_f64(Ex, mc_t327);
        mc_t212 = 1;
        mc_t330 = wi.create_mxvector(2, 5);
        mc_t331 = wi.convert_scalar_to_mxarray(mc_t212);
        wi.set_array_index_i32(mc_t330, 1, mc_t331);
        mc_t332 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t330, 2, mc_t332);
        mc_t90 = wi.colon(mc_t330);
        mc_t333 = wi.create_mxvector(3, 5);
        mc_t334 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t333, 1, mc_t334);
        wi.set_array_index_i32(mc_t333, 2, mc_t90);
        mc_t335 = wi.colon_two(1, 16);
        wi.set_array_index_i32(mc_t333, 3, mc_t335);
        mc_t89 = wi.get_f64(Ex, mc_t333);
        mc_t86 = wi.minus_MM(mc_t88, mc_t89);
        mc_t87 = Cy;
        mc_t77 = wi.mtimes_MS(mc_t86, mc_t87);
        mc_t213 = 1;
        mc_t85 = Nx + mc_t213;
        mc_t214 = 2;
        mc_t336 = wi.create_mxvector(2, 5);
        mc_t337 = wi.convert_scalar_to_mxarray(mc_t214);
        wi.set_array_index_i32(mc_t336, 1, mc_t337);
        mc_t338 = wi.convert_scalar_to_mxarray(mc_t85);
        wi.set_array_index_i32(mc_t336, 2, mc_t338);
        mc_t84 = wi.colon(mc_t336);
        mc_t339 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t339, 1, mc_t84);
        mc_t340 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t339, 2, mc_t340);
        mc_t341 = wi.colon_two(1, 16);
        wi.set_array_index_i32(mc_t339, 3, mc_t341);
        mc_t81 = wi.get_f64(Ey, mc_t339);
        mc_t215 = 1;
        mc_t342 = wi.create_mxvector(2, 5);
        mc_t343 = wi.convert_scalar_to_mxarray(mc_t215);
        wi.set_array_index_i32(mc_t342, 1, mc_t343);
        mc_t344 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t342, 2, mc_t344);
        mc_t83 = wi.colon(mc_t342);
        mc_t345 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t345, 1, mc_t83);
        mc_t346 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t345, 2, mc_t346);
        mc_t347 = wi.colon_two(1, 16);
        wi.set_array_index_i32(mc_t345, 3, mc_t347);
        mc_t82 = wi.get_f64(Ey, mc_t345);
        mc_t79 = wi.minus_MM(mc_t81, mc_t82);
        mc_t80 = Cx;
        mc_t78 = wi.mtimes_MS(mc_t79, mc_t80);
        mc_t76 = wi.minus_MM(mc_t77, mc_t78);
        mc_t74 = wi.mtimes_SM(mc_t75, mc_t76);
        Hz = wi.plus_MM(mc_t73, mc_t74);


        mc_t216 = 2;
        mc_t348 = wi.create_mxvector(2, 5);
        mc_t349 = wi.convert_scalar_to_mxarray(mc_t216);
        wi.set_array_index_i32(mc_t348, 1, mc_t349);
        mc_t350 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t348, 2, mc_t350);
        mc_t117 = wi.colon(mc_t348);
        mc_t217 = 2;
        mc_t351 = wi.create_mxvector(2, 5);
        mc_t352 = wi.convert_scalar_to_mxarray(mc_t217);
        wi.set_array_index_i32(mc_t351, 1, mc_t352);
        mc_t353 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t351, 2, mc_t353);
        mc_t118 = wi.colon(mc_t351);
        mc_t354 = wi.create_mxvector(3, 5);
        mc_t355 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t354, 1, mc_t355);
        wi.set_array_index_i32(mc_t354, 2, mc_t117);
        wi.set_array_index_i32(mc_t354, 3, mc_t118);
        mc_t93 = wi.get_f64(Ex, mc_t354);
        mc_t95 = Dt / eps0;
        mc_t218 = 2;
        mc_t356 = wi.create_mxvector(2, 5);
        mc_t357 = wi.convert_scalar_to_mxarray(mc_t218);
        wi.set_array_index_i32(mc_t356, 1, mc_t357);
        mc_t358 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t356, 2, mc_t358);
        mc_t115 = wi.colon(mc_t356);
        mc_t219 = 2;
        mc_t359 = wi.create_mxvector(2, 5);
        mc_t360 = wi.convert_scalar_to_mxarray(mc_t219);
        wi.set_array_index_i32(mc_t359, 1, mc_t360);
        mc_t361 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t359, 2, mc_t361);
        mc_t116 = wi.colon(mc_t359);
        mc_t362 = wi.create_mxvector(3, 5);
        mc_t363 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t362, 1, mc_t363);
        wi.set_array_index_i32(mc_t362, 2, mc_t115);
        wi.set_array_index_i32(mc_t362, 3, mc_t116);
        mc_t110 = wi.get_f64(Hz, mc_t362);
        mc_t220 = 1;
        mc_t114 = Ny - mc_t220;
        mc_t221 = 1;
        mc_t364 = wi.create_mxvector(2, 5);
        mc_t365 = wi.convert_scalar_to_mxarray(mc_t221);
        wi.set_array_index_i32(mc_t364, 1, mc_t365);
        mc_t366 = wi.convert_scalar_to_mxarray(mc_t114);
        wi.set_array_index_i32(mc_t364, 2, mc_t366);
        mc_t112 = wi.colon(mc_t364);
        mc_t222 = 2;
        mc_t367 = wi.create_mxvector(2, 5);
        mc_t368 = wi.convert_scalar_to_mxarray(mc_t222);
        wi.set_array_index_i32(mc_t367, 1, mc_t368);
        mc_t369 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t367, 2, mc_t369);
        mc_t113 = wi.colon(mc_t367);
        mc_t370 = wi.create_mxvector(3, 5);
        mc_t371 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t370, 1, mc_t371);
        wi.set_array_index_i32(mc_t370, 2, mc_t112);
        wi.set_array_index_i32(mc_t370, 3, mc_t113);
        mc_t111 = wi.get_f64(Hz, mc_t370);
        mc_t108 = wi.minus_MM(mc_t110, mc_t111);
        mc_t109 = Cy;
        mc_t97 = wi.mtimes_MS(mc_t108, mc_t109);
        mc_t223 = 2;
        mc_t372 = wi.create_mxvector(2, 5);
        mc_t373 = wi.convert_scalar_to_mxarray(mc_t223);
        wi.set_array_index_i32(mc_t372, 1, mc_t373);
        mc_t374 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t372, 2, mc_t374);
        mc_t106 = wi.colon(mc_t372);
        mc_t224 = 2;
        mc_t375 = wi.create_mxvector(2, 5);
        mc_t376 = wi.convert_scalar_to_mxarray(mc_t224);
        wi.set_array_index_i32(mc_t375, 1, mc_t376);
        mc_t377 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t375, 2, mc_t377);
        mc_t107 = wi.colon(mc_t375);
        mc_t378 = wi.create_mxvector(3, 5);
        mc_t379 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t378, 1, mc_t379);
        wi.set_array_index_i32(mc_t378, 2, mc_t106);
        wi.set_array_index_i32(mc_t378, 3, mc_t107);
        mc_t101 = wi.get_f64(Hy, mc_t378);
        mc_t225 = 2;
        mc_t380 = wi.create_mxvector(2, 5);
        mc_t381 = wi.convert_scalar_to_mxarray(mc_t225);
        wi.set_array_index_i32(mc_t380, 1, mc_t381);
        mc_t382 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t380, 2, mc_t382);
        mc_t103 = wi.colon(mc_t380);
        mc_t226 = 1;
        mc_t105 = Nz - mc_t226;
        mc_t227 = 1;
        mc_t383 = wi.create_mxvector(2, 5);
        mc_t384 = wi.convert_scalar_to_mxarray(mc_t227);
        wi.set_array_index_i32(mc_t383, 1, mc_t384);
        mc_t385 = wi.convert_scalar_to_mxarray(mc_t105);
        wi.set_array_index_i32(mc_t383, 2, mc_t385);
        mc_t104 = wi.colon(mc_t383);
        mc_t386 = wi.create_mxvector(3, 5);
        mc_t387 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t386, 1, mc_t387);
        wi.set_array_index_i32(mc_t386, 2, mc_t103);
        wi.set_array_index_i32(mc_t386, 3, mc_t104);
        mc_t102 = wi.get_f64(Hy, mc_t386);
        mc_t99 = wi.minus_MM(mc_t101, mc_t102);
        mc_t100 = Cz;
        mc_t98 = wi.mtimes_MS(mc_t99, mc_t100);
        mc_t96 = wi.minus_MM(mc_t97, mc_t98);
        mc_t94 = wi.mtimes_SM(mc_t95, mc_t96);
        mc_t3 = wi.plus_MM(mc_t93, mc_t94);
        mc_t228 = 2;
        mc_t388 = wi.create_mxvector(2, 5);
        mc_t389 = wi.convert_scalar_to_mxarray(mc_t228);
        wi.set_array_index_i32(mc_t388, 1, mc_t389);
        mc_t390 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t388, 2, mc_t390);
        mc_t7 = wi.colon(mc_t388);
        mc_t229 = 2;
        mc_t391 = wi.create_mxvector(2, 5);
        mc_t392 = wi.convert_scalar_to_mxarray(mc_t229);
        wi.set_array_index_i32(mc_t391, 1, mc_t392);
        mc_t393 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t391, 2, mc_t393);
        mc_t8 = wi.colon(mc_t391);
        mc_t394 = wi.create_mxvector(3, 5);
        mc_t395 = wi.colon_two(1, 25);
        wi.set_array_index_i32(mc_t394, 1, mc_t395);
        wi.set_array_index_i32(mc_t394, 2, mc_t7);
        wi.set_array_index_i32(mc_t394, 3, mc_t8);
        wi.set_f64(Ex, mc_t394, mc_t3);
        mc_t230 = 2;
        mc_t396 = wi.create_mxvector(2, 5);
        mc_t397 = wi.convert_scalar_to_mxarray(mc_t230);
        wi.set_array_index_i32(mc_t396, 1, mc_t397);
        mc_t398 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t396, 2, mc_t398);
        mc_t143 = wi.colon(mc_t396);
        mc_t231 = 2;
        mc_t399 = wi.create_mxvector(2, 5);
        mc_t400 = wi.convert_scalar_to_mxarray(mc_t231);
        wi.set_array_index_i32(mc_t399, 1, mc_t400);
        mc_t401 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t399, 2, mc_t401);
        mc_t144 = wi.colon(mc_t399);
        mc_t402 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t402, 1, mc_t143);
        mc_t403 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t402, 2, mc_t403);
        wi.set_array_index_i32(mc_t402, 3, mc_t144);
        mc_t119 = wi.get_f64(Ey, mc_t402);
        mc_t121 = Dt / eps0;
        mc_t232 = 2;
        mc_t404 = wi.create_mxvector(2, 5);
        mc_t405 = wi.convert_scalar_to_mxarray(mc_t232);
        wi.set_array_index_i32(mc_t404, 1, mc_t405);
        mc_t406 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t404, 2, mc_t406);
        mc_t141 = wi.colon(mc_t404);
        mc_t233 = 2;
        mc_t407 = wi.create_mxvector(2, 5);
        mc_t408 = wi.convert_scalar_to_mxarray(mc_t233);
        wi.set_array_index_i32(mc_t407, 1, mc_t408);
        mc_t409 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t407, 2, mc_t409);
        mc_t142 = wi.colon(mc_t407);
        mc_t410 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t410, 1, mc_t141);
        mc_t411 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t410, 2, mc_t411);
        wi.set_array_index_i32(mc_t410, 3, mc_t142);
        mc_t136 = wi.get_f64(Hx, mc_t410);
        mc_t234 = 2;
        mc_t412 = wi.create_mxvector(2, 5);
        mc_t413 = wi.convert_scalar_to_mxarray(mc_t234);
        wi.set_array_index_i32(mc_t412, 1, mc_t413);
        mc_t414 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t412, 2, mc_t414);
        mc_t138 = wi.colon(mc_t412);
        mc_t235 = 1;
        mc_t140 = Nz - mc_t235;
        mc_t236 = 1;
        mc_t415 = wi.create_mxvector(2, 5);
        mc_t416 = wi.convert_scalar_to_mxarray(mc_t236);
        wi.set_array_index_i32(mc_t415, 1, mc_t416);
        mc_t417 = wi.convert_scalar_to_mxarray(mc_t140);
        wi.set_array_index_i32(mc_t415, 2, mc_t417);
        mc_t139 = wi.colon(mc_t415);
        mc_t418 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t418, 1, mc_t138);
        mc_t419 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t418, 2, mc_t419);
        wi.set_array_index_i32(mc_t418, 3, mc_t139);
        mc_t137 = wi.get_f64(Hx, mc_t418);
        mc_t134 = wi.minus_MM(mc_t136, mc_t137);
        mc_t135 = Cz;
        mc_t123 = wi.mtimes_MS(mc_t134, mc_t135);
        mc_t237 = 2;
        mc_t420 = wi.create_mxvector(2, 5);
        mc_t421 = wi.convert_scalar_to_mxarray(mc_t237);
        wi.set_array_index_i32(mc_t420, 1, mc_t421);
        mc_t422 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t420, 2, mc_t422);
        mc_t132 = wi.colon(mc_t420);
        mc_t238 = 2;
        mc_t423 = wi.create_mxvector(2, 5);
        mc_t424 = wi.convert_scalar_to_mxarray(mc_t238);
        wi.set_array_index_i32(mc_t423, 1, mc_t424);
        mc_t425 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t423, 2, mc_t425);
        mc_t133 = wi.colon(mc_t423);
        mc_t426 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t426, 1, mc_t132);
        mc_t427 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t426, 2, mc_t427);
        wi.set_array_index_i32(mc_t426, 3, mc_t133);
        mc_t127 = wi.get_f64(Hz, mc_t426);
        mc_t239 = 1;
        mc_t131 = Nx - mc_t239;
        mc_t240 = 1;
        mc_t428 = wi.create_mxvector(2, 5);
        mc_t429 = wi.convert_scalar_to_mxarray(mc_t240);
        wi.set_array_index_i32(mc_t428, 1, mc_t429);
        mc_t430 = wi.convert_scalar_to_mxarray(mc_t131);
        wi.set_array_index_i32(mc_t428, 2, mc_t430);
        mc_t129 = wi.colon(mc_t428);
        mc_t241 = 2;
        mc_t431 = wi.create_mxvector(2, 5);
        mc_t432 = wi.convert_scalar_to_mxarray(mc_t241);
        wi.set_array_index_i32(mc_t431, 1, mc_t432);
        mc_t433 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t431, 2, mc_t433);
        mc_t130 = wi.colon(mc_t431);
        mc_t434 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t434, 1, mc_t129);
        mc_t435 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t434, 2, mc_t435);
        wi.set_array_index_i32(mc_t434, 3, mc_t130);
        mc_t128 = wi.get_f64(Hz, mc_t434);
        mc_t125 = wi.minus_MM(mc_t127, mc_t128);
        mc_t126 = Cx;
        mc_t124 = wi.mtimes_MS(mc_t125, mc_t126);
        mc_t122 = wi.minus_MM(mc_t123, mc_t124);
        mc_t120 = wi.mtimes_SM(mc_t121, mc_t122);
        mc_t4 = wi.plus_MM(mc_t119, mc_t120);
        mc_t242 = 2;
        mc_t436 = wi.create_mxvector(2, 5);
        mc_t437 = wi.convert_scalar_to_mxarray(mc_t242);
        wi.set_array_index_i32(mc_t436, 1, mc_t437);
        mc_t438 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t436, 2, mc_t438);
        mc_t9 = wi.colon(mc_t436);
        mc_t243 = 2;
        mc_t439 = wi.create_mxvector(2, 5);
        mc_t440 = wi.convert_scalar_to_mxarray(mc_t243);
        wi.set_array_index_i32(mc_t439, 1, mc_t440);
        mc_t441 = wi.convert_scalar_to_mxarray(Nz);
        wi.set_array_index_i32(mc_t439, 2, mc_t441);
        mc_t10 = wi.colon(mc_t439);
        mc_t442 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t442, 1, mc_t9);
        mc_t443 = wi.colon_two(1, 20);
        wi.set_array_index_i32(mc_t442, 2, mc_t443);
        wi.set_array_index_i32(mc_t442, 3, mc_t10);
        wi.set_f64(Ey, mc_t442, mc_t4);
        mc_t244 = 2;
        mc_t444 = wi.create_mxvector(2, 5);
        mc_t445 = wi.convert_scalar_to_mxarray(mc_t244);
        wi.set_array_index_i32(mc_t444, 1, mc_t445);
        mc_t446 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t444, 2, mc_t446);
        mc_t169 = wi.colon(mc_t444);
        mc_t245 = 2;
        mc_t447 = wi.create_mxvector(2, 5);
        mc_t448 = wi.convert_scalar_to_mxarray(mc_t245);
        wi.set_array_index_i32(mc_t447, 1, mc_t448);
        mc_t449 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t447, 2, mc_t449);
        mc_t170 = wi.colon(mc_t447);
        mc_t450 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t450, 1, mc_t169);
        wi.set_array_index_i32(mc_t450, 2, mc_t170);
        mc_t451 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t450, 3, mc_t451);
        mc_t145 = wi.get_f64(Ez, mc_t450);
        mc_t147 = Dt / eps0;
        mc_t246 = 2;
        mc_t452 = wi.create_mxvector(2, 5);
        mc_t453 = wi.convert_scalar_to_mxarray(mc_t246);
        wi.set_array_index_i32(mc_t452, 1, mc_t453);
        mc_t454 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t452, 2, mc_t454);
        mc_t167 = wi.colon(mc_t452);
        mc_t247 = 2;
        mc_t455 = wi.create_mxvector(2, 5);
        mc_t456 = wi.convert_scalar_to_mxarray(mc_t247);
        wi.set_array_index_i32(mc_t455, 1, mc_t456);
        mc_t457 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t455, 2, mc_t457);
        mc_t168 = wi.colon(mc_t455);
        mc_t458 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t458, 1, mc_t167);
        wi.set_array_index_i32(mc_t458, 2, mc_t168);
        mc_t459 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t458, 3, mc_t459);
        mc_t162 = wi.get_f64(Hy, mc_t458);
        mc_t248 = 1;
        mc_t166 = Nx - mc_t248;
        mc_t249 = 1;
        mc_t460 = wi.create_mxvector(2, 5);
        mc_t461 = wi.convert_scalar_to_mxarray(mc_t249);
        wi.set_array_index_i32(mc_t460, 1, mc_t461);
        mc_t462 = wi.convert_scalar_to_mxarray(mc_t166);
        wi.set_array_index_i32(mc_t460, 2, mc_t462);
        mc_t164 = wi.colon(mc_t460);
        mc_t250 = 2;
        mc_t463 = wi.create_mxvector(2, 5);
        mc_t464 = wi.convert_scalar_to_mxarray(mc_t250);
        wi.set_array_index_i32(mc_t463, 1, mc_t464);
        mc_t465 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t463, 2, mc_t465);
        mc_t165 = wi.colon(mc_t463);
        mc_t466 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t466, 1, mc_t164);
        wi.set_array_index_i32(mc_t466, 2, mc_t165);
        mc_t467 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t466, 3, mc_t467);
        mc_t163 = wi.get_f64(Hy, mc_t466);
        mc_t160 = wi.minus_MM(mc_t162, mc_t163);
        mc_t161 = Cx;
        mc_t149 = wi.mtimes_MS(mc_t160, mc_t161);
        mc_t251 = 2;
        mc_t468 = wi.create_mxvector(2, 5);
        mc_t469 = wi.convert_scalar_to_mxarray(mc_t251);
        wi.set_array_index_i32(mc_t468, 1, mc_t469);
        mc_t470 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t468, 2, mc_t470);
        mc_t158 = wi.colon(mc_t468);
        mc_t252 = 2;
        mc_t471 = wi.create_mxvector(2, 5);
        mc_t472 = wi.convert_scalar_to_mxarray(mc_t252);
        wi.set_array_index_i32(mc_t471, 1, mc_t472);
        mc_t473 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t471, 2, mc_t473);
        mc_t159 = wi.colon(mc_t471);
        mc_t474 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t474, 1, mc_t158);
        wi.set_array_index_i32(mc_t474, 2, mc_t159);
        mc_t475 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t474, 3, mc_t475);
        mc_t153 = wi.get_f64(Hx, mc_t474);
        mc_t253 = 2;
        mc_t476 = wi.create_mxvector(2, 5);
        mc_t477 = wi.convert_scalar_to_mxarray(mc_t253);
        wi.set_array_index_i32(mc_t476, 1, mc_t477);
        mc_t478 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t476, 2, mc_t478);
        mc_t155 = wi.colon(mc_t476);
        mc_t254 = 1;
        mc_t157 = Ny - mc_t254;
        mc_t255 = 1;
        mc_t479 = wi.create_mxvector(2, 5);
        mc_t480 = wi.convert_scalar_to_mxarray(mc_t255);
        wi.set_array_index_i32(mc_t479, 1, mc_t480);
        mc_t481 = wi.convert_scalar_to_mxarray(mc_t157);
        wi.set_array_index_i32(mc_t479, 2, mc_t481);
        mc_t156 = wi.colon(mc_t479);
        mc_t482 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t482, 1, mc_t155);
        wi.set_array_index_i32(mc_t482, 2, mc_t156);
        mc_t483 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t482, 3, mc_t483);
        mc_t154 = wi.get_f64(Hx, mc_t482);
        mc_t151 = wi.minus_MM(mc_t153, mc_t154);
        mc_t152 = Cy;
        mc_t150 = wi.mtimes_MS(mc_t151, mc_t152);
        mc_t148 = wi.minus_MM(mc_t149, mc_t150);
        mc_t146 = wi.mtimes_SM(mc_t147, mc_t148);
        mc_t5 = wi.plus_MM(mc_t145, mc_t146);
        mc_t256 = 2;
        mc_t484 = wi.create_mxvector(2, 5);
        mc_t485 = wi.convert_scalar_to_mxarray(mc_t256);
        wi.set_array_index_i32(mc_t484, 1, mc_t485);
        mc_t486 = wi.convert_scalar_to_mxarray(Nx);
        wi.set_array_index_i32(mc_t484, 2, mc_t486);
        mc_t11 = wi.colon(mc_t484);
        mc_t257 = 2;
        mc_t487 = wi.create_mxvector(2, 5);
        mc_t488 = wi.convert_scalar_to_mxarray(mc_t257);
        wi.set_array_index_i32(mc_t487, 1, mc_t488);
        mc_t489 = wi.convert_scalar_to_mxarray(Ny);
        wi.set_array_index_i32(mc_t487, 2, mc_t489);
        mc_t12 = wi.colon(mc_t487);
        mc_t490 = wi.create_mxvector(3, 5);
        wi.set_array_index_i32(mc_t490, 1, mc_t11);
        wi.set_array_index_i32(mc_t490, 2, mc_t12);
        mc_t491 = wi.colon_two(1, 15);
        wi.set_array_index_i32(mc_t490, 3, mc_t491);
        wi.set_f64(Ez, mc_t490, mc_t5);


        mc_t258 = 4;
        mc_t259 = 4;
        mc_t260 = 4;
        mc_t171 = wi.get_array_index_f64(Ex, ((((mc_t258-1)+(25*(mc_t259-1)))+(525*(mc_t260-1)))+1));
        mc_t261 = 4;
        mc_t262 = 4;
        mc_t263 = 4;
        mc_t172 = wi.get_array_index_f64(Ey, ((((mc_t261-1)+(26*(mc_t262-1)))+(520*(mc_t263-1)))+1));
        mc_t264 = 4;
        mc_t265 = 4;
        mc_t266 = 4;
        mc_t173 = wi.get_array_index_f64(Ez, ((((mc_t264-1)+(26*(mc_t265-1)))+(546*(mc_t266-1)))+1));
        mc_t492 = wi.create_mxvector(3, 5);
        mc_t493 = wi.convert_scalar_to_mxarray(mc_t171);
        wi.set_array_index_i32(mc_t492, 1, mc_t493);
        mc_t494 = wi.convert_scalar_to_mxarray(mc_t172);
        wi.set_array_index_i32(mc_t492, 2, mc_t494);
        mc_t495 = wi.convert_scalar_to_mxarray(mc_t173);
        wi.set_array_index_i32(mc_t492, 3, mc_t495);
        mc_t6 = wi.horzcat(mc_t492);
        mc_t496 = wi.create_mxvector(2, 5);
        mc_t497 = wi.convert_scalar_to_mxarray(n);
        wi.set_array_index_i32(mc_t496, 1, mc_t497);
        mc_t498 = wi.colon_two(1, 3);
        wi.set_array_index_i32(mc_t496, 2, mc_t498);
        wi.set_f64(Ets, mc_t496, mc_t6);
    }

    return [Ex, Ey, Ez, Hx, Hy, Hz, Ets];
}

function drv_fdtd_S(scale){
    var Ets = 0;
    var Nt = 0;
    var nrm = 0;
    var Nx = 0;
    var Ny = 0;
    var mc_t0 = 0;
    var Lx = 0;
    var Nz = 0;
    var Ly = 0;
    var Lz = 0;
    var mc_t499 = 0;
    var Hx = 0;
    var Hy = 0;
    var Hz = 0;
    var Ex = 0;
    var Ey = 0;
    var t = 0;
    var Ez = 0;





    Lx = 0.050000000000000000000;
    Ly = 0.040000000000000000000;
    Lz = 0.030000000000000000000;

    Nx = 25;
    Ny = 20;
    Nz = 15;




    nrm = 866.02540000000000000;
    scale = 1;
    mc_t0 = 200;
    Nt = scale * mc_t0;

    wi.tic();
    mc_t499 = fdtd_SSSSSSSS(Lx, Ly, Lz, Nx, Ny, Nz, nrm, Nt);
    Ex = wi.get_array_index_f64(mc_t499, 1);
    Ey = wi.get_array_index_f64(mc_t499, 2);
    Ez = wi.get_array_index_f64(mc_t499, 3);
    Hx = wi.get_array_index_f64(mc_t499, 4);
    Hy = wi.get_array_index_f64(mc_t499, 5);
    Hz = wi.get_array_index_f64(mc_t499, 6);
    Ets = wi.get_array_index_f64(mc_t499, 7);
    t = wi.toc();
    wi.disp_S(t);
    return;
}
drv_fdtd_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
