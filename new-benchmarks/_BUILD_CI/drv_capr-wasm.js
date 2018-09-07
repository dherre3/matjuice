let memory = WebAssembly.Memory({initial:32767});
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
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t20 = 0;
    var iter = 0;
    var mc_t21 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var na = 0;
    var jj = 0;
    var oldcap = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t54 = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var mc_t57 = 0;
    var mc_t13 = 0;
    var mc_t58 = 0;
    var mc_t15 = 0;
    var mc_t59 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var cap = 0;
    var mask = 0;
    var mc_t187 = 0;
    var mc_t186 = 0;
    var mc_t185 = 0;
    var mc_t184 = 0;
    var f = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var h = 0;
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








































    mc_t41 = 0.50000000000000000000;
    mc_t15 = mc_t41 * c;
    mc_t16 = n;
    h = mc_t15 / mc_t16;


    mc_t42 = 0.50000000000000000000;
    mc_t18 = mc_t42 * a;
    mc_t19 = h;
    mc_t17 = mc_t18 / mc_t19;
    na = wi.round_S(mc_t17);
    mc_t43 = 0.50000000000000000000;
    mc_t20 = mc_t43 * c;
    mc_t44 = 1;
    mc_t21 = n + mc_t44;
    mc_t45 = 0;
    x = linspace_SSS(mc_t45, mc_t20, mc_t21);
    mc_t46 = 0.50000000000000000000;
    mc_t23 = mc_t46 * d;
    mc_t24 = h;
    mc_t22 = mc_t23 / mc_t24;
    m = wi.round_S(mc_t22);
    mc_t47 = 0.50000000000000000000;
    mc_t26 = mc_t47 * b;
    mc_t27 = h;
    mc_t25 = mc_t26 / mc_t27;
    mb = wi.round_S(mc_t25);
    mc_t48 = 0.50000000000000000000;
    mc_t28 = mc_t48 * d;
    mc_t49 = 1;
    mc_t29 = m + mc_t49;
    mc_t50 = 0;
    y = linspace_SSS(mc_t50, mc_t28, mc_t29);


    mc_t51 = 1;
    mc_t30 = n + mc_t51;
    mc_t52 = 1;
    mc_t31 = m + mc_t52;
    mc_t184 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t184, 1, mc_t30);
    wi.set_array_index_f64(mc_t184, 2, mc_t31);
    f = wi.zeros(mc_t184);
    mc_t53 = 1;
    mc_t34 = n + mc_t53;
    mc_t54 = 1;
    mc_t35 = m + mc_t54;
    mc_t185 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t185, 1, mc_t34);
    wi.set_array_index_f64(mc_t185, 2, mc_t35);
    mc_t32 = wi.ones(mc_t185);
    mc_t33 = rel;
    mask = wi.mtimes_MS(mc_t32, mc_t33);

    mc_t55 = 1;
    mc_t37 = na + mc_t55;
    mc_t60 = 1;
    for (ii = mc_t60; ii<=mc_t37; ii = ii+1) {
        mc_t56 = 1;
        mc_t36 = mb + mc_t56;
        mc_t59 = 1;
        for (jj = mc_t59; jj<=mc_t36; jj = jj+1) {
            mc_t57 = 0;
            mc_t186 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t186, 1, ii);
            wi.set_array_index_f64(mc_t186, 2, jj);
            wi.set_array_value_multiple_indeces_f64(mask, mc_t186, mc_t57);
            mc_t58 = 1;
            mc_t187 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t187, 1, ii);
            wi.set_array_index_f64(mc_t187, 2, jj); // Could have a calculate, then set index
            wi.set_array_value_multiple_indeces_f64(f, mc_t187, mc_t58);
        }
    }

    oldcap = 0;
    mc_t62 = 1;
    mc_t63 = 1000;
    for (iter = mc_t62; iter<=mc_t63; iter = iter+1) {
        f = seidel_MMSSSS(f, mask, n, m, na, mb);
        cap = gauss_SSSM(n, m, h, f);
        mc_t40 = cap - oldcap;
        mc_t38 = wi.abs_S(mc_t40);
        mc_t39 = cap;
        mc_t13 = mc_t38 / mc_t39;
        mc_t61 = mc_t13 < tol;
        if (mc_t61) {
            break;
        } else {
            oldcap = cap;
        }
    }

    return cap;
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
    var mc_t0 = 0;
    var n = 0;
    var tol = 0;
    var cap = 0;
    var t = 0;
    var rel = 0;




    mc_t1 = 0.32574630000000000000;
    mc_t2 = 2;
    a = mc_t1 * mc_t2;

    mc_t3 = 8.6500000000000000000;
    mc_t4 = 0.040390000000000000000;
    b = mc_t3 * mc_t4;
    mc_t5 = 3.2900000000000000000;
    mc_t6 = 0.55982000000000000000;
    c = mc_t5 * mc_t6;
    mc_t7 = 0.72756100000000000000;
    mc_t8 = 6.1710000000000000000;
    d = mc_t7 * mc_t8;

    mc_t9 = 56.098000000000000000;
    mc_t10 = 0.36000000000000000000;
    mc_t0 = mc_t9 * mc_t10;
    n = wi.floor_S(mc_t0);
    tol = 1.3000000000000000000e-13;

    rel = 0.90000000000000000000;

    wi.tic();
    cap = capacitor_SSSSSSS(a, b, c, d, n, tol, rel);
    t = wi.toc();
    wi.disp_S(t);
    return;
}

