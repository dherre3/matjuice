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

function drv_babai_S(scale){
    var A = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var i = 0;
    var mc_t2 = 0;
    var y = 0;
    var z = 0;
    var mc_t0 = 0;

    mc_t4 = 1;
    for (i = mc_t4; i<=scale; i = i+1) {
        mc_t0 = 10;
        mc_t1 = 10;
        mc_t30 = wi.create_mxvextor(2);
        wi.set_array_index_f64(mc_t30, 1, mc_t0);
        wi.set_array_index_f64(mc_t30, 2, mc_t1);
        A = wi.randn(mc_t30);
        mc_t2 = 10;
        mc_t3 = 1;
        mc_t31 = wi.create_mxvextor(2);
        wi.set_array_index_f64(mc_t31, 1, mc_t2);
        wi.set_array_index_f64(mc_t31, 2, mc_t3);
        y = wi.randn(mc_t31);
        babai(A, y);
    }
    return;
}

function babai_MM(R, y){
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var k = 0;
    var mc_t33 = 0;
    var mc_t12 = 0;
    var mc_t34 = 0;
    var mc_t13 = 0;
    var mc_t35 = 0;
    var n = 0;
    var mc_t14 = 0;
    var z_hat = 0;







    wi.length(y);
    mc_t11 = 1;
    mc_t32 = wi.create_mxvextor(2);
    wi.set_array_index_f64(mc_t32, 1, n);
    wi.set_array_index_f64(mc_t32, 2, mc_t11);
    z_hat = wi.zeros(mc_t32);
    mc_t7 = wi.get_array_index_f64(y, n);
    mc_t33 = wi.create_mxvector(1, 5);
    mc_t34 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t34, 1, n);
    wi.set_array_index_f64(mc_t34, 2, n);
    wi.set_array_index_i32(mc_t33, 1, mc_t34);
    mc_t35 = wi.get_f64(R, mc_t33);
    mc_t8 = wi.get_array_index_f64(mc_t35, 1);
    mc_t6 = mc_t7 / mc_t8;
    wi.round(mc_t6);
    wi.set_array_index_f64(z_hat, n, mc_t5);

    mc_t12 = 1;
    mc_t9 = n - mc_t12;
    mc_t13 = 1;
    mc_t10 = -mc_t13;
    mc_t14 = 1;
    for (k = mc_t9; k>=mc_t14; k = k+mc_t10) {

    }

    return z_hat;
}
drv_babai_S(10);
})();
