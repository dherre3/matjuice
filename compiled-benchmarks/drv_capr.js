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

function gauss_SSSM(n, m, h, f){
    var jj = 0;
    var mc_t70 = 0;
    var mc_t196 = 0;
    var mc_t71 = 0;
    var mc_t195 = 0;
    var mc_t72 = 0;
    var mc_t194 = 0;
    var mc_t73 = 0;
    var mc_t193 = 0;
    var mc_t74 = 0;
    var mc_t75 = 0;
    var mc_t76 = 0;
    var mc_t77 = 0;
    var mc_t78 = 0;
    var mc_t79 = 0;
    var cap = 0;
    var ii = 0;
    var mc_t189 = 0;
    var mc_t188 = 0;
    var mc_t187 = 0;
    var mc_t80 = 0;
    var mc_t186 = 0;
    var mc_t81 = 0;
    var mc_t185 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t86 = 0;
    var mc_t65 = 0;
    var mc_t66 = 0;
    var mc_t67 = 0;
    var mc_t68 = 0;
    var mc_t69 = 0;
    var q = 0;
    var mc_t192 = 0;
    var mc_t191 = 0;
    var mc_t190 = 0;
































    q = 0;
    mc_t81 = 1;
    for (ii = mc_t81; ii<=n; ii = ii+1) {
        mc_t65 = q;
        mc_t185 = wi.create_mxvector(1, 5);
        mc_t186 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t186, 1, ii);
        wi.set_array_index_f64(mc_t186, 2, m);
        wi.set_array_index_i32(mc_t185, 1, mc_t186);
        mc_t187 = wi.get_f64(f, mc_t185);
        mc_t68 = wi.get_array_index_f64(mc_t187, 1);
        mc_t79 = 1;
        mc_t70 = ii + mc_t79;
        mc_t71 = m;
        mc_t188 = wi.create_mxvector(1, 5);
        mc_t189 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t189, 1, mc_t70);
        wi.set_array_index_f64(mc_t189, 2, mc_t71);
        wi.set_array_index_i32(mc_t188, 1, mc_t189);
        mc_t190 = wi.get_f64(f, mc_t188);
        mc_t69 = wi.get_array_index_f64(mc_t190, 1);
        mc_t67 = mc_t68 + mc_t69;
        mc_t80 = 0.50000000000000000000;
        mc_t66 = mc_t67 * mc_t80;
        q = mc_t65 + mc_t66;
    }

    mc_t84 = 1;
    for (jj = mc_t84; jj<=m; jj = jj+1) {
        mc_t72 = q;
        mc_t191 = wi.create_mxvector(1, 5);
        mc_t192 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t192, 1, n);
        wi.set_array_index_f64(mc_t192, 2, jj);
        wi.set_array_index_i32(mc_t191, 1, mc_t192);
        mc_t193 = wi.get_f64(f, mc_t191);
        mc_t75 = wi.get_array_index_f64(mc_t193, 1);
        mc_t77 = n;
        mc_t82 = 1;
        mc_t78 = jj + mc_t82;
        mc_t194 = wi.create_mxvector(1, 5);
        mc_t195 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t195, 1, mc_t77);
        wi.set_array_index_f64(mc_t195, 2, mc_t78);
        wi.set_array_index_i32(mc_t194, 1, mc_t195);
        mc_t196 = wi.get_f64(f, mc_t194);
        mc_t76 = wi.get_array_index_f64(mc_t196, 1);
        mc_t74 = mc_t75 + mc_t76;
        mc_t83 = 0.50000000000000000000;
        mc_t73 = mc_t74 * mc_t83;
        q = mc_t72 + mc_t73;
    }

    mc_t85 = 4;
    cap = q * mc_t85;

    mc_t86 = 8.8541870000000000000;
    cap = cap * mc_t86;



    return cap;
}