function linspace_SSS(d1, d2, n){
    var mc_t178 = 0;
    var mc_t189 = 0;
    var mc_t177 = 0;
    var mc_t188 = 0;
    var mc_t176 = 0;
    var mc_t175 = 0;
    var mc_t174 = 0;
    var mc_t173 = 0;
    var mc_t172 = 0;
    var mc_t182 = 0;
    var mc_t171 = 0;
    var mc_t179 = 0;
    var mc_t181 = 0;
    var mc_t192 = 0;
    var mc_t180 = 0;
    var y = 0;
    var mc_t191 = 0;
    var mc_t190 = 0;













    mc_t173 = d1;
    mc_t180 = 2;
    mc_t179 = n - mc_t180;
    mc_t181 = 0;
    mc_t177 = wi.colon_two(mc_t181, mc_t179);
    mc_t178 = d2 - d1;
    mc_t175 = wi.mtimes_MS(mc_t177, mc_t178);
    mc_t182 = 1;
    mc_t176 = n - mc_t182;
    mc_t174 = wi.mrdivide_MS(mc_t175, mc_t176);
    mc_t171 = wi.plus_SM(mc_t173, mc_t174);
    mc_t172 = d2;
    mc_t191 = wi.create_mxvector(2, 5);
    wi.set_array_index_i32(mc_t191, 1, mc_t171);
    mc_t192 = wi.convert_scalar_to_mxarray(mc_t172);
    wi.set_array_index_i32(mc_t191, 2, mc_t192);
    y = wi.horzcat(mc_t191);
    return y;
}

