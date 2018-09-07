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

function drv_createlhs_S(scale){
    var arr = 0;
    var sum_criterion = 0;
    var mc_t262 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var i = 0;
    var mc_t2 = 0;
    var mc_t0 = 0;



    mc_t4 = 1;
    for (i = mc_t4; i<=scale; i = i+1) {
        mc_t1 = 4;
        mc_t2 = 4;
        mc_t262 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t262, 1, mc_t1);
        wi.set_array_index_f64(mc_t262, 2, mc_t2);
        mc_t0 = wi.randn(mc_t262);
        mc_t3 = 10;
        arr = wi.mtimes_MS(mc_t0, mc_t3);
        sum_criterion = createlhs_M(arr);
    }

    return;
}

function createlhs_M(X){
    var mc_t134 = 0;
    var mc_t255 = 0;
    var mc_t133 = 0;
    var mc_t254 = 0;
    var mc_t132 = 0;
    var mc_t253 = 0;
    var mc_t131 = 0;
    var mc_t252 = 0;
    var mc_t251 = 0;
    var mc_t130 = 0;
    var mc_t250 = 0;
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t32 = 0;
    var mc_t139 = 0;
    var mc_t33 = 0;
    var mc_t259 = 0;
    var mc_t138 = 0;
    var mc_t34 = 0;
    var mc_t137 = 0;
    var mc_t258 = 0;
    var mc_t35 = 0;
    var mc_t136 = 0;
    var mc_t257 = 0;
    var mc_t36 = 0;
    var mc_t37 = 0;
    var mc_t135 = 0;
    var mc_t256 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var sq_dev = 0;
    var vars = 0;
    var sum_sq_dev = 0;
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
    var mc_t248 = 0;
    var mc_t127 = 0;
    var mc_t126 = 0;
    var mc_t247 = 0;
    var mc_t24 = 0;
    var mc_t125 = 0;
    var mc_t246 = 0;
    var mc_t25 = 0;
    var mc_t124 = 0;
    var mc_t245 = 0;
    var mc_t26 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var mc_t233 = 0;
    var mc_t112 = 0;
    var mc_t232 = 0;
    var mc_t111 = 0;
    var mc_t231 = 0;
    var mc_t110 = 0;
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
    var mc_t234 = 0;
    var mc_t113 = 0;
    var maxloop = 0;
    var mc_t222 = 0;
    var mc_t101 = 0;
    var a = 0;
    var mc_t221 = 0;
    var mc_t100 = 0;
    var mc_t220 = 0;
    var c = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t109 = 0;
    var i = 0;
    var mc_t42 = 0;
    var mc_t108 = 0;
    var mc_t229 = 0;
    var mc_t43 = 0;
    var j = 0;
    var mc_t228 = 0;
    var mc_t107 = 0;
    var mc_t44 = 0;
    var mc_t227 = 0;
    var mc_t106 = 0;
    var mc_t45 = 0;
    var mc_t226 = 0;
    var mc_t105 = 0;
    var mc_t46 = 0;
    var mc_t225 = 0;
    var mc_t104 = 0;
    var mc_t47 = 0;
    var mc_t224 = 0;
    var mc_t103 = 0;
    var mc_t48 = 0;
    var mc_t223 = 0;
    var mc_t102 = 0;
    var mc_t49 = 0;
    var r = 0;
    var sqrt_sum = 0;
    var x = 0;
    var y = 0;
    var new_sq_dev = 0;
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
    var loop = 0;
    var mc_t181 = 0;
    var mc_t180 = 0;
    var new_sqrt_sum = 0;
    var sigma = 0;
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
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t159 = 0;
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
    var sum_criterion = 0;
    var new_sum_criterion = 0;
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
    var new_sum_sq_dev = 0;
    var mc_t211 = 0;
    var mc_t210 = 0;
    var mc_t70 = 0;
    var mc_t71 = 0;
    var max_rows = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var mc_t74 = 0;
    var mc_t219 = 0;
    var mc_t75 = 0;
    var mc_t218 = 0;
    var mc_t217 = 0;
    var mc_t76 = 0;
    var mc_t216 = 0;
    var mc_t77 = 0;
    var mc_t215 = 0;
    var mc_t78 = 0;
    var mc_t214 = 0;
    var mc_t79 = 0;
    var mc_t213 = 0;
    var mc_t212 = 0;
    var mc_t200 = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var row_nr1 = 0;
    var mc_t8 = 0;
    var row_nr2 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t208 = 0;
    var mc_t63 = 0;
    var mc_t207 = 0;
    var mc_t64 = 0;
    var mc_t206 = 0;
    var mc_t65 = 0;
    var mc_t205 = 0;
    var mc_t66 = 0;
    var mc_t204 = 0;
    var mc_t67 = 0;
    var mc_t203 = 0;
    var mc_t68 = 0;
    var mc_t202 = 0;
    var mc_t69 = 0;
    var mc_t201 = 0;
    var mc_t209 = 0;
    var mc_t310 = 0;
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
    var mc_t311 = 0;
    var keeps_improving = 0;
    var temp = 0;
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
    var rows = 0;
    var mc_t89 = 0;
    var mc_t303 = 0;
    var mc_t302 = 0;
    var mc_t301 = 0;
    var mc_t300 = 0;
    var mc_t309 = 0;
    var mc_t308 = 0;
    X = wi.clone(X);


    mc_t172 = 1;
    rows = wi.size(X, mc_t172);
    rows = wi.get_array_index_f64(rows, 1);
    mc_t173 = 2;
    vars = wi.size(X, mc_t173);
    vars = wi.get_array_index_f64(vars, 1);
    mc_t38 = rows;
    mc_t174 = 1;
    mc_t39 = rows - mc_t174;
    mc_t37 = mc_t38 * mc_t39;
    mc_t175 = 2;
    max_rows = mc_t37 / mc_t175;


    mc_t263 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t263, 1, max_rows);
    wi.set_array_index_f64(mc_t263, 2, vars);
    sq_dev = wi.zeros(mc_t263);
    mc_t176 = 1;
    mc_t264 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t264, 1, max_rows);
    wi.set_array_index_f64(mc_t264, 2, mc_t176);
    new_sq_dev = wi.zeros(mc_t264);
    mc_t177 = 1;
    mc_t265 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t265, 1, mc_t177);
    wi.set_array_index_f64(mc_t265, 2, max_rows);
    sum_sq_dev = wi.zeros(mc_t265);

    mc_t178 = 1;
    mc_t266 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t266, 1, mc_t178);
    wi.set_array_index_f64(mc_t266, 2, max_rows);
    sqrt_sum = wi.zeros(mc_t266);


    r = 1;
    mc_t179 = 1;
    mc_t45 = rows - mc_t179;
    mc_t184 = 1;
    for (i = mc_t184; i<=mc_t45; i = i+1) {
        mc_t180 = 1;
        mc_t43 = i + mc_t180;
        mc_t44 = rows;
        for (j = mc_t43; j<=mc_t44; j = j+1) {
            mc_t182 = 1;
            for (c = mc_t182; c<=vars; c = c+1) {
                mc_t267 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t267, 1, i);
                wi.set_array_index_f64(mc_t267, 2, c);
                mc_t40 = wi.get_array_value_multiple_indeces_f64(X, mc_t267);
                mc_t268 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t268, 1, j);
                wi.set_array_index_f64(mc_t268, 2, c);
                mc_t42 = wi.get_array_value_multiple_indeces_f64(X, mc_t268);
                mc_t181 = 2;
                mc_t41 = wi.mpower_SS(mc_t42, mc_t181);
                mc_t15 = mc_t40 - mc_t41;
                mc_t269 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t269, 1, r);
                wi.set_array_index_f64(mc_t269, 2, c);
                wi.set_array_value_multiple_indeces_f64(sq_dev, mc_t269, mc_t15);
            }
            mc_t183 = 1;
            r = r + mc_t183;
        }
    }

    sum_criterion = 0;
    mc_t187 = 1;
    for (r = mc_t187; r<=max_rows; r = r+1) {
        mc_t185 = 1;
        for (c = mc_t185; c<=vars; c = c+1) {
            mc_t46 = wi.get_array_index_f64(sum_sq_dev, r);
            mc_t270 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t270, 1, r);
            wi.set_array_index_f64(mc_t270, 2, c);
            mc_t47 = wi.get_array_value_multiple_indeces_f64(sq_dev, mc_t270);
            mc_t16 = mc_t46 + mc_t47;
            mc_t271 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t271, 1, r);
            wi.set_array_value_multiple_indeces_f64(sum_sq_dev, mc_t271, mc_t16);
        }
        mc_t49 = wi.get_array_index_f64(sum_sq_dev, r);
        mc_t48 = wi.sqrt_S(mc_t49);
        mc_t186 = 1;
        mc_t17 = mc_t186 / mc_t48;
        mc_t272 = wi.create_mxvector(1);
        wi.set_array_index_f64(mc_t272, 1, r);
        wi.set_array_value_multiple_indeces_f64(sqrt_sum, mc_t272, mc_t17);
        mc_t50 = sum_criterion;
        mc_t51 = wi.get_array_index_f64(sqrt_sum, r);
        sum_criterion = mc_t50 + mc_t51;
    }


    maxloop = rows;
    keeps_improving = true;
    while (keeps_improving) {

        keeps_improving = false;

        mc_t259 = 1;
        for (loop = mc_t259; loop<=maxloop; loop = loop+1) {


            mc_t188 = 0;
            mc_t189 = 0;
            mc_t273 = wi.create_mxvector(2, 5);
            mc_t274 = wi.convert_scalar_to_mxarray(mc_t188);
            wi.set_array_index_i32(mc_t273, 1, mc_t274);
            mc_t275 = wi.convert_scalar_to_mxarray(mc_t189);
            wi.set_array_index_i32(mc_t273, 2, mc_t275);
            x = wi.vertcat(mc_t273);
            mc_t190 = 1;
            mc_t7 = wi.get_array_index_f64(x, mc_t190);
            mc_t191 = 2;
            mc_t8 = wi.get_array_index_f64(x, mc_t191);
            mc_t203 = mc_t7 === mc_t8;
            while (mc_t203) {
                mc_t192 = 2;
                mc_t193 = 1;
                mc_t276 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t276, 1, mc_t192);
                wi.set_array_index_f64(mc_t276, 2, mc_t193);
                x = wi.randi(rows, mc_t276);
                mc_t194 = 1;
                mc_t5 = wi.get_array_index_f64(x, mc_t194);
                mc_t195 = 2;
                mc_t6 = wi.get_array_index_f64(x, mc_t195);
                mc_t200 = mc_t5 > mc_t6;
                if (mc_t200) {
                    mc_t196 = 1;
                    temp = wi.get_array_index_f64(x, mc_t196);
                    mc_t197 = 2;
                    mc_t18 = wi.get_array_index_f64(x, mc_t197);
                    mc_t198 = 1;
                    mc_t277 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t277, 1, mc_t198);
                    wi.set_array_value_multiple_indeces_f64(x, mc_t277, mc_t18);
                    mc_t199 = 2;
                    mc_t278 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t278, 1, mc_t199);
                    wi.set_array_value_multiple_indeces_f64(x, mc_t278, temp);
                }
                mc_t201 = 1;
                mc_t7 = wi.get_array_index_f64(x, mc_t201);
                mc_t202 = 2;
                mc_t8 = wi.get_array_index_f64(x, mc_t202);
                mc_t203 = mc_t7 === mc_t8;
            }


            mc_t279 = wi.create_mxvector(2);
            wi.set_array_index_f64(mc_t279, 1, 1);
            wi.set_array_index_f64(mc_t279, 2, 1);
            y = wi.randi(vars, mc_t279);
            y = wi.get_array_index_f64(y, 1);


            mc_t204 = 1;
            a = wi.size(sq_dev, mc_t204);
            a = wi.get_array_index_f64(a, 1);
            mc_t205 = 1;
            mc_t280 = wi.create_mxvector(2, 5);
            mc_t281 = wi.convert_scalar_to_mxarray(mc_t205);
            wi.set_array_index_i32(mc_t280, 1, mc_t281);
            mc_t282 = wi.convert_scalar_to_mxarray(a);
            wi.set_array_index_i32(mc_t280, 2, mc_t282);
            mc_t52 = wi.colon(mc_t280);
            mc_t53 = y;
            mc_t283 = wi.create_mxvector(2, 5);
            wi.set_array_index_i32(mc_t283, 1, mc_t52);
            mc_t284 = wi.convert_scalar_to_mxarray(mc_t53);
            wi.set_array_index_i32(mc_t283, 2, mc_t284);
            new_sq_dev = wi.get_f64(sq_dev, mc_t283);
            new_sum_sq_dev = sum_sq_dev;
            new_sum_sq_dev = wi.clone(new_sum_sq_dev);
            new_sqrt_sum = sqrt_sum;
            new_sqrt_sum = wi.clone(new_sqrt_sum);
            new_sum_criterion = sum_criterion;


            mc_t206 = 1;
            mc_t62 = wi.get_array_index_f64(x, mc_t206);
            mc_t207 = 1;
            mc_t60 = mc_t62 - mc_t207;
            mc_t61 = rows;
            mc_t54 = mc_t60 * mc_t61;
            mc_t208 = 1;
            mc_t59 = wi.get_array_index_f64(x, mc_t208);
            mc_t209 = 1;
            mc_t56 = mc_t59 - mc_t209;
            mc_t210 = 1;
            mc_t58 = wi.get_array_index_f64(x, mc_t210);
            mc_t211 = 2;
            mc_t57 = mc_t58 / mc_t211;
            mc_t55 = mc_t56 * mc_t57;
            sigma = mc_t54 - mc_t55;
            mc_t212 = 1;
            i = wi.get_array_index_f64(x, mc_t212);
            mc_t213 = 1;
            mc_t108 = i + mc_t213;
            mc_t109 = rows;
            for (j = mc_t108; j<=mc_t109; j = j+1) {
                mc_t214 = 2;
                mc_t12 = wi.get_array_index_f64(x, mc_t214);
                mc_t230 = j > mc_t12;
                if (mc_t230) {

                    mc_t63 = sigma + j;
                    mc_t64 = i;
                    row_nr1 = mc_t63 - mc_t64;
                    mc_t215 = 2;
                    mc_t9 = wi.get_array_index_f64(x, mc_t215);
                    mc_t227 = mc_t9 < j;
                    if (mc_t227) {
                        mc_t216 = 2;
                        mc_t77 = wi.get_array_index_f64(x, mc_t216);
                        mc_t217 = 1;
                        mc_t75 = mc_t77 - mc_t217;
                        mc_t76 = rows;
                        mc_t69 = mc_t75 * mc_t76;
                        mc_t218 = 2;
                        mc_t74 = wi.get_array_index_f64(x, mc_t218);
                        mc_t219 = 1;
                        mc_t71 = mc_t74 - mc_t219;
                        mc_t220 = 2;
                        mc_t73 = wi.get_array_index_f64(x, mc_t220);
                        mc_t221 = 2;
                        mc_t72 = mc_t73 / mc_t221;
                        mc_t70 = mc_t71 * mc_t72;
                        mc_t67 = mc_t69 - mc_t70;
                        mc_t68 = j;
                        mc_t65 = mc_t67 + mc_t68;
                        mc_t222 = 2;
                        mc_t66 = wi.get_array_index_f64(x, mc_t222);
                        row_nr2 = mc_t65 - mc_t66;
                    } else {

                        mc_t223 = 1;
                        mc_t86 = j - mc_t223;
                        mc_t87 = rows;
                        mc_t82 = mc_t86 * mc_t87;
                        mc_t224 = 1;
                        mc_t84 = j - mc_t224;
                        mc_t225 = 2;
                        mc_t85 = j / mc_t225;
                        mc_t83 = mc_t84 * mc_t85;
                        mc_t80 = mc_t82 - mc_t83;
                        mc_t226 = 2;
                        mc_t81 = wi.get_array_index_f64(x, mc_t226);
                        mc_t78 = mc_t80 + mc_t81;
                        mc_t79 = j;
                        row_nr2 = mc_t78 - mc_t79;
                    }



                    temp = wi.get_array_index_f64(new_sq_dev, row_nr1);
                    mc_t19 = wi.get_array_index_f64(new_sq_dev, row_nr2);
                    mc_t285 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t285, 1, row_nr1);
                    wi.set_array_value_multiple_indeces_f64(new_sq_dev, mc_t285, mc_t19);
                    mc_t286 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t286, 1, row_nr2);
                    wi.set_array_value_multiple_indeces_f64(new_sq_dev, mc_t286, temp);

                    mc_t90 = wi.get_array_index_f64(new_sum_sq_dev, row_nr1);
                    mc_t287 = wi.create_mxvector(2);
                    wi.set_array_index_f64(mc_t287, 1, row_nr1);
                    wi.set_array_index_f64(mc_t287, 2, y);
                    mc_t91 = wi.get_array_value_multiple_indeces_f64(sq_dev, mc_t287);
                    mc_t88 = mc_t90 - mc_t91;
                    mc_t89 = wi.get_array_index_f64(new_sq_dev, row_nr1);
                    mc_t20 = mc_t88 + mc_t89;
                    mc_t288 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t288, 1, row_nr1);
                    wi.set_array_value_multiple_indeces_f64(new_sum_sq_dev, mc_t288, mc_t20);
                    mc_t94 = wi.get_array_index_f64(new_sum_sq_dev, row_nr2);
                    mc_t289 = wi.create_mxvector(2);
                    wi.set_array_index_f64(mc_t289, 1, row_nr2);
                    wi.set_array_index_f64(mc_t289, 2, y);
                    mc_t95 = wi.get_array_value_multiple_indeces_f64(sq_dev, mc_t289);
                    mc_t92 = mc_t94 - mc_t95;
                    mc_t93 = wi.get_array_index_f64(new_sq_dev, row_nr2);
                    mc_t21 = mc_t92 + mc_t93;
                    mc_t290 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t290, 1, row_nr2);
                    wi.set_array_value_multiple_indeces_f64(new_sum_sq_dev, mc_t290, mc_t21);

                    mc_t97 = wi.get_array_index_f64(new_sum_sq_dev, row_nr1);
                    mc_t96 = wi.sqrt_S(mc_t97);
                    mc_t228 = 1;
                    mc_t22 = mc_t228 / mc_t96;
                    mc_t291 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t291, 1, row_nr1);
                    wi.set_array_value_multiple_indeces_f64(new_sqrt_sum, mc_t291, mc_t22);
                    mc_t99 = wi.get_array_index_f64(new_sum_sq_dev, row_nr2);
                    mc_t98 = wi.sqrt_S(mc_t99);
                    mc_t229 = 1;
                    mc_t23 = mc_t229 / mc_t98;
                    mc_t292 = wi.create_mxvector(1);
                    wi.set_array_index_f64(mc_t292, 1, row_nr2);
                    wi.set_array_value_multiple_indeces_f64(new_sqrt_sum, mc_t292, mc_t23);

                    mc_t102 = new_sum_criterion;
                    mc_t103 = wi.get_array_index_f64(sqrt_sum, row_nr1);
                    mc_t100 = mc_t102 - mc_t103;
                    mc_t101 = wi.get_array_index_f64(new_sqrt_sum, row_nr1);
                    new_sum_criterion = mc_t100 + mc_t101;
                    mc_t106 = new_sum_criterion;
                    mc_t107 = wi.get_array_index_f64(sqrt_sum, row_nr2);
                    mc_t104 = mc_t106 - mc_t107;
                    mc_t105 = wi.get_array_index_f64(new_sqrt_sum, row_nr2);
                    new_sum_criterion = mc_t104 + mc_t105;
                }
            }


            mc_t231 = 1;
            j = wi.get_array_index_f64(x, mc_t231);
            mc_t232 = 1;
            mc_t163 = j - mc_t232;
            mc_t251 = 1;
            for (i = mc_t251; i<=mc_t163; i = i+1) {

                mc_t233 = 1;
                mc_t118 = i - mc_t233;
                mc_t119 = rows;
                mc_t114 = mc_t118 * mc_t119;
                mc_t234 = 1;
                mc_t116 = i - mc_t234;
                mc_t235 = 2;
                mc_t117 = i / mc_t235;
                mc_t115 = mc_t116 * mc_t117;
                mc_t112 = mc_t114 - mc_t115;
                mc_t113 = j;
                mc_t110 = mc_t112 + mc_t113;
                mc_t111 = i;
                row_nr1 = mc_t110 - mc_t111;
                mc_t236 = 2;
                mc_t13 = wi.get_array_index_f64(x, mc_t236);
                mc_t248 = mc_t13 > i;
                if (mc_t248) {
                    mc_t237 = 1;
                    mc_t128 = i - mc_t237;
                    mc_t129 = rows;
                    mc_t124 = mc_t128 * mc_t129;
                    mc_t238 = 1;
                    mc_t126 = i - mc_t238;
                    mc_t239 = 2;
                    mc_t127 = i / mc_t239;
                    mc_t125 = mc_t126 * mc_t127;
                    mc_t122 = mc_t124 - mc_t125;
                    mc_t240 = 2;
                    mc_t123 = wi.get_array_index_f64(x, mc_t240);
                    mc_t120 = mc_t122 + mc_t123;
                    mc_t121 = i;
                    row_nr2 = mc_t120 - mc_t121;
                } else {

                    mc_t241 = 2;
                    mc_t142 = wi.get_array_index_f64(x, mc_t241);
                    mc_t242 = 1;
                    mc_t140 = mc_t142 - mc_t242;
                    mc_t141 = rows;
                    mc_t134 = mc_t140 * mc_t141;
                    mc_t243 = 2;
                    mc_t139 = wi.get_array_index_f64(x, mc_t243);
                    mc_t244 = 1;
                    mc_t136 = mc_t139 - mc_t244;
                    mc_t245 = 2;
                    mc_t138 = wi.get_array_index_f64(x, mc_t245);
                    mc_t246 = 2;
                    mc_t137 = mc_t138 / mc_t246;
                    mc_t135 = mc_t136 * mc_t137;
                    mc_t132 = mc_t134 - mc_t135;
                    mc_t133 = i;
                    mc_t130 = mc_t132 + mc_t133;
                    mc_t247 = 2;
                    mc_t131 = wi.get_array_index_f64(x, mc_t247);
                    row_nr2 = mc_t130 - mc_t131;
                }



                temp = wi.get_array_index_f64(new_sq_dev, row_nr1);
                mc_t24 = wi.get_array_index_f64(new_sq_dev, row_nr2);
                mc_t293 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t293, 1, row_nr1);
                wi.set_array_value_multiple_indeces_f64(new_sq_dev, mc_t293, mc_t24);
                mc_t294 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t294, 1, row_nr2);
                wi.set_array_value_multiple_indeces_f64(new_sq_dev, mc_t294, temp);

                mc_t145 = wi.get_array_index_f64(new_sum_sq_dev, row_nr1);
                mc_t295 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t295, 1, row_nr1);
                wi.set_array_index_f64(mc_t295, 2, y);
                mc_t146 = wi.get_array_value_multiple_indeces_f64(sq_dev, mc_t295);
                mc_t143 = mc_t145 - mc_t146;
                mc_t144 = wi.get_array_index_f64(new_sq_dev, row_nr1);
                mc_t25 = mc_t143 + mc_t144;
                mc_t296 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t296, 1, row_nr1);
                wi.set_array_value_multiple_indeces_f64(new_sum_sq_dev, mc_t296, mc_t25);
                mc_t149 = wi.get_array_index_f64(new_sum_sq_dev, row_nr2);
                mc_t297 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t297, 1, row_nr2);
                wi.set_array_index_f64(mc_t297, 2, y);
                mc_t150 = wi.get_array_value_multiple_indeces_f64(sq_dev, mc_t297);
                mc_t147 = mc_t149 - mc_t150;
                mc_t148 = wi.get_array_index_f64(new_sq_dev, row_nr2);
                mc_t26 = mc_t147 + mc_t148;
                mc_t298 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t298, 1, row_nr2);
                wi.set_array_value_multiple_indeces_f64(new_sum_sq_dev, mc_t298, mc_t26);

                mc_t152 = wi.get_array_index_f64(new_sum_sq_dev, row_nr1);
                mc_t151 = wi.sqrt_S(mc_t152);
                mc_t249 = 1;
                mc_t27 = mc_t249 / mc_t151;
                mc_t299 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t299, 1, row_nr1);
                wi.set_array_value_multiple_indeces_f64(new_sqrt_sum, mc_t299, mc_t27);
                mc_t154 = wi.get_array_index_f64(new_sum_sq_dev, row_nr2);
                mc_t153 = wi.sqrt_S(mc_t154);
                mc_t250 = 1;
                mc_t28 = mc_t250 / mc_t153;
                mc_t300 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t300, 1, row_nr2);
                wi.set_array_value_multiple_indeces_f64(new_sqrt_sum, mc_t300, mc_t28);

                mc_t157 = new_sum_criterion;
                mc_t158 = wi.get_array_index_f64(sqrt_sum, row_nr1);
                mc_t155 = mc_t157 - mc_t158;
                mc_t156 = wi.get_array_index_f64(new_sqrt_sum, row_nr1);
                new_sum_criterion = mc_t155 + mc_t156;
                mc_t161 = new_sum_criterion;
                mc_t162 = wi.get_array_index_f64(sqrt_sum, row_nr2);
                mc_t159 = mc_t161 - mc_t162;
                mc_t160 = wi.get_array_index_f64(new_sqrt_sum, row_nr2);
                new_sum_criterion = mc_t159 + mc_t160;
            }


            mc_t258 = new_sum_criterion < sum_criterion;
            if (mc_t258) {
                keeps_improving = true;

                mc_t252 = 1;
                mc_t164 = wi.get_array_index_f64(x, mc_t252);
                mc_t165 = y;
                mc_t301 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t301, 1, mc_t164);
                wi.set_array_index_f64(mc_t301, 2, mc_t165);
                temp = wi.get_array_value_multiple_indeces_f64(X, mc_t301);
                mc_t253 = 2;
                mc_t166 = wi.get_array_index_f64(x, mc_t253);
                mc_t167 = y;
                mc_t302 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t302, 1, mc_t166);
                wi.set_array_index_f64(mc_t302, 2, mc_t167);
                mc_t29 = wi.get_array_value_multiple_indeces_f64(X, mc_t302);
                mc_t254 = 1;
                mc_t31 = wi.get_array_index_f64(x, mc_t254);
                mc_t32 = y;
                mc_t303 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t303, 1, mc_t31);
                wi.set_array_index_f64(mc_t303, 2, mc_t32);
                wi.set_array_value_multiple_indeces_f64(X, mc_t303, mc_t29);
                mc_t255 = 2;
                mc_t33 = wi.get_array_index_f64(x, mc_t255);
                mc_t34 = y;
                mc_t304 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t304, 1, mc_t33);
                wi.set_array_index_f64(mc_t304, 2, mc_t34);
                wi.set_array_value_multiple_indeces_f64(X, mc_t304, temp);

                mc_t256 = 1;
                a = wi.size(sq_dev, mc_t256);
                a = wi.get_array_index_f64(a, 1);
                mc_t257 = 1;
                mc_t305 = wi.create_mxvector(2, 5);
                mc_t306 = wi.convert_scalar_to_mxarray(mc_t257);
                wi.set_array_index_i32(mc_t305, 1, mc_t306);
                mc_t307 = wi.convert_scalar_to_mxarray(a);
                wi.set_array_index_i32(mc_t305, 2, mc_t307);
                mc_t35 = wi.colon(mc_t305);
                mc_t36 = y;
                mc_t308 = wi.create_mxvector(2, 5);
                wi.set_array_index_i32(mc_t308, 1, mc_t35);
                mc_t309 = wi.convert_scalar_to_mxarray(mc_t36);
                wi.set_array_index_i32(mc_t308, 2, mc_t309);
                mc_t310 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t310, 1, new_sq_dev);
                wi.set_f64(sq_dev, mc_t308, mc_t310);
                sum_sq_dev = new_sum_sq_dev;
                new_sum_sq_dev = wi.clone(new_sum_sq_dev);
                sqrt_sum = new_sqrt_sum;
                new_sqrt_sum = wi.clone(new_sqrt_sum);
                sum_criterion = new_sum_criterion;
            }
        }


        sum_criterion = 0;

        mc_t261 = 1;
        for (r = mc_t261; r<=max_rows; r = r+1) {
            mc_t169 = wi.get_array_index_f64(sum_sq_dev, r);
            mc_t168 = wi.sqrt_S(mc_t169);
            mc_t260 = 1;
            mc_t30 = mc_t260 / mc_t168;
            mc_t311 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t311, 1, r);
            wi.set_array_value_multiple_indeces_f64(sqrt_sum, mc_t311, mc_t30);
            mc_t170 = sum_criterion;
            mc_t171 = wi.get_array_index_f64(sqrt_sum, r);
            sum_criterion = mc_t170 + mc_t171;
        }

    }
    return sum_criterion;
}
drv_createlhs_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