function capacitor_SSSSSSS(a, b, c, d, n, tol, rel){
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
    var mb = 0;
    var ii = 0;
    var mc_t200 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t20 = 0;
    var mc_t64 = 0;
    var iter = 0;
    var mc_t21 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t204 = 0;
    var mc_t24 = 0;
    var mc_t203 = 0;
    var mc_t25 = 0;
    var mc_t202 = 0;
    var mc_t26 = 0;
    var mc_t201 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var na = 0;
    var jj = 0;
    var oldcap = 0;
    var mc_t199 = 0;
    var mc_t198 = 0;
    var mc_t197 = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t54 = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var mc_t57 = 0;
    var mc_t58 = 0;
    var mc_t14 = 0;
    var mc_t59 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var cap = 0;
    var mask = 0;
    var f = 0;
    var mc_t40 = 0;
    var h = 0;
    var mc_t41 = 0;
    var mc_t42 = 0;
    var mc_t43 = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var m = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var x = 0;
    var y = 0;








































    mc_t42 = 0.50000000000000000000;
    mc_t16 = mc_t42 * c;
    mc_t17 = n;
    h = mc_t16 / mc_t17;


    mc_t43 = 0.50000000000000000000;
    mc_t19 = mc_t43 * a;
    mc_t20 = h;
    mc_t18 = mc_t19 / mc_t20;
    na = wi.round_S(mc_t18);
    mc_t44 = 0.50000000000000000000;
    mc_t21 = mc_t44 * c;
    mc_t45 = 1;
    mc_t22 = n + mc_t45;
    mc_t46 = 0;
    x = linspace_SSS(mc_t46, mc_t21, mc_t22);
    mc_t47 = 0.50000000000000000000;
    mc_t24 = mc_t47 * d;
    mc_t25 = h;
    mc_t23 = mc_t24 / mc_t25;
    m = wi.round_S(mc_t23);
    mc_t48 = 0.50000000000000000000;
    mc_t27 = mc_t48 * b;
    mc_t28 = h;
    mc_t26 = mc_t27 / mc_t28;
    mb = wi.round_S(mc_t26);
    mc_t49 = 0.50000000000000000000;
    mc_t29 = mc_t49 * d;
    mc_t50 = 1;
    mc_t30 = m + mc_t50;
    mc_t51 = 0;
    y = linspace_SSS(mc_t51, mc_t29, mc_t30);


    mc_t52 = 1;
    mc_t31 = n + mc_t52;
    mc_t53 = 1;
    mc_t32 = m + mc_t53;
    mc_t197 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t197, 1, mc_t31);
    wi.set_array_index_f64(mc_t197, 2, mc_t32);
    f = wi.zeros(mc_t197);
    mc_t54 = 1;
    mc_t35 = n + mc_t54;
    mc_t55 = 1;
    mc_t36 = m + mc_t55;
    mc_t198 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t198, 1, mc_t35);
    wi.set_array_index_f64(mc_t198, 2, mc_t36);
    mc_t33 = wi.ones(mc_t198);
    mc_t34 = rel;
    mask = wi.mtimes_MS(mc_t33, mc_t34);

    mc_t56 = 1;
    mc_t38 = na + mc_t56;
    mc_t61 = 1;
    for (ii = mc_t61; ii<=mc_t38; ii = ii+1) {
        mc_t57 = 1;
        mc_t37 = mb + mc_t57;
        mc_t60 = 1;
        for (jj = mc_t60; jj<=mc_t37; jj = jj+1) {
            mc_t58 = 0;
            mc_t199 = wi.create_mxvector(1, 5);
            mc_t200 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t200, 1, jj);
            mc_t200 = wi.set_array_index_i32(mc_t199, 1, mc_t200);
            mc_t201 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t201, mc_t58);
            wi.set_f64(mask, mc_t200, mc_t201);
            mc_t59 = 1;
            mc_t202 = wi.create_mxvector(1, 5);
            mc_t203 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t203, 1, jj);
            mc_t203 = wi.set_array_index_i32(mc_t202, 1, mc_t203);
            mc_t204 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t204, mc_t59);
            wi.set_f64(f, mc_t203, mc_t204);
        }
    }

    oldcap = 0;
    mc_t63 = 1;
    mc_t64 = 1000;
    for (iter = mc_t63; iter<=mc_t64; iter = iter+1) {
        f = seidel_MMSSSS(f, mask, n, m, na, mb);
        cap = gauss_SSSM(n, m, h, f);
        cap = wi.get_array_index_f64(cap, 1);
        mc_t41 = cap - oldcap;
        mc_t39 = wi.abs_S(mc_t41);
        mc_t40 = cap;
        mc_t14 = mc_t39 / mc_t40;
        mc_t62 = mc_t14 < tol;
        if (mc_t62) {
            break;
        } else {
            oldcap = cap;
        }
    }

    return cap;
}

