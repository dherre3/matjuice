let memory = WebAssembly.Memory({initial:10});
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

function dirich_SSSSSSSSS(f1, f2, f3, f4, a, b, h, tol, max1){
    var mc_t134 = 0;
    var mc_t133 = 0;
    var mc_t132 = 0;
    var mc_t131 = 0;
    var mc_t130 = 0;
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
    var mc_t56 = 0;
    var mc_t116 = 0;
    var mc_t57 = 0;
    var mc_t115 = 0;
    var mc_t58 = 0;
    var mc_t114 = 0;
    var mc_t59 = 0;
    var mc_t113 = 0;
    var U = 0;
    var mc_t101 = 0;
    var mc_t100 = 0;
    var err = 0;
    var mc_t40 = 0;
    var mc_t109 = 0;
    var mc_t41 = 0;
    var cnt = 0;
    var mc_t108 = 0;
    var mc_t42 = 0;
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
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t4 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t64 = 0;
    var mc_t65 = 0;
    var mc_t66 = 0;
    var mc_t67 = 0;
    var mc_t68 = 0;
    var mc_t69 = 0;
    var mc_t90 = 0;
    var mc_t154 = 0;
    var mc_t91 = 0;
    var mc_t153 = 0;
    var mc_t92 = 0;
    var mc_t152 = 0;
    var mc_t93 = 0;
    var mc_t151 = 0;
    var mc_t94 = 0;
    var mc_t150 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t98 = 0;
    var mc_t10 = 0;
    var relx = 0;
    var mc_t99 = 0;
    var mc_t11 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var ave = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var mc_t145 = 0;
    var mc_t144 = 0;
    var mc_t143 = 0;
    var mc_t80 = 0;
    var mc_t142 = 0;
    var mc_t81 = 0;
    var mc_t141 = 0;
    var mc_t82 = 0;
    var mc_t140 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t86 = 0;
    var mc_t87 = 0;
    var mc_t88 = 0;
    var mc_t89 = 0;
    var mc_t149 = 0;
    var mc_t148 = 0;
    var mc_t147 = 0;
    var mc_t146 = 0;







































































    mc_t15 = a / h;
    mc_t14 = wi.fix_S(mc_t15);
    mc_t85 = 1;
    n = mc_t14 + mc_t85;
    mc_t17 = b / h;
    mc_t16 = wi.fix_S(mc_t17);
    mc_t86 = 1;
    m = mc_t16 + mc_t86;
    mc_t26 = a;
    mc_t27 = f1 + f2;
    mc_t22 = mc_t26 * mc_t27;
    mc_t24 = b;
    mc_t25 = f3 + f4;
    mc_t23 = mc_t24 * mc_t25;
    mc_t18 = mc_t22 + mc_t23;
    mc_t87 = 2;
    mc_t20 = mc_t87 * a;
    mc_t88 = 2;
    mc_t21 = mc_t88 * b;
    mc_t19 = mc_t20 + mc_t21;
    ave = mc_t18 / mc_t19;
    mc_t28 = ave;
    mc_t131 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t131, 1, n);
    wi.set_array_index_f64(mc_t131, 2, m);
    mc_t29 = wi.ones(mc_t131);
    U = wi.mtimes_SM(mc_t28, mc_t29);
    mc_t90 = 1;
    for (l = mc_t90; l<=m; l = l+1) {
        mc_t89 = 1;
        mc_t132 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t132, 1, mc_t89);
        wi.set_array_index_f64(mc_t132, 2, l);
        wi.set_array_value_multiple_indeces_f64(U, mc_t132, f3);
        mc_t133 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t133, 1, n);
        wi.set_array_index_f64(mc_t133, 2, l);
        wi.set_array_value_multiple_indeces_f64(U, mc_t133, f4);
    }

    mc_t92 = 1;
    for (k = mc_t92; k<=n; k = k+1) {
        mc_t91 = 1;
        mc_t134 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t134, 1, k);
        wi.set_array_index_f64(mc_t134, 2, mc_t91);
        wi.set_array_value_multiple_indeces_f64(U, mc_t134, f1);
        mc_t135 = wi.create_mxvector(2);
        wi.set_array_index_f64(mc_t135, 1, k);
        wi.set_array_index_f64(mc_t135, 2, m);
        wi.set_array_value_multiple_indeces_f64(U, mc_t135, f2);
    }

    mc_t93 = 1;
    mc_t94 = 2;
    mc_t136 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t136, 1, mc_t93);
    wi.set_array_index_f64(mc_t136, 2, mc_t94);
    mc_t31 = wi.get_array_value_multiple_indeces_f64(U, mc_t136);
    mc_t95 = 2;
    mc_t96 = 1;
    mc_t137 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t137, 1, mc_t95);
    wi.set_array_index_f64(mc_t137, 2, mc_t96);
    mc_t32 = wi.get_array_value_multiple_indeces_f64(U, mc_t137);
    mc_t30 = mc_t31 + mc_t32;
    mc_t97 = 2;
    mc_t4 = mc_t30 / mc_t97;
    mc_t98 = 1;
    mc_t99 = 1;
    mc_t138 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t138, 1, mc_t98);
    wi.set_array_index_f64(mc_t138, 2, mc_t99);
    wi.set_array_value_multiple_indeces_f64(U, mc_t138, mc_t4);
    mc_t100 = 1;
    mc_t36 = m - mc_t100;
    mc_t101 = 1;
    mc_t139 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t139, 1, mc_t101);
    wi.set_array_index_f64(mc_t139, 2, mc_t36);
    mc_t34 = wi.get_array_value_multiple_indeces_f64(U, mc_t139);
    mc_t102 = 2;
    mc_t140 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t140, 1, mc_t102);
    wi.set_array_index_f64(mc_t140, 2, m);
    mc_t35 = wi.get_array_value_multiple_indeces_f64(U, mc_t140);
    mc_t33 = mc_t34 + mc_t35;
    mc_t103 = 2;
    mc_t5 = mc_t33 / mc_t103;
    mc_t104 = 1;
    mc_t141 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t141, 1, mc_t104);
    wi.set_array_index_f64(mc_t141, 2, m);
    wi.set_array_value_multiple_indeces_f64(U, mc_t141, mc_t5);
    mc_t105 = 1;
    mc_t40 = n - mc_t105;
    mc_t106 = 1;
    mc_t142 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t142, 1, mc_t40);
    wi.set_array_index_f64(mc_t142, 2, mc_t106);
    mc_t38 = wi.get_array_value_multiple_indeces_f64(U, mc_t142);
    mc_t107 = 2;
    mc_t143 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t143, 1, n);
    wi.set_array_index_f64(mc_t143, 2, mc_t107);
    mc_t39 = wi.get_array_value_multiple_indeces_f64(U, mc_t143);
    mc_t37 = mc_t38 + mc_t39;
    mc_t108 = 2;
    mc_t6 = mc_t37 / mc_t108;
    mc_t109 = 1;
    mc_t144 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t144, 1, n);
    wi.set_array_index_f64(mc_t144, 2, mc_t109);
    wi.set_array_value_multiple_indeces_f64(U, mc_t144, mc_t6);
    mc_t110 = 1;
    mc_t46 = n - mc_t110;
    mc_t47 = m;
    mc_t145 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t145, 1, mc_t46);
    wi.set_array_index_f64(mc_t145, 2, mc_t47);
    mc_t42 = wi.get_array_value_multiple_indeces_f64(U, mc_t145);
    mc_t44 = n;
    mc_t111 = 1;
    mc_t45 = m - mc_t111;
    mc_t146 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t146, 1, mc_t44);
    wi.set_array_index_f64(mc_t146, 2, mc_t45);
    mc_t43 = wi.get_array_value_multiple_indeces_f64(U, mc_t146);
    mc_t41 = mc_t42 + mc_t43;
    mc_t112 = 2;
    mc_t7 = mc_t41 / mc_t112;
    mc_t147 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t147, 1, n);
    wi.set_array_index_f64(mc_t147, 2, m);
    wi.set_array_value_multiple_indeces_f64(U, mc_t147, mc_t7);

    mc_t59 = wi.pi();
    mc_t113 = 1;
    mc_t60 = n - mc_t113;
    mc_t58 = mc_t59 / mc_t60;
    mc_t53 = wi.cos_S(mc_t58);
    mc_t56 = wi.pi();
    mc_t114 = 1;
    mc_t57 = m - mc_t114;
    mc_t55 = mc_t56 / mc_t57;
    mc_t54 = wi.cos_S(mc_t55);
    mc_t52 = mc_t53 + mc_t54;
    mc_t115 = 2;
    mc_t51 = wi.mpower_SS(mc_t52, mc_t115);
    mc_t116 = 4;
    mc_t50 = mc_t116 - mc_t51;
    mc_t49 = wi.sqrt_S(mc_t50);
    mc_t117 = 2;
    mc_t48 = mc_t117 + mc_t49;
    mc_t118 = 4;
    w = mc_t118 / mc_t48;
    err = 1;
    cnt = 0;

    mc_t10 = err > tol;
    if (mc_t10) {
        mc_t11 = cnt <= max1;
        mc_t9 = wi.and_SS(mc_t10, mc_t11);
    } else {
        mc_t9 = mc_t10;
    }
    while (mc_t9) {
        err = 0;
        mc_t119 = 1;
        mc_t84 = m - mc_t119;
        mc_t129 = 2;
        for (l = mc_t129; l<=mc_t84; l = l+1) {
            mc_t120 = 1;
            mc_t83 = n - mc_t120;
            mc_t128 = 2;
            for (k = mc_t128; k<=mc_t83; k = k+1) {
                mc_t62 = w;
                mc_t79 = k;
                mc_t121 = 1;
                mc_t80 = l + mc_t121;
                mc_t148 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t148, 1, mc_t79);
                wi.set_array_index_f64(mc_t148, 2, mc_t80);
                mc_t75 = wi.get_array_value_multiple_indeces_f64(U, mc_t148);
                mc_t77 = k;
                mc_t122 = 1;
                mc_t78 = l - mc_t122;
                mc_t149 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t149, 1, mc_t77);
                wi.set_array_index_f64(mc_t149, 2, mc_t78);
                mc_t76 = wi.get_array_value_multiple_indeces_f64(U, mc_t149);
                mc_t71 = mc_t75 + mc_t76;
                mc_t123 = 1;
                mc_t73 = k + mc_t123;
                mc_t74 = l;
                mc_t150 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t150, 1, mc_t73);
                wi.set_array_index_f64(mc_t150, 2, mc_t74);
                mc_t72 = wi.get_array_value_multiple_indeces_f64(U, mc_t150);
                mc_t67 = mc_t71 + mc_t72;
                mc_t124 = 1;
                mc_t69 = k - mc_t124;
                mc_t70 = l;
                mc_t151 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t151, 1, mc_t69);
                wi.set_array_index_f64(mc_t151, 2, mc_t70);
                mc_t68 = wi.get_array_value_multiple_indeces_f64(U, mc_t151);
                mc_t64 = mc_t67 + mc_t68;
                mc_t152 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t152, 1, k);
                wi.set_array_index_f64(mc_t152, 2, l);
                mc_t66 = wi.get_array_value_multiple_indeces_f64(U, mc_t152);
                mc_t125 = 4;
                mc_t65 = mc_t125 * mc_t66;
                mc_t63 = mc_t64 - mc_t65;
                mc_t61 = mc_t62 * mc_t63;
                mc_t126 = 4;
                relx = mc_t61 / mc_t126;

                mc_t153 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t153, 1, k);
                wi.set_array_index_f64(mc_t153, 2, l);
                mc_t81 = wi.get_array_value_multiple_indeces_f64(U, mc_t153);
                mc_t82 = relx;
                mc_t8 = mc_t81 + mc_t82;
                mc_t154 = wi.create_mxvector(2);
                wi.set_array_index_f64(mc_t154, 1, k);
                wi.set_array_index_f64(mc_t154, 2, l);
                wi.set_array_value_multiple_indeces_f64(U, mc_t154, mc_t8);
                mc_t13 = wi.abs_S(relx);
                mc_t127 = err <= mc_t13;
                if (mc_t127) {
                    err = wi.abs_S(relx);
                }
            }
        }
        mc_t130 = 1;
        cnt = cnt + mc_t130;
        mc_t10 = err > tol;
        if (mc_t10) {
            mc_t11 = cnt <= max1;
            mc_t9 = wi.and_SS(mc_t10, mc_t11);
        } else {
            mc_t9 = mc_t10;
        }
    }

    return U;
}

function drv_dich_S(scale){
    var a = 0;
    var b = 0;
    var mc_t3 = 0;
    var h = 0;
    var mc_t1 = 0;
    var mc_t2 = 0;
    var mc_t0 = 0;
    var f1 = 0;
    var f2 = 0;
    var f3 = 0;
    var f4 = 0;
    var tol = 0;
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

    mc_t3 = 1;
    for (time = mc_t3; time<=scale; time = time+1) {
        U = dirich_SSSSSSSSS(f1, f2, f3, f4, a, b, h, tol, max1);
    }

    return;
}
drv_dich_S(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
