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

function fft_four1_MSS(data, n, isign){
    var wtemp = 0;
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t32 = 0;
    var mc_t33 = 0;
    var mc_t34 = 0;
    var theta = 0;
    var mc_t35 = 0;
    var mc_t36 = 0;
    var mc_t37 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
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
    var istep = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t54 = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var mc_t57 = 0;
    var mc_t58 = 0;
    var mc_t59 = 0;
    var result = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var i = 0;
    var mc_t42 = 0;
    var j = 0;
    var mc_t43 = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var m = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var t = 0;
    var mc_t70 = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var tempi = 0;
    var mc_t74 = 0;
    var mc_t75 = 0;
    var mc_t76 = 0;
    var mc_t77 = 0;
    var mc_t78 = 0;
    var tempr = 0;
    var mc_t79 = 0;
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
    var wpi = 0;
    var wpr = 0;
    var nn = 0;
    var mc_t90 = 0;
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t94 = 0;
    var mc_t95 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var wi1 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var wr = 0;
    var mc_t80 = 0;
    var mmax = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t86 = 0;
    var mc_t87 = 0;
    var mc_t88 = 0;
    var mc_t89 = 0;
    data = wi.clone(data);















    mc_t64 = 2;
    nn = mc_t64 * n;
    j = 2;
    mc_t73 = 2;
    mc_t74 = 2;
    for (i = mc_t73; i<=nn; i = i+mc_t74) {
        mc_t69 = j > i;
        if (mc_t69) {
            mc_t65 = 1;
            mc_t21 = j - mc_t65;
            t = wi.get_array_index_f64(data, mc_t21);
            mc_t66 = 1;
            mc_t22 = i - mc_t66;
            mc_t10 = wi.get_array_index_f64(data, mc_t22);
            mc_t67 = 1;
            mc_t16 = j - mc_t67;
            mc_t88 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t88, 1, mc_t16);
            wi.set_array_value_multiple_indeces_f64(data, mc_t88, mc_t10);
            mc_t68 = 1;
            mc_t17 = i - mc_t68;
            mc_t89 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t89, 1, mc_t17);
            wi.set_array_value_multiple_indeces_f64(data, mc_t89, t);

            t = wi.get_array_index_f64(data, j);
            mc_t11 = wi.get_array_index_f64(data, i);
            mc_t90 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t90, 1, j);
            wi.set_array_value_multiple_indeces_f64(data, mc_t90, mc_t11);
            mc_t91 = wi.create_mxvector(1);
            wi.set_array_index_f64(mc_t91, 1, i);
            wi.set_array_value_multiple_indeces_f64(data, mc_t91, t);
        }
        m = n;
        mc_t70 = 2;
        mc_t23 = m >= mc_t70;
        if (mc_t23) {
            mc_t23 = j > m;
        } else {
            mc_t23 = false;
        }
        mc_t20 = mc_t23;
        while (mc_t20) {
            j = j - m;
            mc_t71 = 2;
            m = m / mc_t71;
            mc_t72 = 2;
            mc_t24 = m >= mc_t72;
            if (mc_t24) {
                mc_t24 = j > m;
            } else {
                mc_t24 = false;
            }
            mc_t20 = mc_t24;
        }
        j = j + m;
    }
    mmax = 2;
    mc_t87 = nn > mmax;
    while (mc_t87) {
        mc_t75 = 2;
        istep = mmax * mc_t75;
        mc_t25 = isign;
        mc_t76 = 6.2831853071795900000;
        mc_t26 = mc_t76 / mmax;
        theta = mc_t25 * mc_t26;
        mc_t77 = 0.50000000000000000000;
        mc_t27 = mc_t77 * theta;
        wtemp = wi.sin_S(mc_t27);
        mc_t78 = 2.0000000000000000000;
        mc_t30 = -mc_t78;
        mc_t31 = wtemp;
        mc_t28 = mc_t30 * mc_t31;
        mc_t29 = wtemp;
        wpr = mc_t28 * mc_t29;
        wpi = wi.sin_S(theta);
        wr = 1.0000000000000000000;
        wi1 = 0.0000000000000000000;
        mc_t85 = 2;
        mc_t86 = 2;
        for (m = mc_t85; m<=mmax; m = m+mc_t86) {
            for (i = m; i<=nn; i = i+istep) {
                j = i + mmax;
                mc_t36 = wr;
                mc_t79 = 1;
                mc_t38 = j - mc_t79;
                mc_t37 = wi.get_array_index_f64(data, mc_t38);
                mc_t32 = mc_t36 * mc_t37;
                mc_t34 = wi1;
                mc_t35 = wi.get_array_index_f64(data, j);
                mc_t33 = mc_t34 * mc_t35;
                tempr = mc_t32 - mc_t33;
                mc_t44 = wr;
                mc_t45 = wi.get_array_index_f64(data, j);
                mc_t39 = mc_t44 * mc_t45;
                mc_t41 = wi1;
                mc_t80 = 1;
                mc_t43 = j - mc_t80;
                mc_t42 = wi.get_array_index_f64(data, mc_t43);
                mc_t40 = mc_t41 * mc_t42;
                tempi = mc_t39 + mc_t40;
                mc_t81 = 1;
                mc_t48 = i - mc_t81;
                mc_t46 = wi.get_array_index_f64(data, mc_t48);
                mc_t47 = tempr;
                mc_t12 = mc_t46 - mc_t47;
                mc_t82 = 1;
                mc_t18 = j - mc_t82;
                mc_t92 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t92, 1, mc_t18);
                wi.set_array_value_multiple_indeces_f64(data, mc_t92, mc_t12);
                mc_t49 = wi.get_array_index_f64(data, i);
                mc_t50 = tempi;
                mc_t13 = mc_t49 - mc_t50;
                mc_t93 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t93, 1, j);
                wi.set_array_value_multiple_indeces_f64(data, mc_t93, mc_t13);
                mc_t83 = 1;
                mc_t53 = i - mc_t83;
                mc_t51 = wi.get_array_index_f64(data, mc_t53);
                mc_t52 = tempr;
                mc_t14 = mc_t51 + mc_t52;
                mc_t84 = 1;
                mc_t19 = i - mc_t84;
                mc_t94 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t94, 1, mc_t19);
                wi.set_array_value_multiple_indeces_f64(data, mc_t94, mc_t14);
                mc_t54 = wi.get_array_index_f64(data, i);
                mc_t55 = tempi;
                mc_t15 = mc_t54 + mc_t55;
                mc_t95 = wi.create_mxvector(1);
                wi.set_array_index_f64(mc_t95, 1, i);
                wi.set_array_value_multiple_indeces_f64(data, mc_t95, mc_t15);
            }
            wtemp = wr;
            mc_t58 = wtemp * wpr;
            mc_t59 = wi1 * wpi;
            mc_t56 = mc_t58 - mc_t59;
            mc_t57 = wr;
            wr = mc_t56 + mc_t57;
            mc_t62 = wi1 * wpr;
            mc_t63 = wtemp * wpi;
            mc_t60 = mc_t62 + mc_t63;
            mc_t61 = wi1;
            wi1 = mc_t60 + mc_t61;
        }
        mmax = istep;
        mc_t87 = nn > mmax;
    }
    result = data;
    return result;
}

function drv_fft_S(scale){
    var mc_t8 = 0;
    var mc_t5 = 0;
    var data = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var mc_t96 = 0;
    var mc_t2 = 0;
    var mc_t0 = 0;
    var n = 0;
    var out = 0;
    var t = 0;






    mc_t1 = wi.round_S(scale);
    mc_t3 = 2;
    mc_t0 = wi.mpower_SS(mc_t3, mc_t1);
    mc_t4 = 1024;
    n = mc_t4 * mc_t0;
    mc_t5 = 2;
    mc_t2 = mc_t5 * n;
    mc_t6 = 1;
    mc_t96 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t96, 1, mc_t6);
    wi.set_array_index_f64(mc_t96, 2, mc_t2);
    data = wi.randn(mc_t96);


    wi.tic();
    mc_t8 = 1;
    out = fft_four1_MSS(data, n, mc_t8);
    t = wi.toc();
    wi.disp_S(t);
    return;
}
drv_fft_S(1);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