function linspace_SSS(d1, d2, n){
    var mc_t178 = 0;
    var mc_t177 = 0;
    var mc_t176 = 0;
    var mc_t175 = 0;
    var mc_t174 = 0;
    var mc_t173 = 0;
    var mc_t183 = 0;
    var mc_t172 = 0;
    var mc_t182 = 0;
    var mc_t208 = 0;
    var mc_t207 = 0;
    var mc_t206 = 0;
    var mc_t205 = 0;
    var mc_t179 = 0;
    var mc_t209 = 0;
    var mc_t181 = 0;
    var mc_t180 = 0;
    var y = 0;













    mc_t174 = d1;
    mc_t181 = 2;
    mc_t180 = n - mc_t181;
    mc_t182 = 0;
    mc_t205 = wi.create_mxvector(2, 5);
    mc_t206 = wi.convert_scalar_to_mxarray(mc_t182);
    wi.set_array_index_i32(mc_t205, 1, mc_t206);
    mc_t207 = wi.convert_scalar_to_mxarray(mc_t180);
    wi.set_array_index_i32(mc_t205, 2, mc_t207);
    mc_t178 = wi.colon(mc_t205);
    mc_t179 = d2 - d1;
    mc_t176 = wi.mtimes_MS(mc_t178, mc_t179);
    mc_t183 = 1;
    mc_t177 = n - mc_t183;
    mc_t175 = wi.mrdivide_MS(mc_t176, mc_t177);
    mc_t172 = wi.plus_SM(mc_t174, mc_t175);
    mc_t173 = d2;
    mc_t208 = wi.create_mxvector(2, 5);
    wi.set_array_index_i32(mc_t208, 1, mc_t172);
    mc_t209 = wi.convert_scalar_to_mxarray(mc_t173);
    wi.set_array_index_i32(mc_t208, 2, mc_t209);
    y = wi.horzcat(mc_t208);



    return y;
}

function drv_capr_S(scale){
    var mc_t9 = 0;
    var a = 0;
    var b = 0;
    var mc_t7 = 0;
    var c = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var d = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t0 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var n = 0;
    var tol = 0;
    var cap = 0;
    var rel = 0;
    var time = 0;




    mc_t2 = 0.32574630000000000000;
    mc_t3 = 2;
    a = mc_t2 * mc_t3;

    mc_t4 = 8.6500000000000000000;
    mc_t5 = 0.040390000000000000000;
    b = mc_t4 * mc_t5;
    mc_t6 = 3.2900000000000000000;
    mc_t7 = 0.55982000000000000000;
    c = mc_t6 * mc_t7;
    mc_t8 = 0.72756100000000000000;
    mc_t9 = 6.1710000000000000000;
    d = mc_t8 * mc_t9;

    mc_t10 = 56.098000000000000000;
    mc_t11 = 0.36000000000000000000;
    mc_t0 = mc_t10 * mc_t11;
    n = wi.floor_S(mc_t0);
    tol = 1.3000000000000000000e-13;

    rel = 0.90000000000000000000;


    mc_t12 = 10;
    mc_t1 = scale * mc_t12;
    mc_t13 = 1;
    for (time = mc_t13; time<=mc_t1; time = time+1) {
        cap = capacitor_SSSSSSS(a, b, c, d, n, tol, rel);
        cap = wi.get_array_index_f64(cap, 1);
    }

    return;
}

