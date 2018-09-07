let memory = WebAssembly.Memory({initial:10});
const { TextDecoder,TextEncoder } = require('util');
function printError(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    throw new Error(string);
}

function printString(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
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
        "printError":printError,
        "printWho":printWhos,
        "printString":printString,
        "printDouble":printInt,
        "printDoubleNumber":printDouble,
        "printMarker":()=>console.log("MARKER"),
        "assert_header":1,
        "print_array_f64":printArrayDouble
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
        pi:Math.PI,
        e:Math.E
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

function drv_babai_S(scale){
    var mc_t134 = 0;
    var mc_t255 = 0;
    var mc_t133 = 0;
    var mc_t254 = 0;
    var mc_t132 = 0;
    var mc_t253 = 0;
    var mc_t131 = 0;
    var mc_t252 = 0;
    var mc_t130 = 0;
    var mc_t251 = 0;
    var mc_t250 = 0;
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t32 = 0;
    var mc_t33 = 0;
    var mc_t139 = 0;
    var mc_t34 = 0;
    var mc_t138 = 0;
    var mc_t259 = 0;
    var mc_t35 = 0;
    var mc_t137 = 0;
    var mc_t258 = 0;
    var mc_t36 = 0;
    var mc_t136 = 0;
    var mc_t257 = 0;
    var mc_t37 = 0;
    var mc_t135 = 0;
    var mc_t256 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var mc_t123 = 0;
    var mc_t244 = 0;
    var mc_t122 = 0;
    var mc_t243 = 0;
    var mc_t121 = 0;
    var mc_t242 = 0;
    var mc_t120 = 0;
    var mc_t241 = 0;
    var mc_t240 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var mc_t129 = 0;
    var mc_t22 = 0;
    var mc_t128 = 0;
    var mc_t249 = 0;
    var mc_t23 = 0;
    var mc_t127 = 0;
    var mc_t248 = 0;
    var mc_t24 = 0;
    var mc_t126 = 0;
    var mc_t247 = 0;
    var mc_t25 = 0;
    var mc_t125 = 0;
    var mc_t246 = 0;
    var mc_t26 = 0;
    var mc_t124 = 0;
    var mc_t245 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var mc_t112 = 0;
    var mc_t233 = 0;
    var A = 0;
    var mc_t111 = 0;
    var mc_t232 = 0;
    var mc_t110 = 0;
    var mc_t231 = 0;
    var mc_t230 = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t119 = 0;
    var mc_t54 = 0;
    var mc_t118 = 0;
    var mc_t239 = 0;
    var mc_t55 = 0;
    var mc_t117 = 0;
    var mc_t238 = 0;
    var mc_t56 = 0;
    var mc_t116 = 0;
    var mc_t237 = 0;
    var mc_t57 = 0;
    var mc_t115 = 0;
    var mc_t236 = 0;
    var mc_t58 = 0;
    var mc_t114 = 0;
    var mc_t235 = 0;
    var mc_t59 = 0;
    var mc_t113 = 0;
    var mc_t234 = 0;
    var mc_t101 = 0;
    var mc_t222 = 0;
    var mc_t100 = 0;
    var mc_t221 = 0;
    var mc_t220 = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t109 = 0;
    var i = 0;
    var mc_t42 = 0;
    var mc_t108 = 0;
    var mc_t229 = 0;
    var mc_t43 = 0;
    var mc_t107 = 0;
    var mc_t228 = 0;
    var mc_t44 = 0;
    var mc_t106 = 0;
    var mc_t227 = 0;
    var mc_t45 = 0;
    var mc_t105 = 0;
    var mc_t226 = 0;
    var mc_t46 = 0;
    var mc_t104 = 0;
    var mc_t225 = 0;
    var mc_t103 = 0;
    var mc_t47 = 0;
    var mc_t224 = 0;
    var mc_t102 = 0;
    var mc_t48 = 0;
    var mc_t223 = 0;
    var mc_t49 = 0;
    var y = 0;
    var z = 0;
    var mc_t178 = 0;
    var mc_t299 = 0;
    var mc_t177 = 0;
    var mc_t298 = 0;
    var mc_t176 = 0;
    var mc_t297 = 0;
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
    var mc_t289 = 0;
    var mc_t170 = 0;
    var mc_t291 = 0;
    var mc_t290 = 0;
    var mc_t156 = 0;
    var mc_t277 = 0;
    var mc_t155 = 0;
    var mc_t276 = 0;
    var mc_t154 = 0;
    var mc_t275 = 0;
    var mc_t153 = 0;
    var mc_t274 = 0;
    var mc_t152 = 0;
    var mc_t273 = 0;
    var mc_t151 = 0;
    var mc_t272 = 0;
    var mc_t150 = 0;
    var mc_t271 = 0;
    var mc_t270 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t159 = 0;
    var mc_t14 = 0;
    var mc_t158 = 0;
    var mc_t279 = 0;
    var mc_t15 = 0;
    var mc_t157 = 0;
    var mc_t278 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var mc_t280 = 0;
    var mc_t145 = 0;
    var mc_t266 = 0;
    var mc_t144 = 0;
    var mc_t265 = 0;
    var mc_t143 = 0;
    var mc_t264 = 0;
    var mc_t142 = 0;
    var mc_t263 = 0;
    var mc_t141 = 0;
    var mc_t262 = 0;
    var mc_t140 = 0;
    var mc_t261 = 0;
    var mc_t260 = 0;
    var mc_t149 = 0;
    var mc_t148 = 0;
    var mc_t269 = 0;
    var mc_t147 = 0;
    var mc_t268 = 0;
    var mc_t146 = 0;
    var mc_t267 = 0;
    var mc_t211 = 0;
    var mc_t210 = 0;
    var mc_t70 = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var mc_t74 = 0;
    var mc_t219 = 0;
    var mc_t75 = 0;
    var mc_t218 = 0;
    var mc_t76 = 0;
    var mc_t217 = 0;
    var mc_t77 = 0;
    var mc_t216 = 0;
    var mc_t78 = 0;
    var mc_t215 = 0;
    var mc_t79 = 0;
    var mc_t214 = 0;
    var mc_t213 = 0;
    var mc_t212 = 0;
    var mc_t9 = 0;
    var mc_t321 = 0;
    var mc_t320 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t60 = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t61 = 0;
    var mc_t4 = 0;
    var mc_t62 = 0;
    var mc_t1 = 0;
    var mc_t63 = 0;
    var mc_t208 = 0;
    var mc_t329 = 0;
    var mc_t2 = 0;
    var mc_t64 = 0;
    var mc_t207 = 0;
    var mc_t328 = 0;
    var mc_t65 = 0;
    var mc_t206 = 0;
    var mc_t327 = 0;
    var mc_t0 = 0;
    var mc_t66 = 0;
    var mc_t326 = 0;
    var mc_t67 = 0;
    var mc_t325 = 0;
    var mc_t68 = 0;
    var mc_t324 = 0;
    var mc_t69 = 0;
    var mc_t323 = 0;
    var mc_t322 = 0;
    var mc_t209 = 0;
    var mc_t310 = 0;
    var mc_t90 = 0;
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t94 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t318 = 0;
    var mc_t97 = 0;
    var mc_t317 = 0;
    var mc_t98 = 0;
    var mc_t316 = 0;
    var mc_t99 = 0;
    var mc_t315 = 0;
    var mc_t314 = 0;
    var mc_t313 = 0;
    var mc_t312 = 0;
    var mc_t311 = 0;
    var mc_t319 = 0;
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t307 = 0;
    var mc_t86 = 0;
    var mc_t306 = 0;
    var mc_t87 = 0;
    var mc_t305 = 0;
    var mc_t88 = 0;
    var mc_t304 = 0;
    var mc_t89 = 0;
    var mc_t303 = 0;
    var mc_t302 = 0;
    var mc_t301 = 0;
    var mc_t300 = 0;
    var mc_t309 = 0;
    var mc_t308 = 0;

    mc_t179 = 0;
    mc_t178 = scale > mc_t179;
    if (mc_t178) {
        mc_t206 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t206, 1, scale);
        wi.set_array_index_f64(mc_t206, 2, scale);
        A = wi.rand(mc_t206);
        mc_t52 = 1;
        mc_t207 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t207, 1, scale);
        wi.set_array_index_f64(mc_t207, 2, mc_t52);
        y = wi.rand(mc_t207);
        mc_t53 = 1;
        for (i = mc_t53; i<=scale; i = i+1) {
            z = babai_MM(A, y);
        }
        wi.disp_M(z)
    } else {
        mc_t54 = 2.2588000000000000000;
        mc_t0 = -mc_t54;
        mc_t55 = 1.3077000000000000000;
        mc_t1 = -mc_t55;
        mc_t56 = 0.43360000000000000000;
        mc_t2 = -mc_t56;
        mc_t57 = 1.3499000000000000000;
        mc_t3 = -mc_t57;
        mc_t58 = 0.063100000000000000000;
        mc_t4 = -mc_t58;
        mc_t59 = 0.20500000000000000000;
        mc_t5 = -mc_t59;
        mc_t60 = 0.12410000000000000000;
        mc_t6 = -mc_t60;
        mc_t61 = 1.2075000000000000000;
        mc_t7 = -mc_t61;
        mc_t62 = 0.30340000000000000000;
        mc_t8 = -mc_t62;
        mc_t63 = 0.78730000000000000000;
        mc_t9 = -mc_t63;
        mc_t64 = 1.1471000000000000000;
        mc_t10 = -mc_t64;
        mc_t65 = 1.0689000000000000000;
        mc_t11 = -mc_t65;
        mc_t66 = 0.80950000000000000000;
        mc_t12 = -mc_t66;
        mc_t67 = 2.9443000000000000000;
        mc_t13 = -mc_t67;
        mc_t68 = 0.75490000000000000000;
        mc_t14 = -mc_t68;
        mc_t69 = 1.7115000000000000000;
        mc_t15 = -mc_t69;
        mc_t70 = 0.10220000000000000000;
        mc_t16 = -mc_t70;
        mc_t71 = 0.24140000000000000000;
        mc_t17 = -mc_t71;
        mc_t72 = 0.86490000000000000000;
        mc_t18 = -mc_t72;
        mc_t73 = 0.030100000000000000000;
        mc_t19 = -mc_t73;
        mc_t74 = 0.16490000000000000000;
        mc_t20 = -mc_t74;
        mc_t75 = 0.86370000000000000000;
        mc_t21 = -mc_t75;
        mc_t76 = 1.2141000000000000000;
        mc_t22 = -mc_t76;
        mc_t77 = 1.1135000000000000000;
        mc_t23 = -mc_t77;
        mc_t78 = 0.0068000000000000000000;
        mc_t24 = -mc_t78;
        mc_t79 = 0.76970000000000000000;
        mc_t25 = -mc_t79;
        mc_t80 = 0.22560000000000000000;
        mc_t26 = -mc_t80;
        mc_t81 = 1.0891000000000000000;
        mc_t27 = -mc_t81;
        mc_t82 = 1.4916000000000000000;
        mc_t28 = -mc_t82;
        mc_t83 = 0.74230000000000000000;
        mc_t29 = -mc_t83;
        mc_t84 = 1.0616000000000000000;
        mc_t30 = -mc_t84;
        mc_t85 = 0.61560000000000000000;
        mc_t31 = -mc_t85;
        mc_t86 = 0.19240000000000000000;
        mc_t32 = -mc_t86;
        mc_t87 = 0.76480000000000000000;
        mc_t33 = -mc_t87;
        mc_t88 = 1.4023000000000000000;
        mc_t34 = -mc_t88;
        mc_t89 = 1.4224000000000000000;
        mc_t35 = -mc_t89;
        mc_t90 = 0.17740000000000000000;
        mc_t36 = -mc_t90;
        mc_t91 = 0.19610000000000000000;
        mc_t37 = -mc_t91;
        mc_t92 = 0.80450000000000000000;
        mc_t38 = -mc_t92;
        mc_t93 = 0.24370000000000000000;
        mc_t39 = -mc_t93;
        mc_t94 = 1.1658000000000000000;
        mc_t40 = -mc_t94;
        mc_t95 = 1.1480000000000000000;
        mc_t41 = -mc_t95;
        mc_t96 = 0.66690000000000000000;
        mc_t42 = -mc_t96;
        mc_t97 = 0.082500000000000000000;
        mc_t43 = -mc_t97;
        mc_t98 = 1.9330000000000000000;
        mc_t44 = -mc_t98;
        mc_t99 = 0.43900000000000000000;
        mc_t45 = -mc_t99;
        mc_t100 = 1.7947000000000000000;
        mc_t46 = -mc_t100;
        mc_t102 = 0.53770000000000000000;
        mc_t103 = 1.8339000000000000000;
        mc_t104 = 0.86220000000000000000;
        mc_t105 = 0.31880000000000000000;
        mc_t106 = 0.34260000000000000000;
        mc_t107 = 3.5784000000000000000;
        mc_t108 = 2.7694000000000000000;
        mc_t208 = wi.create_mxvector(10, 5);
        mc_t209 = wi.convert_scalar_to_mxarray(mc_t102);
        wi.set_array_index_i32(mc_t208, 1, mc_t209);
        mc_t210 = wi.convert_scalar_to_mxarray(mc_t103);
        wi.set_array_index_i32(mc_t208, 2, mc_t210);
        mc_t211 = wi.convert_scalar_to_mxarray(mc_t0);
        wi.set_array_index_i32(mc_t208, 3, mc_t211);
        mc_t212 = wi.convert_scalar_to_mxarray(mc_t104);
        wi.set_array_index_i32(mc_t208, 4, mc_t212);
        mc_t213 = wi.convert_scalar_to_mxarray(mc_t105);
        wi.set_array_index_i32(mc_t208, 5, mc_t213);
        mc_t214 = wi.convert_scalar_to_mxarray(mc_t1);
        wi.set_array_index_i32(mc_t208, 6, mc_t214);
        mc_t215 = wi.convert_scalar_to_mxarray(mc_t2);
        wi.set_array_index_i32(mc_t208, 7, mc_t215);
        mc_t216 = wi.convert_scalar_to_mxarray(mc_t106);
        wi.set_array_index_i32(mc_t208, 8, mc_t216);
        mc_t217 = wi.convert_scalar_to_mxarray(mc_t107);
        wi.set_array_index_i32(mc_t208, 9, mc_t217);
        mc_t218 = wi.convert_scalar_to_mxarray(mc_t108);
        wi.set_array_index_i32(mc_t208, 10, mc_t218);
        mc_t101 = wi.horzcat(mc_t208);
        mc_t110 = 3.0349000000000000000;
        mc_t111 = 0.72540000000000000000;
        mc_t112 = 0.71470000000000000000;
        mc_t113 = 1.4897000000000000000;
        mc_t114 = 1.4090000000000000000;
        mc_t115 = 1.4172000000000000000;
        mc_t219 = wi.create_mxvector(10, 5);
        mc_t220 = wi.convert_scalar_to_mxarray(mc_t3);
        wi.set_array_index_i32(mc_t219, 1, mc_t220);
        mc_t221 = wi.convert_scalar_to_mxarray(mc_t110);
        wi.set_array_index_i32(mc_t219, 2, mc_t221);
        mc_t222 = wi.convert_scalar_to_mxarray(mc_t111);
        wi.set_array_index_i32(mc_t219, 3, mc_t222);
        mc_t223 = wi.convert_scalar_to_mxarray(mc_t4);
        wi.set_array_index_i32(mc_t219, 4, mc_t223);
        mc_t224 = wi.convert_scalar_to_mxarray(mc_t112);
        wi.set_array_index_i32(mc_t219, 5, mc_t224);
        mc_t225 = wi.convert_scalar_to_mxarray(mc_t5);
        wi.set_array_index_i32(mc_t219, 6, mc_t225);
        mc_t226 = wi.convert_scalar_to_mxarray(mc_t6);
        wi.set_array_index_i32(mc_t219, 7, mc_t226);
        mc_t227 = wi.convert_scalar_to_mxarray(mc_t113);
        wi.set_array_index_i32(mc_t219, 8, mc_t227);
        mc_t228 = wi.convert_scalar_to_mxarray(mc_t114);
        wi.set_array_index_i32(mc_t219, 9, mc_t228);
        mc_t229 = wi.convert_scalar_to_mxarray(mc_t115);
        wi.set_array_index_i32(mc_t219, 10, mc_t229);
        mc_t109 = wi.horzcat(mc_t219);
        mc_t117 = 0.67150000000000000000;
        mc_t118 = 0.71720000000000000000;
        mc_t119 = 1.6302000000000000000;
        mc_t120 = 0.48890000000000000000;
        mc_t121 = 1.0347000000000000000;
        mc_t122 = 0.72690000000000000000;
        mc_t123 = 0.29390000000000000000;
        mc_t230 = wi.create_mxvector(10, 5);
        mc_t231 = wi.convert_scalar_to_mxarray(mc_t117);
        wi.set_array_index_i32(mc_t230, 1, mc_t231);
        mc_t232 = wi.convert_scalar_to_mxarray(mc_t7);
        wi.set_array_index_i32(mc_t230, 2, mc_t232);
        mc_t233 = wi.convert_scalar_to_mxarray(mc_t118);
        wi.set_array_index_i32(mc_t230, 3, mc_t233);
        mc_t234 = wi.convert_scalar_to_mxarray(mc_t119);
        wi.set_array_index_i32(mc_t230, 4, mc_t234);
        mc_t235 = wi.convert_scalar_to_mxarray(mc_t120);
        wi.set_array_index_i32(mc_t230, 5, mc_t235);
        mc_t236 = wi.convert_scalar_to_mxarray(mc_t121);
        wi.set_array_index_i32(mc_t230, 6, mc_t236);
        mc_t237 = wi.convert_scalar_to_mxarray(mc_t122);
        wi.set_array_index_i32(mc_t230, 7, mc_t237);
        mc_t238 = wi.convert_scalar_to_mxarray(mc_t8);
        wi.set_array_index_i32(mc_t230, 8, mc_t238);
        mc_t239 = wi.convert_scalar_to_mxarray(mc_t123);
        wi.set_array_index_i32(mc_t230, 9, mc_t239);
        mc_t240 = wi.convert_scalar_to_mxarray(mc_t9);
        wi.set_array_index_i32(mc_t230, 10, mc_t240);
        mc_t116 = wi.horzcat(mc_t230);
        mc_t125 = 0.88840000000000000000;
        mc_t126 = 1.4384000000000000000;
        mc_t127 = 0.32520000000000000000;
        mc_t128 = 1.3703000000000000000;
        mc_t241 = wi.create_mxvector(10, 5);
        mc_t242 = wi.convert_scalar_to_mxarray(mc_t125);
        wi.set_array_index_i32(mc_t241, 1, mc_t242);
        mc_t243 = wi.convert_scalar_to_mxarray(mc_t10);
        wi.set_array_index_i32(mc_t241, 2, mc_t243);
        mc_t244 = wi.convert_scalar_to_mxarray(mc_t11);
        wi.set_array_index_i32(mc_t241, 3, mc_t244);
        mc_t245 = wi.convert_scalar_to_mxarray(mc_t12);
        wi.set_array_index_i32(mc_t241, 4, mc_t245);
        mc_t246 = wi.convert_scalar_to_mxarray(mc_t13);
        wi.set_array_index_i32(mc_t241, 5, mc_t246);
        mc_t247 = wi.convert_scalar_to_mxarray(mc_t126);
        wi.set_array_index_i32(mc_t241, 6, mc_t247);
        mc_t248 = wi.convert_scalar_to_mxarray(mc_t127);
        wi.set_array_index_i32(mc_t241, 7, mc_t248);
        mc_t249 = wi.convert_scalar_to_mxarray(mc_t14);
        wi.set_array_index_i32(mc_t241, 8, mc_t249);
        mc_t250 = wi.convert_scalar_to_mxarray(mc_t128);
        wi.set_array_index_i32(mc_t241, 9, mc_t250);
        mc_t251 = wi.convert_scalar_to_mxarray(mc_t15);
        wi.set_array_index_i32(mc_t241, 10, mc_t251);
        mc_t124 = wi.horzcat(mc_t241);
        mc_t130 = 0.31920000000000000000;
        mc_t131 = 0.31290000000000000000;
        mc_t132 = 0.62770000000000000000;
        mc_t133 = 1.0933000000000000000;
        mc_t134 = 1.1093000000000000000;
        mc_t252 = wi.create_mxvector(10, 5);
        mc_t253 = wi.convert_scalar_to_mxarray(mc_t16);
        wi.set_array_index_i32(mc_t252, 1, mc_t253);
        mc_t254 = wi.convert_scalar_to_mxarray(mc_t17);
        wi.set_array_index_i32(mc_t252, 2, mc_t254);
        mc_t255 = wi.convert_scalar_to_mxarray(mc_t130);
        wi.set_array_index_i32(mc_t252, 3, mc_t255);
        mc_t256 = wi.convert_scalar_to_mxarray(mc_t131);
        wi.set_array_index_i32(mc_t252, 4, mc_t256);
        mc_t257 = wi.convert_scalar_to_mxarray(mc_t18);
        wi.set_array_index_i32(mc_t252, 5, mc_t257);
        mc_t258 = wi.convert_scalar_to_mxarray(mc_t19);
        wi.set_array_index_i32(mc_t252, 6, mc_t258);
        mc_t259 = wi.convert_scalar_to_mxarray(mc_t20);
        wi.set_array_index_i32(mc_t252, 7, mc_t259);
        mc_t260 = wi.convert_scalar_to_mxarray(mc_t132);
        wi.set_array_index_i32(mc_t252, 8, mc_t260);
        mc_t261 = wi.convert_scalar_to_mxarray(mc_t133);
        wi.set_array_index_i32(mc_t252, 9, mc_t261);
        mc_t262 = wi.convert_scalar_to_mxarray(mc_t134);
        wi.set_array_index_i32(mc_t252, 10, mc_t262);
        mc_t129 = wi.horzcat(mc_t252);
        mc_t136 = 0.077400000000000000000;
        mc_t137 = 1.5326000000000000000;
        mc_t138 = 0.37140000000000000000;
        mc_t139 = 1.1174000000000000000;
        mc_t263 = wi.create_mxvector(10, 5);
        mc_t264 = wi.convert_scalar_to_mxarray(mc_t21);
        wi.set_array_index_i32(mc_t263, 1, mc_t264);
        mc_t265 = wi.convert_scalar_to_mxarray(mc_t136);
        wi.set_array_index_i32(mc_t263, 2, mc_t265);
        mc_t266 = wi.convert_scalar_to_mxarray(mc_t22);
        wi.set_array_index_i32(mc_t263, 3, mc_t266);
        mc_t267 = wi.convert_scalar_to_mxarray(mc_t23);
        wi.set_array_index_i32(mc_t263, 4, mc_t267);
        mc_t268 = wi.convert_scalar_to_mxarray(mc_t24);
        wi.set_array_index_i32(mc_t263, 5, mc_t268);
        mc_t269 = wi.convert_scalar_to_mxarray(mc_t137);
        wi.set_array_index_i32(mc_t263, 6, mc_t269);
        mc_t270 = wi.convert_scalar_to_mxarray(mc_t25);
        wi.set_array_index_i32(mc_t263, 7, mc_t270);
        mc_t271 = wi.convert_scalar_to_mxarray(mc_t138);
        wi.set_array_index_i32(mc_t263, 8, mc_t271);
        mc_t272 = wi.convert_scalar_to_mxarray(mc_t26);
        wi.set_array_index_i32(mc_t263, 9, mc_t272);
        mc_t273 = wi.convert_scalar_to_mxarray(mc_t139);
        wi.set_array_index_i32(mc_t263, 10, mc_t273);
        mc_t135 = wi.horzcat(mc_t263);
        mc_t141 = 0.032600000000000000000;
        mc_t142 = 0.55250000000000000000;
        mc_t143 = 1.1006000000000000000;
        mc_t144 = 1.5442000000000000000;
        mc_t145 = 0.085900000000000000000;
        mc_t146 = 2.3505000000000000000;
        mc_t274 = wi.create_mxvector(10, 5);
        mc_t275 = wi.convert_scalar_to_mxarray(mc_t27);
        wi.set_array_index_i32(mc_t274, 1, mc_t275);
        mc_t276 = wi.convert_scalar_to_mxarray(mc_t141);
        wi.set_array_index_i32(mc_t274, 2, mc_t276);
        mc_t277 = wi.convert_scalar_to_mxarray(mc_t142);
        wi.set_array_index_i32(mc_t274, 3, mc_t277);
        mc_t278 = wi.convert_scalar_to_mxarray(mc_t143);
        wi.set_array_index_i32(mc_t274, 4, mc_t278);
        mc_t279 = wi.convert_scalar_to_mxarray(mc_t144);
        wi.set_array_index_i32(mc_t274, 5, mc_t279);
        mc_t280 = wi.convert_scalar_to_mxarray(mc_t145);
        wi.set_array_index_i32(mc_t274, 6, mc_t280);
        mc_t281 = wi.convert_scalar_to_mxarray(mc_t28);
        wi.set_array_index_i32(mc_t274, 7, mc_t281);
        mc_t282 = wi.convert_scalar_to_mxarray(mc_t29);
        wi.set_array_index_i32(mc_t274, 8, mc_t282);
        mc_t283 = wi.convert_scalar_to_mxarray(mc_t30);
        wi.set_array_index_i32(mc_t274, 9, mc_t283);
        mc_t284 = wi.convert_scalar_to_mxarray(mc_t146);
        wi.set_array_index_i32(mc_t274, 10, mc_t284);
        mc_t140 = wi.horzcat(mc_t274);
        mc_t148 = 0.74810000000000000000;
        mc_t149 = 0.88860000000000000000;
        mc_t150 = 0.48820000000000000000;
        mc_t285 = wi.create_mxvector(10, 5);
        mc_t286 = wi.convert_scalar_to_mxarray(mc_t31);
        wi.set_array_index_i32(mc_t285, 1, mc_t286);
        mc_t287 = wi.convert_scalar_to_mxarray(mc_t148);
        wi.set_array_index_i32(mc_t285, 2, mc_t287);
        mc_t288 = wi.convert_scalar_to_mxarray(mc_t32);
        wi.set_array_index_i32(mc_t285, 3, mc_t288);
        mc_t289 = wi.convert_scalar_to_mxarray(mc_t149);
        wi.set_array_index_i32(mc_t285, 4, mc_t289);
        mc_t290 = wi.convert_scalar_to_mxarray(mc_t33);
        wi.set_array_index_i32(mc_t285, 5, mc_t290);
        mc_t291 = wi.convert_scalar_to_mxarray(mc_t34);
        wi.set_array_index_i32(mc_t285, 6, mc_t291);
        mc_t292 = wi.convert_scalar_to_mxarray(mc_t35);
        wi.set_array_index_i32(mc_t285, 7, mc_t292);
        mc_t293 = wi.convert_scalar_to_mxarray(mc_t150);
        wi.set_array_index_i32(mc_t285, 8, mc_t293);
        mc_t294 = wi.convert_scalar_to_mxarray(mc_t36);
        wi.set_array_index_i32(mc_t285, 9, mc_t294);
        mc_t295 = wi.convert_scalar_to_mxarray(mc_t37);
        wi.set_array_index_i32(mc_t285, 10, mc_t295);
        mc_t147 = wi.horzcat(mc_t285);
        mc_t152 = 1.4193000000000000000;
        mc_t153 = 0.29160000000000000000;
        mc_t154 = 0.19780000000000000000;
        mc_t155 = 1.5877000000000000000;
        mc_t156 = 0.69660000000000000000;
        mc_t157 = 0.83510000000000000000;
        mc_t158 = 0.21570000000000000000;
        mc_t296 = wi.create_mxvector(10, 5);
        mc_t297 = wi.convert_scalar_to_mxarray(mc_t152);
        wi.set_array_index_i32(mc_t296, 1, mc_t297);
        mc_t298 = wi.convert_scalar_to_mxarray(mc_t153);
        wi.set_array_index_i32(mc_t296, 2, mc_t298);
        mc_t299 = wi.convert_scalar_to_mxarray(mc_t154);
        wi.set_array_index_i32(mc_t296, 3, mc_t299);
        mc_t300 = wi.convert_scalar_to_mxarray(mc_t155);
        wi.set_array_index_i32(mc_t296, 4, mc_t300);
        mc_t301 = wi.convert_scalar_to_mxarray(mc_t38);
        wi.set_array_index_i32(mc_t296, 5, mc_t301);
        mc_t302 = wi.convert_scalar_to_mxarray(mc_t156);
        wi.set_array_index_i32(mc_t296, 6, mc_t302);
        mc_t303 = wi.convert_scalar_to_mxarray(mc_t157);
        wi.set_array_index_i32(mc_t296, 7, mc_t303);
        mc_t304 = wi.convert_scalar_to_mxarray(mc_t39);
        wi.set_array_index_i32(mc_t296, 8, mc_t304);
        mc_t305 = wi.convert_scalar_to_mxarray(mc_t158);
        wi.set_array_index_i32(mc_t296, 9, mc_t305);
        mc_t306 = wi.convert_scalar_to_mxarray(mc_t40);
        wi.set_array_index_i32(mc_t296, 10, mc_t306);
        mc_t151 = wi.horzcat(mc_t296);
        mc_t160 = 0.10490000000000000000;
        mc_t161 = 0.72230000000000000000;
        mc_t162 = 2.5855000000000000000;
        mc_t163 = 0.18730000000000000000;
        mc_t307 = wi.create_mxvector(10, 5);
        mc_t308 = wi.convert_scalar_to_mxarray(mc_t41);
        wi.set_array_index_i32(mc_t307, 1, mc_t308);
        mc_t309 = wi.convert_scalar_to_mxarray(mc_t160);
        wi.set_array_index_i32(mc_t307, 2, mc_t309);
        mc_t310 = wi.convert_scalar_to_mxarray(mc_t161);
        wi.set_array_index_i32(mc_t307, 3, mc_t310);
        mc_t311 = wi.convert_scalar_to_mxarray(mc_t162);
        wi.set_array_index_i32(mc_t307, 4, mc_t311);
        mc_t312 = wi.convert_scalar_to_mxarray(mc_t42);
        wi.set_array_index_i32(mc_t307, 5, mc_t312);
        mc_t313 = wi.convert_scalar_to_mxarray(mc_t163);
        wi.set_array_index_i32(mc_t307, 6, mc_t313);
        mc_t314 = wi.convert_scalar_to_mxarray(mc_t43);
        wi.set_array_index_i32(mc_t307, 7, mc_t314);
        mc_t315 = wi.convert_scalar_to_mxarray(mc_t44);
        wi.set_array_index_i32(mc_t307, 8, mc_t315);
        mc_t316 = wi.convert_scalar_to_mxarray(mc_t45);
        wi.set_array_index_i32(mc_t307, 9, mc_t316);
        mc_t317 = wi.convert_scalar_to_mxarray(mc_t46);
        wi.set_array_index_i32(mc_t307, 10, mc_t317);
        mc_t159 = wi.horzcat(mc_t307);
        mc_t318 = wi.create_mxvector(10, 5);
        wi.set_array_index_i32(mc_t318, 1, mc_t101);
        wi.set_array_index_i32(mc_t318, 2, mc_t109);
        wi.set_array_index_i32(mc_t318, 3, mc_t116);
        wi.set_array_index_i32(mc_t318, 4, mc_t124);
        wi.set_array_index_i32(mc_t318, 5, mc_t129);
        wi.set_array_index_i32(mc_t318, 6, mc_t135);
        wi.set_array_index_i32(mc_t318, 7, mc_t140);
        wi.set_array_index_i32(mc_t318, 8, mc_t147);
        wi.set_array_index_i32(mc_t318, 9, mc_t151);
        wi.set_array_index_i32(mc_t318, 10, mc_t159);
        A = wi.vertcat(mc_t318);
        mc_t164 = 0.88800000000000000000;
        mc_t47 = -mc_t164;
        mc_t165 = 0.54450000000000000000;
        mc_t48 = -mc_t165;
        mc_t166 = 0.60030000000000000000;
        mc_t49 = -mc_t166;
        mc_t167 = 0.19410000000000000000;
        mc_t50 = -mc_t167;
        mc_t169 = 0.84040000000000000000;
        mc_t170 = 0.10010000000000000000;
        mc_t171 = 0.30350000000000000000;
        mc_t172 = 0.49000000000000000000;
        mc_t173 = 0.73940000000000000000;
        mc_t174 = 1.7119000000000000000;
        mc_t319 = wi.create_mxvector(10, 5);
        mc_t320 = wi.convert_scalar_to_mxarray(mc_t169);
        wi.set_array_index_i32(mc_t319, 1, mc_t320);
        mc_t321 = wi.convert_scalar_to_mxarray(mc_t47);
        wi.set_array_index_i32(mc_t319, 2, mc_t321);
        mc_t322 = wi.convert_scalar_to_mxarray(mc_t170);
        wi.set_array_index_i32(mc_t319, 3, mc_t322);
        mc_t323 = wi.convert_scalar_to_mxarray(mc_t48);
        wi.set_array_index_i32(mc_t319, 4, mc_t323);
        mc_t324 = wi.convert_scalar_to_mxarray(mc_t171);
        wi.set_array_index_i32(mc_t319, 5, mc_t324);
        mc_t325 = wi.convert_scalar_to_mxarray(mc_t49);
        wi.set_array_index_i32(mc_t319, 6, mc_t325);
        mc_t326 = wi.convert_scalar_to_mxarray(mc_t172);
        wi.set_array_index_i32(mc_t319, 7, mc_t326);
        mc_t327 = wi.convert_scalar_to_mxarray(mc_t173);
        wi.set_array_index_i32(mc_t319, 8, mc_t327);
        mc_t328 = wi.convert_scalar_to_mxarray(mc_t174);
        wi.set_array_index_i32(mc_t319, 9, mc_t328);
        mc_t329 = wi.convert_scalar_to_mxarray(mc_t50);
        wi.set_array_index_i32(mc_t319, 10, mc_t329);
        y = wi.horzcat(mc_t319);
        z = babai_MM(A, y);
        mc_t176 = 1;
        mc_t177 = 10;
        for (i = mc_t176; i<=mc_t177; i = i+1) {
            mc_t51 = wi.get_array_index_f64(z, i);
            wi.disp_S(mc_t51);
        }
    }
    return;
}

