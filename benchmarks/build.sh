#!/bin/bash

MATJUICE=../matjuice.sh
BUILD_DIR=_BUILD_CI


HTML_TEMPLATE=`cat <<EOF
<html>
  <head>
    <script type="text/javascript" src="SOURCE_FILE"></script>
  </head>
</html>
EOF`


BENCHMARKS=(
#    bubble/drv_bubble.m
#    bubble_jitted/drv_bubble_jitted.m
#    bbai/drv_babai.m
#    bbai_jitted/drv_babai_jitted.m
#    capr/drv_capr.m
#    clos/drv_clos.m
    collatz/drv_collatz.m
#    collatz_jitted/drv_collatz_jitted.m
#    crni/drv_crni.m
#    dich/drv_dich.m
#    fdtd/drv_fdtd.m
#    fft/drv_fft.m
#    fiff/drv_fiff.m
#    lgdr/drv_lgdr.m
#    make_change/drv_make_change.m
#    matmul/drv_matmul_p.m
#    mcpi/drv_mcpi_p.m
#    nb1d/drv_nb1d.m
#    numprime/drv_prime.m
)
if [[ $* == *--use-wasm* ]]; then
    echo "GENERATING WASM..."
    prefix="-wasm"
else
    echo "GENERATING JS..."
    prefix=""
fi
#rm -rf $BUILD_DIR

#mkdir -p $BUILD_DIR

for b in ${BENCHMARKS[@]}; do
    basefile=$(basename $b .m)
    jsdrv=$basefile$prefix.js
    htmlfile=$basefile.html
    echo -n "$b... "
    $MATJUICE  $b $BUILD_DIR/$jsdrv "DOUBLE&1*1&REAL" $* > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "OK"
        echo $HTML_TEMPLATE > $BUILD_DIR/$htmlfile
        temp=$BUILD_DIR/$htmlfile
        sed -i "s/SOURCE_FILE/$jsdrv/"  $temp
    else
        echo "FAIL"
    fi
done