function seidel_MMSSSS(f, mask, n, m, na, mb){
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
    var mc_t139 = 0;
    var mc_t138 = 0;
    var mc_t259 = 0;
    var mc_t137 = 0;
    var mc_t258 = 0;
    var mc_t136 = 0;
    var mc_t257 = 0;
    var mc_t135 = 0;
    var mc_t256 = 0;
    var ii = 0;
    var mc_t123 = 0;
    var mc_t244 = 0;
    var mc_t122 = 0;
    var mc_t243 = 0;
    var mc_t121 = 0;
    var mc_t242 = 0;
    var mc_t120 = 0;
    var mc_t241 = 0;
    var mc_t240 = 0;
    var mc_t129 = 0;
    var mc_t128 = 0;
    var mc_t249 = 0;
    var mc_t127 = 0;
    var mc_t248 = 0;
    var mc_t126 = 0;
    var mc_t247 = 0;
    var mc_t125 = 0;
    var mc_t246 = 0;
    var mc_t124 = 0;
    var mc_t245 = 0;
    var jj = 0;
    var mc_t112 = 0;
    var mc_t233 = 0;
    var mc_t111 = 0;
    var mc_t232 = 0;
    var mc_t110 = 0;
    var mc_t231 = 0;
    var mc_t230 = 0;
    var mc_t119 = 0;
    var mc_t118 = 0;
    var mc_t239 = 0;
    var mc_t117 = 0;
    var mc_t238 = 0;
    var mc_t116 = 0;
    var mc_t237 = 0;
    var mc_t115 = 0;
    var mc_t236 = 0;
    var mc_t114 = 0;
    var mc_t235 = 0;
    var mc_t113 = 0;
    var mc_t234 = 0;
    var mc_t101 = 0;
    var mc_t222 = 0;
    var mc_t100 = 0;
    var mc_t221 = 0;
    var mc_t220 = 0;
    var mc_t109 = 0;
    var mc_t108 = 0;
    var mc_t229 = 0;
    var mc_t107 = 0;
    var mc_t228 = 0;
    var mc_t106 = 0;
    var mc_t227 = 0;
    var mc_t105 = 0;
    var mc_t226 = 0;
    var mc_t104 = 0;
    var mc_t225 = 0;
    var mc_t103 = 0;
    var mc_t224 = 0;
    var mc_t102 = 0;
    var mc_t223 = 0;
    var mc_t211 = 0;
    var mc_t210 = 0;
    var mc_t171 = 0;
    var mc_t219 = 0;
    var mc_t218 = 0;
    var mc_t217 = 0;
    var mc_t216 = 0;
    var mc_t215 = 0;
    var mc_t214 = 0;
    var mc_t213 = 0;
    var mc_t212 = 0;
    var mc_t167 = 0;
    var mc_t166 = 0;
    var mc_t165 = 0;
    var mc_t164 = 0;
    var mc_t163 = 0;
    var mc_t162 = 0;
    var mc_t161 = 0;
    var mc_t160 = 0;
    var mc_t281 = 0;
    var mc_t169 = 0;
    var mc_t168 = 0;
    var mc_t170 = 0;
    var mc_t156 = 0;
    var mc_t277 = 0;
    var mc_t155 = 0;
    var mc_t276 = 0;
    var mc_t90 = 0;
    var mc_t154 = 0;
    var mc_t275 = 0;
    var mc_t153 = 0;
    var mc_t91 = 0;
    var mc_t274 = 0;
    var mc_t92 = 0;
    var mc_t152 = 0;
    var mc_t273 = 0;
    var mc_t93 = 0;
    var mc_t151 = 0;
    var mc_t272 = 0;
    var mc_t94 = 0;
    var mc_t150 = 0;
    var mc_t271 = 0;
    var mc_t95 = 0;
    var mc_t270 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t98 = 0;
    var mc_t99 = 0;
    var mc_t159 = 0;
    var mc_t158 = 0;
    var mc_t279 = 0;
    var mc_t157 = 0;
    var mc_t278 = 0;
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
    var mc_t87 = 0;
    var mc_t88 = 0;
    var mc_t149 = 0;
    var mc_t89 = 0;
    var mc_t148 = 0;
    var mc_t269 = 0;
    var mc_t147 = 0;
    var mc_t268 = 0;
    var mc_t146 = 0;
    var mc_t267 = 0;
    f = wi.clone(f);





































    mc_t159 = 2;
    for (ii = mc_t159; ii<=n; ii = ii+1) {
        mc_t158 = 2;
        for (jj = mc_t158; jj<=m; jj = jj+1) {
            mc_t210 = wi.create_mxvector(1, 5);
            mc_t211 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t211, 1, ii);
            wi.set_array_index_f64(mc_t211, 2, jj);
            wi.set_array_index_i32(mc_t210, 1, mc_t211);
            mc_t212 = wi.get_f64(f, mc_t210);
            mc_t90 = wi.get_array_index_f64(mc_t212, 1);
            mc_t213 = wi.create_mxvector(1, 5);
            mc_t214 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t214, 1, ii);
            wi.set_array_index_f64(mc_t214, 2, jj);
            wi.set_array_index_i32(mc_t213, 1, mc_t214);
            mc_t215 = wi.get_f64(mask, mc_t213);
            mc_t92 = wi.get_array_index_f64(mc_t215, 1);
            mc_t153 = 1;
            mc_t109 = ii - mc_t153;
            mc_t110 = jj;
            mc_t216 = wi.create_mxvector(1, 5);
            mc_t217 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t217, 1, mc_t109);
            wi.set_array_index_f64(mc_t217, 2, mc_t110);
            wi.set_array_index_i32(mc_t216, 1, mc_t217);
            mc_t218 = wi.get_f64(f, mc_t216);
            mc_t105 = wi.get_array_index_f64(mc_t218, 1);
            mc_t154 = 1;
            mc_t107 = ii + mc_t154;
            mc_t108 = jj;
            mc_t219 = wi.create_mxvector(1, 5);
            mc_t220 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t220, 1, mc_t107);
            wi.set_array_index_f64(mc_t220, 2, mc_t108);
            wi.set_array_index_i32(mc_t219, 1, mc_t220);
            mc_t221 = wi.get_f64(f, mc_t219);
            mc_t106 = wi.get_array_index_f64(mc_t221, 1);
            mc_t101 = mc_t105 + mc_t106;
            mc_t103 = ii;
            mc_t155 = 1;
            mc_t104 = jj - mc_t155;
            mc_t222 = wi.create_mxvector(1, 5);
            mc_t223 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t223, 1, mc_t103);
            wi.set_array_index_f64(mc_t223, 2, mc_t104);
            wi.set_array_index_i32(mc_t222, 1, mc_t223);
            mc_t224 = wi.get_f64(f, mc_t222);
            mc_t102 = wi.get_array_index_f64(mc_t224, 1);
            mc_t97 = mc_t101 + mc_t102;
            mc_t99 = ii;
            mc_t156 = 1;
            mc_t100 = jj + mc_t156;
            mc_t225 = wi.create_mxvector(1, 5);
            mc_t226 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t226, 1, mc_t99);
            wi.set_array_index_f64(mc_t226, 2, mc_t100);
            wi.set_array_index_i32(mc_t225, 1, mc_t226);
            mc_t227 = wi.get_f64(f, mc_t225);
            mc_t98 = wi.get_array_index_f64(mc_t227, 1);
            mc_t96 = mc_t97 + mc_t98;
            mc_t157 = 0.25000000000000000000;
            mc_t94 = mc_t157 * mc_t96;
            mc_t228 = wi.create_mxvector(1, 5);
            mc_t229 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t229, 1, ii);
            wi.set_array_index_f64(mc_t229, 2, jj);
            wi.set_array_index_i32(mc_t228, 1, mc_t229);
            mc_t230 = wi.get_f64(f, mc_t228);
            mc_t95 = wi.get_array_index_f64(mc_t230, 1);
            mc_t93 = mc_t94 - mc_t95;
            mc_t91 = mc_t92 * mc_t93;
            mc_t87 = mc_t90 + mc_t91;
            mc_t231 = wi.create_mxvector(1, 5);
            mc_t232 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t232, 1, jj);
            mc_t232 = wi.set_array_index_i32(mc_t231, 1, mc_t232);
            mc_t233 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t233, mc_t87);
            wi.set_f64(f, mc_t232, mc_t233);
        }
    }

    ii = 1;

    mc_t165 = 2;
    for (jj = mc_t165; jj<=m; jj = jj+1) {
        mc_t234 = wi.create_mxvector(1, 5);
        mc_t235 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t235, 1, ii);
        wi.set_array_index_f64(mc_t235, 2, jj);
        wi.set_array_index_i32(mc_t234, 1, mc_t235);
        mc_t236 = wi.get_f64(f, mc_t234);
        mc_t111 = wi.get_array_index_f64(mc_t236, 1);
        mc_t237 = wi.create_mxvector(1, 5);
        mc_t238 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t238, 1, ii);
        wi.set_array_index_f64(mc_t238, 2, jj);
        wi.set_array_index_i32(mc_t237, 1, mc_t238);
        mc_t239 = wi.get_f64(mask, mc_t237);
        mc_t113 = wi.get_array_index_f64(mc_t239, 1);
        mc_t160 = 1;
        mc_t130 = ii + mc_t160;
        mc_t131 = jj;
        mc_t240 = wi.create_mxvector(1, 5);
        mc_t241 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t241, 1, mc_t130);
        wi.set_array_index_f64(mc_t241, 2, mc_t131);
        wi.set_array_index_i32(mc_t240, 1, mc_t241);
        mc_t242 = wi.get_f64(f, mc_t240);
        mc_t126 = wi.get_array_index_f64(mc_t242, 1);
        mc_t161 = 1;
        mc_t128 = ii + mc_t161;
        mc_t129 = jj;
        mc_t243 = wi.create_mxvector(1, 5);
        mc_t244 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t244, 1, mc_t128);
        wi.set_array_index_f64(mc_t244, 2, mc_t129);
        wi.set_array_index_i32(mc_t243, 1, mc_t244);
        mc_t245 = wi.get_f64(f, mc_t243);
        mc_t127 = wi.get_array_index_f64(mc_t245, 1);
        mc_t122 = mc_t126 + mc_t127;
        mc_t124 = ii;
        mc_t162 = 1;
        mc_t125 = jj - mc_t162;
        mc_t246 = wi.create_mxvector(1, 5);
        mc_t247 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t247, 1, mc_t124);
        wi.set_array_index_f64(mc_t247, 2, mc_t125);
        wi.set_array_index_i32(mc_t246, 1, mc_t247);
        mc_t248 = wi.get_f64(f, mc_t246);
        mc_t123 = wi.get_array_index_f64(mc_t248, 1);
        mc_t118 = mc_t122 + mc_t123;
        mc_t120 = ii;
        mc_t163 = 1;
        mc_t121 = jj + mc_t163;
        mc_t249 = wi.create_mxvector(1, 5);
        mc_t250 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t250, 1, mc_t120);
        wi.set_array_index_f64(mc_t250, 2, mc_t121);
        wi.set_array_index_i32(mc_t249, 1, mc_t250);
        mc_t251 = wi.get_f64(f, mc_t249);
        mc_t119 = wi.get_array_index_f64(mc_t251, 1);
        mc_t117 = mc_t118 + mc_t119;
        mc_t164 = 0.25000000000000000000;
        mc_t115 = mc_t164 * mc_t117;
        mc_t252 = wi.create_mxvector(1, 5);
        mc_t253 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t253, 1, ii);
        wi.set_array_index_f64(mc_t253, 2, jj);
        wi.set_array_index_i32(mc_t252, 1, mc_t253);
        mc_t254 = wi.get_f64(f, mc_t252);
        mc_t116 = wi.get_array_index_f64(mc_t254, 1);
        mc_t114 = mc_t115 - mc_t116;
        mc_t112 = mc_t113 * mc_t114;
        mc_t88 = mc_t111 + mc_t112;
        mc_t255 = wi.create_mxvector(1, 5);
        mc_t256 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t256, 1, jj);
        mc_t256 = wi.set_array_index_i32(mc_t255, 1, mc_t256);
        mc_t257 = wi.create_mxvector(1);
        wi.set_array_index_f64(mc_t257, mc_t88);
        wi.set_f64(f, mc_t256, mc_t257);

    }

    jj = 1;

    mc_t171 = 2;
    for (ii = mc_t171; ii<=n; ii = ii+1) {
        mc_t258 = wi.create_mxvector(1, 5);
        mc_t259 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t259, 1, ii);
        wi.set_array_index_f64(mc_t259, 2, jj);
        wi.set_array_index_i32(mc_t258, 1, mc_t259);
        mc_t260 = wi.get_f64(f, mc_t258);
        mc_t132 = wi.get_array_index_f64(mc_t260, 1);
        mc_t261 = wi.create_mxvector(1, 5);
        mc_t262 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t262, 1, ii);
        wi.set_array_index_f64(mc_t262, 2, jj);
        wi.set_array_index_i32(mc_t261, 1, mc_t262);
        mc_t263 = wi.get_f64(mask, mc_t261);
        mc_t134 = wi.get_array_index_f64(mc_t263, 1);
        mc_t166 = 1;
        mc_t151 = ii - mc_t166;
        mc_t152 = jj;
        mc_t264 = wi.create_mxvector(1, 5);
        mc_t265 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t265, 1, mc_t151);
        wi.set_array_index_f64(mc_t265, 2, mc_t152);
        wi.set_array_index_i32(mc_t264, 1, mc_t265);
        mc_t266 = wi.get_f64(f, mc_t264);
        mc_t147 = wi.get_array_index_f64(mc_t266, 1);
        mc_t167 = 1;
        mc_t149 = ii + mc_t167;
        mc_t150 = jj;
        mc_t267 = wi.create_mxvector(1, 5);
        mc_t268 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t268, 1, mc_t149);
        wi.set_array_index_f64(mc_t268, 2, mc_t150);
        wi.set_array_index_i32(mc_t267, 1, mc_t268);
        mc_t269 = wi.get_f64(f, mc_t267);
        mc_t148 = wi.get_array_index_f64(mc_t269, 1);
        mc_t143 = mc_t147 + mc_t148;
        mc_t145 = ii;
        mc_t168 = 1;
        mc_t146 = jj + mc_t168;
        mc_t270 = wi.create_mxvector(1, 5);
        mc_t271 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t271, 1, mc_t145);
        wi.set_array_index_f64(mc_t271, 2, mc_t146);
        wi.set_array_index_i32(mc_t270, 1, mc_t271);
        mc_t272 = wi.get_f64(f, mc_t270);
        mc_t144 = wi.get_array_index_f64(mc_t272, 1);
        mc_t139 = mc_t143 + mc_t144;
        mc_t141 = ii;
        mc_t169 = 1;
        mc_t142 = jj + mc_t169;
        mc_t273 = wi.create_mxvector(1, 5);
        mc_t274 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t274, 1, mc_t141);
        wi.set_array_index_f64(mc_t274, 2, mc_t142);
        wi.set_array_index_i32(mc_t273, 1, mc_t274);
        mc_t275 = wi.get_f64(f, mc_t273);
        mc_t140 = wi.get_array_index_f64(mc_t275, 1);
        mc_t138 = mc_t139 + mc_t140;
        mc_t170 = 0.25000000000000000000;
        mc_t136 = mc_t170 * mc_t138;
        mc_t276 = wi.create_mxvector(1, 5);
        mc_t277 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t277, 1, ii);
        wi.set_array_index_f64(mc_t277, 2, jj);
        wi.set_array_index_i32(mc_t276, 1, mc_t277);
        mc_t278 = wi.get_f64(f, mc_t276);
        mc_t137 = wi.get_array_index_f64(mc_t278, 1);
        mc_t135 = mc_t136 - mc_t137;
        mc_t133 = mc_t134 * mc_t135;
        mc_t89 = mc_t132 + mc_t133;
        mc_t279 = wi.create_mxvector(1, 5);
        mc_t280 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t280, 1, jj);
        mc_t280 = wi.set_array_index_i32(mc_t279, 1, mc_t280);
        mc_t281 = wi.create_mxvector(1);
        wi.set_array_index_f64(mc_t281, mc_t89);
        wi.set_f64(f, mc_t280, mc_t281);
    }



    return f;
}
gauss_SSSM(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