function seidel_MMSSSS(f, mask, n, m, na, mb){
    var mc_t134 = 0;
    var mc_t133 = 0;
    var mc_t132 = 0;
    var mc_t131 = 0;
    var mc_t130 = 0;
    var mc_t139 = 0;
    var mc_t138 = 0;
    var mc_t137 = 0;
    var mc_t136 = 0;
    var mc_t135 = 0;
    var ii = 0;
    var mc_t123 = 0;
    var mc_t122 = 0;
    var mc_t121 = 0;
    var mc_t120 = 0;
    var mc_t129 = 0;
    var mc_t128 = 0;
    var mc_t127 = 0;
    var mc_t126 = 0;
    var mc_t125 = 0;
    var mc_t124 = 0;
    var jj = 0;
    var mc_t112 = 0;
    var mc_t111 = 0;
    var mc_t199 = 0;
    var mc_t110 = 0;
    var mc_t198 = 0;
    var mc_t197 = 0;
    var mc_t196 = 0;
    var mc_t195 = 0;
    var mc_t194 = 0;
    var mc_t193 = 0;
    var mc_t119 = 0;
    var mc_t118 = 0;
    var mc_t117 = 0;
    var mc_t116 = 0;
    var mc_t115 = 0;
    var mc_t114 = 0;
    var mc_t113 = 0;
    var mc_t101 = 0;
    var mc_t100 = 0;
    var mc_t109 = 0;
    var mc_t108 = 0;
    var mc_t107 = 0;
    var mc_t106 = 0;
    var mc_t105 = 0;
    var mc_t104 = 0;
    var mc_t103 = 0;
    var mc_t102 = 0;
    var mc_t211 = 0;
    var mc_t210 = 0;
    var mc_t216 = 0;
    var mc_t215 = 0;
    var mc_t214 = 0;
    var mc_t213 = 0;
    var mc_t212 = 0;
    var mc_t167 = 0;
    var mc_t200 = 0;
    var mc_t166 = 0;
    var mc_t165 = 0;
    var mc_t164 = 0;
    var mc_t163 = 0;
    var mc_t162 = 0;
    var mc_t161 = 0;
    var mc_t160 = 0;
    var mc_t208 = 0;
    var mc_t207 = 0;
    var mc_t206 = 0;
    var mc_t205 = 0;
    var mc_t204 = 0;
    var mc_t203 = 0;
    var mc_t169 = 0;
    var mc_t202 = 0;
    var mc_t168 = 0;
    var mc_t201 = 0;
    var mc_t209 = 0;
    var mc_t170 = 0;
    var mc_t156 = 0;
    var mc_t155 = 0;
    var mc_t154 = 0;
    var mc_t90 = 0;
    var mc_t91 = 0;
    var mc_t153 = 0;
    var mc_t152 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t151 = 0;
    var mc_t94 = 0;
    var mc_t150 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t98 = 0;
    var mc_t99 = 0;
    var mc_t159 = 0;
    var mc_t158 = 0;
    var mc_t157 = 0;
    var mc_t145 = 0;
    var mc_t144 = 0;
    var mc_t143 = 0;
    var mc_t142 = 0;
    var mc_t141 = 0;
    var mc_t140 = 0;
    var mc_t86 = 0;
    var mc_t87 = 0;
    var mc_t88 = 0;
    var mc_t89 = 0;
    var mc_t149 = 0;
    var mc_t148 = 0;
    var mc_t147 = 0;
    var mc_t146 = 0;
    f = wi.clone(f);





































    mc_t158 = 2;
    for (ii = mc_t158; ii<=n; ii = ii+1) {
        mc_t157 = 2;
        for (jj = mc_t157; jj<=m; jj = jj+1) {
            mc_t193 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t193, 1, ii);
            wi.set_array_index_f64(mc_t193, 2, jj);
            mc_t89 = wi.get_array_value_multiple_indeces_f64(f, mc_t193);
            mc_t194 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t194, 1, ii);
            wi.set_array_index_f64(mc_t194, 2, jj);
            mc_t91 = wi.get_array_value_multiple_indeces_f64(mask, mc_t194);
            mc_t152 = 1;
            mc_t108 = ii - mc_t152;
            mc_t109 = jj;
            mc_t195 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t195, 1, mc_t108);
            wi.set_array_index_f64(mc_t195, 2, mc_t109);
            mc_t104 = wi.get_array_value_multiple_indeces_f64(f, mc_t195);
            mc_t153 = 1;
            mc_t106 = ii + mc_t153;
            mc_t107 = jj;
            mc_t196 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t196, 1, mc_t106);
            wi.set_array_index_f64(mc_t196, 2, mc_t107);
            mc_t105 = wi.get_array_value_multiple_indeces_f64(f, mc_t196);
            mc_t100 = mc_t104 + mc_t105;
            mc_t102 = ii;
            mc_t154 = 1;
            mc_t103 = jj - mc_t154;
            mc_t197 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t197, 1, mc_t102);
            wi.set_array_index_f64(mc_t197, 2, mc_t103);
            mc_t101 = wi.get_array_value_multiple_indeces_f64(f, mc_t197);
            mc_t96 = mc_t100 + mc_t101;
            mc_t98 = ii;
            mc_t155 = 1;
            mc_t99 = jj + mc_t155;
            mc_t198 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t198, 1, mc_t98);
            wi.set_array_index_f64(mc_t198, 2, mc_t99);
            mc_t97 = wi.get_array_value_multiple_indeces_f64(f, mc_t198);
            mc_t95 = mc_t96 + mc_t97;
            mc_t156 = 0.25000000000000000000;
            mc_t93 = mc_t156 * mc_t95;
            mc_t199 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t199, 1, ii);
            wi.set_array_index_f64(mc_t199, 2, jj);
            mc_t94 = wi.get_array_value_multiple_indeces_f64(f, mc_t199);
            mc_t92 = mc_t93 - mc_t94;
            mc_t90 = mc_t91 * mc_t92;
            mc_t86 = mc_t89 + mc_t90;
            mc_t200 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t200, 1, ii);
            wi.set_array_index_f64(mc_t200, 2, jj);
            wi.set_array_value_multiple_indeces_f64(f, mc_t200, mc_t86);
        }
    }

    ii = 1;

    mc_t164 = 2;
    for (jj = mc_t164; jj<=m; jj = jj+1) {
        mc_t201 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t201, 1, ii);
        wi.set_array_index_f64(mc_t201, 2, jj);
        mc_t110 = wi.get_array_value_multiple_indeces_f64(f, mc_t201);
        mc_t202 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t202, 1, ii);
        wi.set_array_index_f64(mc_t202, 2, jj);
        mc_t112 = wi.get_array_value_multiple_indeces_f64(mask, mc_t202);
        mc_t159 = 1;
        mc_t129 = ii + mc_t159;
        mc_t130 = jj;
        mc_t203 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t203, 1, mc_t129);
        wi.set_array_index_f64(mc_t203, 2, mc_t130);
        mc_t125 = wi.get_array_value_multiple_indeces_f64(f, mc_t203);
        mc_t160 = 1;
        mc_t127 = ii + mc_t160;
        mc_t128 = jj;
        mc_t204 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t204, 1, mc_t127);
        wi.set_array_index_f64(mc_t204, 2, mc_t128);
        mc_t126 = wi.get_array_value_multiple_indeces_f64(f, mc_t204);
        mc_t121 = mc_t125 + mc_t126;
        mc_t123 = ii;
        mc_t161 = 1;
        mc_t124 = jj - mc_t161;
        mc_t205 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t205, 1, mc_t123);
        wi.set_array_index_f64(mc_t205, 2, mc_t124);
        mc_t122 = wi.get_array_value_multiple_indeces_f64(f, mc_t205);
        mc_t117 = mc_t121 + mc_t122;
        mc_t119 = ii;
        mc_t162 = 1;
        mc_t120 = jj + mc_t162;
        mc_t206 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t206, 1, mc_t119);
        wi.set_array_index_f64(mc_t206, 2, mc_t120);
        mc_t118 = wi.get_array_value_multiple_indeces_f64(f, mc_t206);
        mc_t116 = mc_t117 + mc_t118;
        mc_t163 = 0.25000000000000000000;
        mc_t114 = mc_t163 * mc_t116;
        mc_t207 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t207, 1, ii);
        wi.set_array_index_f64(mc_t207, 2, jj);
        mc_t115 = wi.get_array_value_multiple_indeces_f64(f, mc_t207);
        mc_t113 = mc_t114 - mc_t115;
        mc_t111 = mc_t112 * mc_t113;
        mc_t87 = mc_t110 + mc_t111;
        mc_t208 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t208, 1, ii);
        wi.set_array_index_f64(mc_t208, 2, jj);
        wi.set_array_value_multiple_indeces_f64(f, mc_t208, mc_t87);

    }

    jj = 1;

    mc_t170 = 2;
    for (ii = mc_t170; ii<=n; ii = ii+1) {
        mc_t209 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t209, 1, ii);
        wi.set_array_index_f64(mc_t209, 2, jj);
        mc_t131 = wi.get_array_value_multiple_indeces_f64(f, mc_t209);
        mc_t210 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t210, 1, ii);
        wi.set_array_index_f64(mc_t210, 2, jj);
        mc_t133 = wi.get_array_value_multiple_indeces_f64(mask, mc_t210);
        mc_t165 = 1;
        mc_t150 = ii - mc_t165;
        mc_t151 = jj;
        mc_t211 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t211, 1, mc_t150);
        wi.set_array_index_f64(mc_t211, 2, mc_t151);
        mc_t146 = wi.get_array_value_multiple_indeces_f64(f, mc_t211);
        mc_t166 = 1;
        mc_t148 = ii + mc_t166;
        mc_t149 = jj;
        mc_t212 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t212, 1, mc_t148);
        wi.set_array_index_f64(mc_t212, 2, mc_t149);
        mc_t147 = wi.get_array_value_multiple_indeces_f64(f, mc_t212);
        mc_t142 = mc_t146 + mc_t147;
        mc_t144 = ii;
        mc_t167 = 1;
        mc_t145 = jj + mc_t167;
        mc_t213 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t213, 1, mc_t144);
        wi.set_array_index_f64(mc_t213, 2, mc_t145);
        mc_t143 = wi.get_array_value_multiple_indeces_f64(f, mc_t213);
        mc_t138 = mc_t142 + mc_t143;
        mc_t140 = ii;
        mc_t168 = 1;
        mc_t141 = jj + mc_t168;
        mc_t214 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t214, 1, mc_t140);
        wi.set_array_index_f64(mc_t214, 2, mc_t141);
        mc_t139 = wi.get_array_value_multiple_indeces_f64(f, mc_t214);
        mc_t137 = mc_t138 + mc_t139;
        mc_t169 = 0.25000000000000000000;
        mc_t135 = mc_t169 * mc_t137;
        mc_t215 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t215, 1, ii);
        wi.set_array_index_f64(mc_t215, 2, jj);
        mc_t136 = wi.get_array_value_multiple_indeces_f64(f, mc_t215);
        mc_t134 = mc_t135 - mc_t136;
        mc_t132 = mc_t133 * mc_t134;
        mc_t88 = mc_t131 + mc_t132;
        mc_t216 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t216, 1, ii);
        wi.set_array_index_f64(mc_t216, 2, jj);
        wi.set_array_value_multiple_indeces_f64(f, mc_t216, mc_t88);
    }



    return f;
}

