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
        A = wi.randn(mc_t0, mc_t1);
        mc_t2 = 10;
        mc_t3 = 1;
        y = wi.randn(mc_t2, mc_t3);
        z = babai_MM(A, y);
    }
    return;
}

function babai_MM(R, y){
    var mc_t134 = 0;
    var mc_t133 = 0;
    var mc_t131 = 0;
    var mc_t130 = 0;
    var mc_t181 = 0;
    var mc_t180 = 0;
    var mc_t123 = 0;
    var mc_t200 = 0;
    var mc_t122 = 0;
    var mc_t121 = 0;
    var mc_t120 = 0;
    var mc_t128 = 0;
    var mc_t127 = 0;
    var mc_t126 = 0;
    var mc_t203 = 0;
    var mc_t125 = 0;
    var mc_t202 = 0;
    var mc_t124 = 0;
    var mc_t201 = 0;
    var z_hat = 0;
    var mc_t112 = 0;
    var mc_t111 = 0;
    var mc_t199 = 0;
    var mc_t110 = 0;
    var mc_t198 = 0;
    var mc_t197 = 0;
    var mc_t196 = 0;
    var mc_t195 = 0;
    var mc_t194 = 0;
    var mc_t95 = 0;
    var mc_t193 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t119 = 0;
    var mc_t98 = 0;
    var mc_t99 = 0;
    var mc_t117 = 0;
    var mc_t116 = 0;
    var mc_t114 = 0;
    var mc_t113 = 0;
    var mc_t101 = 0;
    var mc_t189 = 0;
    var a = 0;
    var mc_t100 = 0;
    var mc_t188 = 0;
    var mc_t187 = 0;
    var mc_t186 = 0;
    var mc_t185 = 0;
    var mc_t184 = 0;
    var mc_t183 = 0;
    var g = 0;
    var mc_t182 = 0;
    var mc_t109 = 0;
    var h = 0;
    var mc_t107 = 0;
    var k = 0;
    var mc_t106 = 0;
    var mc_t105 = 0;
    var mc_t104 = 0;
    var n = 0;
    var mc_t103 = 0;
    var mc_t102 = 0;
    var a1 = 0;
    var a2 = 0;
    var mc_t192 = 0;
    var mc_t191 = 0;
    var mc_t190 = 0;








    mc_t109 = 2;
    mc_t110 = 2;
    mc_t111 = 2;
    mc_t183 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t183, 1, mc_t109);
    wi.set_array_index_f64(mc_t183, 2, mc_t110);
    wi.set_array_index_f64(mc_t183, 3, mc_t111);
    mc_t96 = wi.horzcat(mc_t183);
    mc_t112 = 3;
    mc_t97 = mc_t112;
    mc_t113 = 2;
    mc_t98 = mc_t113;
    mc_t184 = wi.create_mxvector(3);
    wi.set_array_index_f64(mc_t184, 1, mc_t96);
    wi.set_array_index_f64(mc_t184, 2, mc_t97);
    wi.set_array_index_f64(mc_t184, 3, mc_t98);
    a = wi.colon(mc_t184);
    n = wi.length_M(y);
    mc_t114 = 1;
    z_hat = wi.zeros(n, mc_t114);
    mc_t100 = wi.get_array_index_f64(y, n);
    mc_t185 = wi.create_mxvector(1, 5);
    mc_t186 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t186, 1, n);
    wi.set_array_index_f64(mc_t186, 2, n);
    wi.set_array_index_i32(mc_t185, 1, mc_t186);
    mc_t187 = wi.get_f64(R, mc_t185);
    mc_t101 = wi.get_array_index_f64(mc_t187, 1);
    mc_t99 = mc_t100 / mc_t101;
    mc_t95 = wi.round_S(mc_t99);
    wi.set_array_index_f64(z_hat, n, mc_t95);
    mc_t116 = 1;
    mc_t117 = 2;
    mc_t190 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t190, 1, mc_t116);
    wi.set_array_index_f64(mc_t190, 2, mc_t117);
    mc_t102 = wi.horzcat(mc_t190);
    g = wi.ones(mc_t102);
    mc_t119 = 3;
    mc_t120 = 5;
    mc_t121 = 2;
    mc_t122 = 1;
    mc_t123 = 1;
    mc_t124 = 1;
    mc_t197 = wi.create_mxvector(6);
    wi.set_array_index_f64(mc_t197, 1, mc_t119);
    wi.set_array_index_f64(mc_t197, 2, mc_t120);
    wi.set_array_index_f64(mc_t197, 3, mc_t121);
    wi.set_array_index_f64(mc_t197, 4, mc_t122);
    wi.set_array_index_f64(mc_t197, 5, mc_t123);
    wi.set_array_index_f64(mc_t197, 6, mc_t124);
    mc_t103 = wi.horzcat(mc_t197);
    k = wi.ones(mc_t103);

    mc_t125 = 2;
    mc_t126 = 2;
    a1 = wi.ones(mc_t125, mc_t126);
    mc_t127 = 2;
    mc_t128 = 2;
    a2 = wi.randn(mc_t127, mc_t128);
    mc_t130 = 1;
    mc_t131 = 2;
    mc_t200 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t200, 1, mc_t130);
    wi.set_array_index_f64(mc_t200, 2, mc_t131);
    mc_t104 = wi.horzcat(mc_t200);
    mc_t133 = 1;
    mc_t134 = 2;
    mc_t203 = wi.create_mxvector(2);
    wi.set_array_index_f64(mc_t203, 1, mc_t133);
    wi.set_array_index_f64(mc_t203, 2, mc_t134);
    mc_t106 = wi.horzcat(mc_t203);
    mc_t107 = a2;
    mc_t105 = wi.times_MM(mc_t106, mc_t107);
    h = wi.plus_MM(mc_t104, mc_t105);

    return z_hat;
}
drv_babai_S(10);
})();
