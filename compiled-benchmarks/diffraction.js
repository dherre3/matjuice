let memory = WebAssembly.Memory({initial:10});
const { TextDecoder,TextEncoder } = require('util');
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
        pi:()=>Math.PI,
        e:()=>Math.E
    },
    "test":{
        "assert":assert
    }
};
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
console.log("N-dimensional arrays are not supported.".length);
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

function diffraction_SSSSS(CELLS, SLITSIZE1, SLITSIZE2, T1, T2){
    var screenpt = 0;
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
    var SCREENRES = 0;
    var DISTANCE = 0;
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
    var SLITRES = 0;
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var newdata = 0;
    var sourcept = 0;
    var mc_t53 = 0;
    var mc_t54 = 0;
    var K = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var mc_t57 = 0;
    var mc_t58 = 0;
    var mc_t59 = 0;
    var mag = 0;
    var CELLSIZE = 0;
    var cellnum = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t42 = 0;
    var mc_t43 = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var x = 0;
    var mc_t70 = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var wavesum = 0;
    var mc_t74 = 0;
    var mc_t75 = 0;
    var mc_t77 = 0;
    var mc_t78 = 0;
    var mc_t79 = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t60 = 0;
    var mc_t3 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var mc_t63 = 0;
    var mc_t2 = 0;
    var mc_t64 = 0;
    var mc_t66 = 0;
    var mc_t68 = 0;
    var mc_t69 = 0;
    var SCREENLENGTH = 0;
    var WAVELENGTH = 0;
    var mc_t90 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var horizpos = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
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
    var intensity = 0;



















































    console.log(wi.pi());

    DISTANCE = 5;

    WAVELENGTH = 6.3300000000000000000e-07;


    mc_t3 = wi.pi();
    mc_t62 = 2;
    mc_t1 = mc_t62 * mc_t3;
    mc_t2 = WAVELENGTH;
    K = mc_t1 / mc_t2;

    CELLSIZE = SLITSIZE1 + SLITSIZE2;





    mc_t63 = 100;
    SLITRES = WAVELENGTH / mc_t63;


    mc_t9 = DISTANCE;
    mc_t64 = 10;
    mc_t10 = CELLS * mc_t64;
    mc_t7 = mc_t9 / mc_t10;
    mc_t8 = WAVELENGTH;
    mc_t4 = mc_t7 * mc_t8;
    mc_t78 = wi.create_mxvector(2, 5);
    mc_t79 = wi.convert_scalar_to_mxarray(SLITSIZE1);
    wi.set_array_index_i32(mc_t78, 1, mc_t79);
    mc_t80 = wi.convert_scalar_to_mxarray(SLITSIZE2);
    wi.set_array_index_i32(mc_t78, 2, mc_t80);
    mc_t6 = wi.horzcat(mc_t78);
    mc_t5 = wi.mean(mc_t6);
    mc_t5 = wi.get_array_index_f64(mc_t5, 1);
    SCREENRES = mc_t4 / mc_t5;


    mc_t66 = 3;
    mc_t14 = mc_t66 * DISTANCE;
    mc_t15 = WAVELENGTH;
    mc_t11 = mc_t14 * mc_t15;
    mc_t81 = wi.create_mxvector(2, 5);
    mc_t82 = wi.convert_scalar_to_mxarray(SLITSIZE1);
    wi.set_array_index_i32(mc_t81, 1, mc_t82);
    mc_t83 = wi.convert_scalar_to_mxarray(SLITSIZE2);
    wi.set_array_index_i32(mc_t81, 2, mc_t83);
    mc_t13 = wi.horzcat(mc_t81);
    mc_t12 = wi.mean(mc_t13);
    mc_t12 = wi.get_array_index_f64(mc_t12, 1);
    SCREENLENGTH = mc_t11 / mc_t12;

    mc_t68 = 0;
    mc_t69 = 2;
    mc_t84 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t84, 1, mc_t68);
    wi.set_array_index_f64(mc_t84, 2, mc_t69);
    mag = wi.zeros(mc_t84);
    mc_t77 = 0;
    mc_t85 = loop_direction(mc_t77, SCREENRES, SCREENLENGTH);
    mc_t86 = mc_t85(screenpt, SCREENLENGTH);
    while (mc_t86) {
        wavesum = 0;
        mc_t70 = 1;
        mc_t54 = CELLS - mc_t70;
        mc_t73 = 0;
        for (cellnum = mc_t73; cellnum<=mc_t54; cellnum = cellnum+1) {
            mc_t71 = 0;
            for (sourcept = mc_t71; sourcept<=SLITSIZE1; sourcept = sourcept+SLITRES) {
                mc_t16 = screenpt;
                mc_t18 = cellnum * CELLSIZE;
                mc_t19 = sourcept;
                mc_t17 = mc_t18 + mc_t19;
                horizpos = mc_t16 - mc_t17;

                mc_t21 = horizpos;
                mc_t23 = wi.i();
                mc_t23 = wi.get_array_index_f64(mc_t23, 1);
                mc_t24 = DISTANCE;
                mc_t22 = mc_t23 * mc_t24;
                mc_t20 = mc_t21 + mc_t22;
                x = wi.abs_S(mc_t20);


                mc_t25 = wavesum;
                mc_t27 = T1;
                mc_t32 = wi.i();
                mc_t32 = wi.get_array_index_f64(mc_t32, 1);
                mc_t33 = K;
                mc_t30 = mc_t32 * mc_t33;
                mc_t31 = x;
                mc_t29 = mc_t30 * mc_t31;
                mc_t28 = wi.exp_S(mc_t29);
                mc_t26 = mc_t27 * mc_t28;
                wavesum = mc_t25 + mc_t26;
            }
            mc_t72 = 0;
            for (sourcept = mc_t72; sourcept<=SLITSIZE2; sourcept = sourcept+SLITRES) {
                mc_t34 = screenpt;
                mc_t38 = cellnum * CELLSIZE;
                mc_t39 = SLITSIZE1;
                mc_t36 = mc_t38 + mc_t39;
                mc_t37 = sourcept;
                mc_t35 = mc_t36 + mc_t37;
                horizpos = mc_t34 - mc_t35;


                mc_t41 = horizpos;
                mc_t43 = wi.i();
                mc_t43 = wi.get_array_index_f64(mc_t43, 1);
                mc_t44 = DISTANCE;
                mc_t42 = mc_t43 * mc_t44;
                mc_t40 = mc_t41 + mc_t42;
                x = wi.abs_S(mc_t40);


                mc_t45 = wavesum;
                mc_t47 = T2;
                mc_t52 = wi.i();
                mc_t52 = wi.get_array_index_f64(mc_t52, 1);
                mc_t53 = K;
                mc_t50 = mc_t52 * mc_t53;
                mc_t51 = x;
                mc_t49 = mc_t50 * mc_t51;
                mc_t48 = wi.exp_S(mc_t49);
                mc_t46 = mc_t47 * mc_t48;
                wavesum = mc_t45 + mc_t46;
            }
        }
        mc_t55 = wi.abs_S(wavesum);
        mc_t74 = 2;
        intensity = wi.mpower_SS(mc_t55, mc_t74);




        mc_t75 = 100;
        mc_t56 = screenpt * mc_t75;
        mc_t58 = intensity;
        mc_t60 = CELLS * CELLSIZE;
        mc_t61 = SLITRES;
        mc_t59 = mc_t60 / mc_t61;
        mc_t57 = mc_t58 / mc_t59;
        mc_t87 = wi.create_mxvector(2, 5);
        mc_t88 = wi.convert_scalar_to_mxarray(mc_t56);
        wi.set_array_index_i32(mc_t87, 1, mc_t88);
        mc_t89 = wi.convert_scalar_to_mxarray(mc_t57);
        wi.set_array_index_i32(mc_t87, 2, mc_t89);
        newdata = wi.horzcat(mc_t87);

        mc_t90 = wi.create_mxvector(2, 5);
        wi.set_array_index_i32(mc_t90, 1, mag);
        wi.set_array_index_i32(mc_t90, 2, newdata);
        mag = wi.vertcat(mc_t90);
        screenpt = screenpt + SCREENRES;
        mc_t86 = mc_t85(screenpt, SCREENLENGTH);
    }

    return mag;
}

function drv_diff_S(scale){
    var CELLS = 0;
    var mag = 0;
    var SLITSIZE2 = 0;
    var SLITSIZE1 = 0;
    var mc_t0 = 0;
    var time = 0;
    var T1 = 0;
    var T2 = 0;




    CELLS = 2;
    SLITSIZE1 = 1.0000000000000000000e-05;
    SLITSIZE2 = 1.0000000000000000000e-05;
    T1 = 1;
    T2 = 0;
    mc_t0 = 1;
    for (time = mc_t0; time<=scale; time = time+1) {
        mag = diffraction_SSSSS(CELLS, SLITSIZE1, SLITSIZE2, T1, T2);
    }

    return;
}
diffraction_SSSSS(10);
}
runner().then((res)=>{}).catch((err)=>{
    throw err;
});
