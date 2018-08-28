const fs = require("fs");
const libjs = require("./lib_wasm.js");
const file = fs.readFileSync(__dirname+"/builtins.wasm");

(async ()=>{
    let wi;
    try{
        wi = await WebAssembly.instantiate(file, libjs);
    }catch(err){
        throw err;
    }
    wi = wi.instance.exports;
    let memory = wi.mem;


// BEGINNING OF PROGRAM

function drv_bubble_S(size){
    var A = 0;
    var mc_t19 = 0;
    var mc_t1 = 0;
    var y = 0;
    var mc_t0 = 0;
    mc_t0 = 1;
    mc_t19 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t19, 1, mc_t0);
    wi.set_array_index_f64(mc_t19, 2, size);
    A = wi.randn(mc_t19);
    mc_t1 = 100;
    A = wi.mtimes_SM(mc_t1, A);
    y = bubble_M(A);
    wi.disp_M(y);
    return y;
}

function bubble_M(A){
    var mc_t9 = 0;
    var mc_t7 = 0;
    var temp = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var g = 0;
    var mc_t4 = 0;
    var i = 0;
    var mc_t20 = 0;
    var mc_t10 = 0;
    var j = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var n = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var t = 0;
    var x = 0;
    A = wi.clone(A);
    mc_t20 = wi.size(A);
    g = wi.get_array_index_f64(mc_t20, 1);
    t = wi.get_array_index_f64(mc_t20, 2);
    n = wi.length_M(A);
    mc_t11 = 1;
    mc_t10 = n - mc_t11;
    mc_t18 = 1;
    for (j = mc_t18; j<=mc_t10; j = j+1) {

        mc_t12 = 1;
        mc_t9 = n - mc_t12;
        mc_t17 = 1;
        for (i = mc_t17; i<=mc_t9; i = i+1) {
            mc_t5 = wi.get_array_index_f64(A, i);
            mc_t13 = 1;
            mc_t7 = i + mc_t13;
            mc_t6 = wi.get_array_index_f64(A, mc_t7);
            mc_t16 = mc_t5 > mc_t6;
            if (mc_t16) {
                temp = wi.get_array_index_f64(A, i);
                mc_t14 = 1;
                mc_t8 = i + mc_t14;
                mc_t3 = wi.get_array_index_f64(A, mc_t8);
                wi.set_array_index_f64(A, i, mc_t3);
                mc_t15 = 1;
                mc_t4 = i + mc_t15;
                wi.set_array_index_f64(A, mc_t4, temp);
            }
        }
    }
    x = A;

    return x;
}
drv_bubble_S(10);
})();