function babai_MM(R, y){
    var mc_t332 = 0;
    var mc_t199 = 0;
    var mc_t331 = 0;
    var mc_t198 = 0;
    var mc_t330 = 0;
    var mc_t197 = 0;
    var mc_t196 = 0;
    var mc_t195 = 0;
    var mc_t194 = 0;
    var mc_t193 = 0;
    var mc_t339 = 0;
    var mc_t338 = 0;
    var mc_t337 = 0;
    var mc_t336 = 0;
    var mc_t335 = 0;
    var mc_t334 = 0;
    var mc_t333 = 0;
    var mc_t181 = 0;
    var mc_t180 = 0;
    var mc_t200 = 0;
    var mc_t189 = 0;
    var par = 0;
    var mc_t343 = 0;
    var mc_t188 = 0;
    var mc_t342 = 0;
    var mc_t187 = 0;
    var mc_t341 = 0;
    var mc_t186 = 0;
    var mc_t340 = 0;
    var mc_t185 = 0;
    var mc_t184 = 0;
    var mc_t183 = 0;
    var mc_t182 = 0;
    var ck = 0;
    var mc_t205 = 0;
    var k = 0;
    var mc_t204 = 0;
    var mc_t203 = 0;
    var n = 0;
    var mc_t202 = 0;
    var mc_t345 = 0;
    var mc_t201 = 0;
    var mc_t344 = 0;
    var z_hat = 0;
    var mc_t192 = 0;
    var mc_t191 = 0;
    var mc_t190 = 0;







    n = wi.length_M(y);
    mc_t200 = 1;
    mc_t330 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t330, 1, n);
    wi.set_array_index_f64(mc_t330, 2, mc_t200);
    z_hat = wi.zeros(mc_t330);
    mc_t183 = wi.get_array_index_f64(y, n);
    mc_t331 = wi.create_mxvector(1, 5);
    mc_t332 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t332, 1, n);
    wi.set_array_index_f64(mc_t332, 2, n);
    wi.set_array_index_i32(mc_t331, 1, mc_t332);
    mc_t333 = wi.get_f64(R, mc_t331);
    mc_t184 = wi.get_array_index_f64(mc_t333, 1);
    mc_t182 = mc_t183 / mc_t184;
    mc_t180 = wi.round_S(mc_t182);
    wi.set_array_index_f64(z_hat, n, mc_t180);

    mc_t201 = 1;
    mc_t198 = n - mc_t201;
    mc_t202 = 1;
    mc_t199 = -mc_t202;
    mc_t205 = 1;
    for (k = mc_t198; k>=mc_t205; k = k+mc_t199) {
        mc_t190 = k;
        mc_t203 = 1;
        mc_t192 = k + mc_t203;
        mc_t193 = n;
        mc_t334 = wi.create_mxvector(2, 5);
        mc_t335 = wi.convert_scalar_to_mxarray(mc_t192);
        wi.set_array_index_i32(mc_t334, 1, mc_t335);
        mc_t336 = wi.convert_scalar_to_mxarray(mc_t193);
        wi.set_array_index_i32(mc_t334, 2, mc_t336);
        mc_t191 = wi.colon(mc_t334);
        mc_t337 = wi.create_mxvector(2, 5);
        mc_t338 = wi.convert_scalar_to_mxarray(mc_t190);
        wi.set_array_index_i32(mc_t337, 1, mc_t338);
        wi.set_array_index_i32(mc_t337, 2, mc_t191);
        mc_t185 = wi.get_f64(R, mc_t337);
        mc_t204 = 1;
        mc_t188 = k + mc_t204;
        mc_t189 = n;
        mc_t339 = wi.create_mxvector(2, 5);
        mc_t340 = wi.convert_scalar_to_mxarray(mc_t188);
        wi.set_array_index_i32(mc_t339, 1, mc_t340);
        mc_t341 = wi.convert_scalar_to_mxarray(mc_t189);
        wi.set_array_index_i32(mc_t339, 2, mc_t341);
        mc_t187 = wi.colon(mc_t339);
        mc_t342 = wi.create_mxvector(1, 5);
        wi.set_array_index_i32(mc_t342, 1, mc_t187);
        mc_t186 = wi.get_f64(z_hat, mc_t342);
        par = wi.mtimes_MM(mc_t185, mc_t186);
        par = wi.get_array_index_f64(par, 1);
        mc_t196 = wi.get_array_index_f64(y, k);
        mc_t197 = par;
        mc_t194 = mc_t196 - mc_t197;
        mc_t343 = wi.create_mxvector(1, 5);
        mc_t344 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t344, 1, k);
        wi.set_array_index_f64(mc_t344, 2, k);
        wi.set_array_index_i32(mc_t343, 1, mc_t344);
        mc_t345 = wi.get_f64(R, mc_t343);
        mc_t195 = wi.get_array_index_f64(mc_t345, 1);
        ck = mc_t194 / mc_t195;
        mc_t181 = wi.round_S(ck);
        wi.set_array_index_f64(z_hat, k, mc_t181);
    }

    return z_hat;
}
drv_babai_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