function gauss_SSSM(n, m, h, f){
    var jj = 0;
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
    var mc_t78 = 0;
    var mc_t79 = 0;
    var cap = 0;
    var ii = 0;
    var mc_t220 = 0;
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t64 = 0;
    var mc_t65 = 0;
    var mc_t66 = 0;
    var mc_t67 = 0;
    var mc_t68 = 0;
    var mc_t69 = 0;
    var q = 0;
































    q = 0;
    mc_t80 = 1;
    for (ii = mc_t80; ii<=n; ii = ii+1) {
        mc_t64 = q;
        mc_t217 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t217, 1, ii);
        wi.set_array_index_f64(mc_t217, 2, m);
        mc_t67 = wi.get_array_value_multiple_indeces_f64(f, mc_t217);
        mc_t78 = 1;
        mc_t69 = ii + mc_t78;
        mc_t70 = m;
        mc_t218 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t218, 1, mc_t69);
        wi.set_array_index_f64(mc_t218, 2, mc_t70);
        mc_t68 = wi.get_array_value_multiple_indeces_f64(f, mc_t218);
        mc_t66 = mc_t67 + mc_t68;
        mc_t79 = 0.50000000000000000000;
        mc_t65 = mc_t66 * mc_t79;
        q = mc_t64 + mc_t65;
    }

    mc_t83 = 1;
    for (jj = mc_t83; jj<=m; jj = jj+1) {
        mc_t71 = q;
        mc_t219 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t219, 1, n);
        wi.set_array_index_f64(mc_t219, 2, jj);
        mc_t74 = wi.get_array_value_multiple_indeces_f64(f, mc_t219);
        mc_t76 = n;
        mc_t81 = 1;
        mc_t77 = jj + mc_t81;
        mc_t220 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t220, 1, mc_t76);
        wi.set_array_index_f64(mc_t220, 2, mc_t77);
        mc_t75 = wi.get_array_value_multiple_indeces_f64(f, mc_t220);
        mc_t73 = mc_t74 + mc_t75;
        mc_t82 = 0.50000000000000000000;
        mc_t72 = mc_t73 * mc_t82;
        q = mc_t71 + mc_t72;
    }

    mc_t84 = 4;
    cap = q * mc_t84;

    mc_t85 = 8.8541870000000000000;
    cap = cap * mc_t85;



    return cap;
}
drv_capr_S(2);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
