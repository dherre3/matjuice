/*
 * MatJuice API.  These functions are used internally in the library
 * for MATLAB built-ins, however they do not correspond to any MATLAB
 * built-in.
 */


/* Create a new matrix object.
 * x    : the Float64Array that contains the data.
 * shape: an array containing the dimensions of the matrix.
 *
 * Note: the elements in x are expected to be in column-major order,
 *       i.e. the matrix [1 2 ; 3 4] is represented as {1, 3, 2, 4}.
 */


var CLONE_LENGTHS = 0;
var CLONE_COUNT = 0;

Float64Array.prototype.mj_clone = function() {
    CLONE_COUNT++;
    CLONE_LENGTHS += this.length;
    var newbuf = new Float64Array(this);
    var newshape = this.mj_size().slice(0);
    return mj_create(newbuf, newshape);
}

Float64Array.prototype.mj_scalar = function() {
    return false;
}

Float64Array.prototype.mj_numel = function() {
    return this._length;
}

Float64Array.prototype.mj_size = function() {
    return this._shape;
}

Float64Array.prototype.mj_stride = function() {
    return this._stride;
}

Float64Array.prototype.mj_dims = function() {
    return this._dims;
}

Float64Array.prototype.mj_get = function(indices) {
    return this[mj_compute_index(this, indices)];
}

Float64Array.prototype.mj_set = function(value, indices) {
    this[mj_compute_index(this, indices)] = value;
    return this;
}




Number.prototype.mj_clone = function() {
    return this;
}

Number.prototype.mj_scalar = function() {
    return true;
}

Number.prototype.mj_numel = function() {
    return 1;
}

Number.prototype.mj_size = function() {
    return [1, 1];
}

Number.prototype.mj_stride = function() {
    return [1, 0];
}

Number.prototype.mj_dims = function() {
    return 2;
}

Number.prototype.mj_get = function(indices) {
    var idx = mj_compute_index(this, indices);
    if (idx === 0)
        return this;
    else
        return undefined;
}

Number.prototype.mj_set = function(value, indices) {
    var idx = mj_compute_index(this, indices);
    if (idx === 0)
        return value;
    else
        return undefined;
}



function mj_create(x, shape) {
    function mj_make_stride(shape) {
        var stride = [1];

        for (var i = 0; i < shape.length - 1; ++i) {
            stride.push(stride[i] * shape[i]);
        }
        return stride;
    }

    if (typeof x === "object" && x.length == 1) {
        x = x[0];
    }
    else if (typeof x === "object") {
        x._length = x.length;
        x._shape = shape;
        x._dims = shape.length;
        x._stride = mj_make_stride(shape, x._dims);
    }

    return x;
}

function mj_new_from(matrix) {
    var buf = new Float64Array(matrix.mj_numel());
    return mj_create(buf, matrix.mj_size());
}


function mj_compute_index(x, indices) {
    var array_index = 0;
    var stride = x.mj_stride();
    for (var i = 0, end = indices.length; i < end; ++i) {
        array_index += (indices[i] - 1) * stride[i];
    }
    return array_index;
}


function mj_convert_to_slices(array, indices) {
    var slice_indices = new Array(indices.length);
    for (var i = 0; i < indices.length; ++i) {
        if (indices[i] === MC_COLON) {
            slice_indices[i] = mc_colon(1, array.mj_size()[i]);
        }
        else if (typeof indices[i] === "object") { // slice
            slice_indices[i] = indices[i];
        }
        else {
            slice_indices[i] = [indices[i]];
        }
    }
    return slice_indices;
}

function mj_compute_shape(slice_indices) {
    var shape = [];
    for (var i = 0; i < slice_indices.length; ++i) {
        shape.push(slice_indices[i].length);
    }
    // HACK(vfoley): make sure always at least two dimensions.
    if (shape.length === 1)
        shape.push(1);
    return shape;
}



function MJSliceIterator(indices) {
    N = indices.length;

    this.indices = indices;
    this.is_done = false;

    this.curr = new Array(N);
    for (var j = 0; j < N; ++j) {
        this.curr[j] = 0;
    }

    this.next = function() {
        if (this.is_done)
            return null;

        // Save current index settings
        prev = this.curr.slice();

        // Advance current index
        for (var j = 0; j < N; ++j) {
            this.curr[j] = (this.curr[j] + 1) % this.indices[j].length;
            if (this.curr[j] !== 0)
                break;
        }

        // We are done if all indices of prev are at the end
        this.is_done = true;
        for (var j = 0; j < N; ++j) {
            this.is_done = this.is_done && (prev[j]+1 === this.indices[j].length);
        }

        var result = new Array(N);
        for (var j = 0; j < N; ++j) {
            result[j] = this.indices[j][prev[j]];
        }

        return result;
    }
}

function mj_forall(arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr.mj_get([i]) === 0) {
            return false;
        }
    }

    return true;
}
function zeroIndex(xs) {
    for (var i = 0; i < xs.length; ++i)
        if (xs[i] === 0)
            return i;
    return -1;
}
function nanIndex(xs) {
    for (var i = 0; i < xs.length; ++i)
        if (isNaN(xs[i]))
            return i;
    return -1;
}
var MC_COLON = {};
var MC_TICTOC = 0;
function mc_error(msg) {
    throw new Error(msg);
}
function mc_plus_SS(x$2, y) {
    return x$2 + y;
}
function mc_plus_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) + x$2, [i]);
    }
    ;
    return out$2;
}
function mc_plus_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) + x$2, [i]);
    }
    ;
    return out$2;
}
function mc_plus_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 + y, [i]);
    }
    ;
    return out$2;
}
function mc_minus_SS(x$2, y) {
    return x$2 - y;
}
function mc_minus_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 - m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_minus_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) - x$2, [i]);
    }
    ;
    return out$2;
}
function mc_minus_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 - y, [i]);
    }
    ;
    return out$2;
}
function mc_rem_SS(x$2, y) {
    return x$2 % y;
}
function mc_rem_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 % m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_rem_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) % x$2, [i]);
    }
    ;
    return out$2;
}
function mc_rem_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 % y, [i]);
    }
    ;
    return out$2;
}
function mc_mod_SS(x$2, y) {
    var n = Math.floor(x$2 / y);
    return x$2 - n * y;
}
function mc_mod_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1; i <= m.mj_numel(); ++i) {
        out$2.mj_set(mc_mod_SS(x$2, m.mj_get([i])), [i]);
    }
    return out$2;
}
function mc_mod_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1; i <= m.mj_numel(); ++i) {
        out$2.mj_set(mc_mod_SS(m.mj_get([i]), x$2), [i]);
    }
    return out$2;
}
function mc_mod_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    if (m1.mj_numel() !== m2.mj_numel()) {
        throw new Error('matrix sizes differ');
    }
    for (var i = 1; i <= m1.mj_numel(); ++i) {
        var a = m1.mj_get([i]);
        var b = m2.mj_get([i]);
        out$2.mj_set(mc_mod_SS(a, b), [i]);
    }
    return out$2;
}
function mc_mtimes_SS(x$2, y) {
    return x$2 * y;
}
function mc_mtimes_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) * x$2, [i]);
    }
    ;
    return out$2;
}
function mc_mtimes_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) * x$2, [i]);
    }
    ;
    return out$2;
}
function mc_mtimes_MM(m1, m2) {
    var m1_rows = m1.mj_size()[0];
    var m1_cols = m1.mj_size()[1];
    var m2_rows = m2.mj_size()[0];
    var m2_cols = m2.mj_size()[1];
    if (m1_cols !== m2_rows) {
        throw new Error('Inner matrix dimensions must agree.');
    }
    var out$2 = mc_zeros(m1_rows, m2_cols);
    for (var row = 1; row <= m1_rows; ++row) {
        for (var col = 1; col <= m2_cols; ++col) {
            var acc = 0;
            for (var k = 1; k <= m2_rows; ++k) {
                acc += m1.mj_get([
                    row,
                    k
                ]) * m2.mj_get([
                    k,
                    col
                ]);
            }
            out$2 = out$2.mj_set(acc, [
                row,
                col
            ]);
        }
    }
    return out$2;
}
function mc_times_SS(a, b) {
    return mc_mtimes_SS(a, b);
}
function mc_times_SM(a, b) {
    return mc_mtimes_SM(a, b);
}
function mc_times_MS(a, b) {
    return mc_mtimes_MS(a, b);
}
function mc_times_MM(a, b) {
    var out$2 = mj_new_from(a);
    var m1_length = a.mj_numel();
    var m2_length = b.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = a.mj_get([i]);
        var y = b.mj_get([i]);
        out$2.mj_set(x$2 * y, [i]);
    }
    ;
    return out$2;
}
function mc_mrdivide_SS(x$2, y) {
    return x$2 / y;
}
function mc_mrdivide_SM(x$2, m) {
    throw new Error('Unsupported mrdivide for scalar-matrix arguments');
}
function mc_mrdivide_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) / x$2, [i]);
    }
    ;
    return out$2;
}
function mc_mrdivide_MM(m1, m2) {
    throw new Error('mc_mrdivide_MM: not implemented');
}
function mc_rdivide_SS(x$2, y) {
    return x$2 / y;
}
function mc_rdivide_MS(m, d) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) / d, [i]);
    }
    ;
    return out$2;
}
function mc_rdivide_SM(d, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(d / m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_rdivide_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 / y, [i]);
    }
    ;
    return out$2;
}
function mc_lt_SS(x$2, y) {
    return x$2 < y;
}
function mc_lt_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 < m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_lt_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) < x$2, [i]);
    }
    ;
    return out$2;
}
function mc_lt_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 < y, [i]);
    }
    ;
    return out$2;
}
function mc_gt_SS(x$2, y) {
    return x$2 > y;
}
function mc_gt_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 > m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_gt_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) > x$2, [i]);
    }
    ;
    return out$2;
}
function mc_gt_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 > y, [i]);
    }
    ;
    return out$2;
}
function mc_le_SS(x$2, y) {
    return x$2 <= y;
}
function mc_le_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 <= m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_le_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) <= x$2, [i]);
    }
    ;
    return out$2;
}
function mc_le_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 <= y, [i]);
    }
    ;
    return out$2;
}
function mc_ge_SS(x$2, y) {
    return x$2 >= y;
}
function mc_ge_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 >= m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_ge_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) >= x$2, [i]);
    }
    ;
    return out$2;
}
function mc_ge_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 >= y, [i]);
    }
    ;
    return out$2;
}
function mc_eq_SS(x1, x2) {
    return x1 === x2;
}
function mc_eq_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 === m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_eq_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) === x$2, [i]);
    }
    ;
    return out$2;
}
function mc_eq_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 === y, [i]);
    }
    ;
    return out$2;
}
function mc_ne_SS(x1, x2) {
    return x1 !== x2;
}
function mc_ne_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2 !== m.mj_get([i]), [i]);
    }
    ;
    return out$2;
}
function mc_ne_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(m.mj_get([i]) !== x$2, [i]);
    }
    ;
    return out$2;
}
function mc_ne_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 !== y, [i]);
    }
    ;
    return out$2;
}
function mc_length_S(x$2) {
    return 1;
}
function mc_length_M(m) {
    var max = 0;
    var size = m.mj_size();
    for (var i = 0, n = size.length; i < n; ++i)
        max = Math.max(max, size[i]);
    return max;
}
function mc_floor_S(x$2) {
    return Math.floor(x$2);
}
function mc_floor_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.floor(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_ceil_S(x$2) {
    return Math.ceil(x$2);
}
function mc_ceil_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.ceil(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_sin_S(x$2) {
    return Math.sin(x$2);
}
function mc_sin_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.sin(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_cos_S(x$2) {
    return Math.cos(x$2);
}
function mc_cos_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.cos(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_tan_S(x$2) {
    return Math.tan(x$2);
}
function mc_tan_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.tan(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_sqrt_S(x$2) {
    return Math.sqrt(x$2);
}
function mc_sqrt_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.sqrt(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_uminus_S(x$2) {
    return -x$2;
}
function mc_uminus_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1; i <= m.mj_numel(); ++i)
        out$2.mj_set(-out$2.mj_get([i]), [i]);
    return out$2;
}
function mc_round_S(x$2) {
    return Math.round(x$2);
}
function mc_round_M(m) {
    out = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out.mj_set(Math.round(m.mj_get([i])), [i]);
    }
    ;
    return m;
}
function mc_mpower_SS(a, b) {
    return Math.pow(a, b);
}
function mc_power_SS(a, b) {
    return Math.pow(a, b);
}
function mc_power_SM(a, b) {
    var out$2 = mj_new_from(b);
    for (var i = 0; i < b.mj_numel(); ++i)
        out$2[i] = Math.pow(a, out$2[i]);
    return out$2;
}
function mc_power_MS(a, b) {
    var out$2 = mj_new_from(a);
    for (var i = 0; i < a.mj_numel(); ++i) {
        out$2[i] = Math.pow(out$2[i], b);
    }
    return out$2;
}
function mc_true() {
    return true;
}
function mc_false() {
    return false;
}
function mc_horzcat() {
    var num_rows = -1;
    var num_cols = 0;
    var len = 0;
    for (// Compute the length and number of columns of the result.
        // Also check that all arguments have the same number of rows.
        var i = 0; i < arguments.length; ++i) {
        if (num_rows == -1) {
            num_rows = arguments[i].mj_size()[0];
        } else if (arguments[i].mj_size()[0] != num_rows) {
            throw new Error('Dimensions of matrices being concatenated are not consistent.');
        }
        num_cols += arguments[i].mj_size()[1];
        len += arguments[i].mj_numel();
    }
    var // Create the result array buffer and populate it by just putting
    // all the arguments back-to-back.
    buf = new Float64Array(len);
    var offset = 0;
    for (var i = 0; i < arguments.length; ++i) {
        if (arguments[i].mj_scalar()) {
            buf[offset] = arguments[i];
        } else {
            buf.set(arguments[i], offset);
        }
        offset += arguments[i].mj_numel();
    }
    return mj_create(buf, [
        num_rows,
        num_cols
    ]);
}
function mc_vertcat() {
    var num_rows = 0;
    var num_cols = -1;
    var len = 0;
    for (var i = 0; i < arguments.length; ++i) {
        if (num_cols == -1) {
            num_cols = arguments[i].mj_size()[1];
        } else if (arguments[i].mj_size()[1] != num_cols) {
            throw new Error('Dimensions of matrices being concatenated are not consistent.');
        }
        num_rows += arguments[i].mj_size()[0];
        len += arguments[i].mj_numel();
    }
    var buf = new Float64Array(len);
    var offset = 0;
    for (var col = 1; col <= num_cols; ++col) {
        for (var arg_id = 0; arg_id < arguments.length; ++arg_id) {
            for (var row = 1; row <= arguments[arg_id].mj_size()[0]; ++row) {
                buf[offset] = arguments[arg_id].mj_get([
                    row,
                    col
                ]);
                offset++;
            }
        }
    }
    return mj_create(buf, [
        num_rows,
        num_cols
    ]);
}
function mc_compute_shape_length(arg) {
    var shape, length;
    if (arg.length === 0) {
        shape = [
            1,
            1
        ];
        length = 1;
    } else if (arg.length === 1) {
        var len = Math.max(arg[0], 0);
        shape = [
            len,
            len
        ];
        length = len * len;
    } else {
        shape = arg;
        length = 1;
        for (var i = 0; i < shape.length; ++i)
            length *= arg[i];
    }
    return [
        shape,
        length
    ];
}
function mc_rand() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = Math.random();
    }
    return mj_create(buf, shape);
}
function mc_randn() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = Math.random();
    }
    return mj_create(buf, shape);
}
function mc_randi(imax) {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 1));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = Math.abs(Math.floor(Math.random() * imax));
    }
    return mj_create(buf, shape);
}
function mc_zeros() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    return mj_create(buf, shape);
}
function mc_ones() {
    var sh_len = mc_compute_shape_length(Array.prototype.slice.call(arguments, 0));
    var shape = sh_len[0];
    var length = sh_len[1];
    var buf = new Float64Array(length);
    for (var i = 0; i < length; ++i) {
        buf[i] = 1;
    }
    return mj_create(buf, shape);
}
function mc_eye_S(rows, cols) {
    return 1;
}
function mc_eye_M(rows, cols) {
    if (cols === undefined)
        cols = rows;
    var buf = new Float64Array(rows * cols);
    var mat = mj_create(buf, [
        rows,
        cols
    ]);
    for (var i = 1; i <= rows; ++i) {
        mat.mj_set(1, [
            i,
            i
        ]);
    }
    return mat;
}
function mc_exp_S(x$2) {
    return Math.exp(x$2);
}
function mc_exp_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.exp(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_log_S(x$2) {
    return Math.log(x$2);
}
function mc_log_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.log(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_abs_S(x$2) {
    return Math.abs(x$2);
}
function mc_abs_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(Math.abs(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_colon() {
    var start, stop, step;
    switch (arguments.length) {
    case 2:
        start = arguments[0];
        stop = arguments[1];
        step = 1;
        break;
    case 3:
        start = arguments[0];
        stop = arguments[2];
        step = arguments[1];
        break;
    default:
        throw new Error('invalid number of arguments');
    }
    var len = Math.floor((stop - start) / step) + 1;
    var buf = new Float64Array(len);
    var i = 0;
    var val = start;
    while (true) {
        if (start <= stop && val > stop)
            break;
        if (start > stop && val < stop)
            break;
        buf[i] = val;
        val += step;
        i++;
    }
    return mj_create(buf, [
        1,
        len
    ]);
}
function mc_transpose(matrix) {
    var new_matrix = mc_zeros(matrix.mj_size()[1], matrix.mj_size()[0]);
    for (var i = 1; i <= matrix.mj_size()[0]; ++i) {
        for (var j = 1; j <= matrix.mj_size()[1]; ++j) {
            new_matrix.mj_set(matrix.mj_get([
                i,
                j
            ]), [
                j,
                i
            ]);
        }
    }
    return new_matrix;
}
function mc_const_false() {
    return false;
}
function mc_disp_M(x$2) {
    console.log(x$2);
}
function mc_disp_S(x$2) {
    console.log(x$2);
}
function mc_pi() {
    return Math.PI;
}
function mc_mean(m) {
    if (// TODO(vfoley): implement mean for matrices
        m.mj_dims() == 2 && (m.mj_size()[0] == 1 || m.mj_size()[1] == 1)) {
        var sum = 0;
        var n = m.mj_numel();
        for (var i = 1; i <= n; ++i)
            sum += m.mj_get([i]);
        return sum / n;
    }
    var rows = m.mj_size()[0];
    var cols = m.mj_size()[1];
    var out$2 = mc_zeros(1, cols);
    for (var c = 0; c < cols; ++c) {
        for (var r = 0; r < rows; ++r) {
            out$2[c] += m.mj_get([
                r + 1,
                c + 1
            ]);
        }
        out$2[c] /= rows;
    }
    return out$2;
}
function mc_max(a, b) {
    return Math.max(a, b);
}
function mc_min(a, b) {
    return Math.min(a, b);
}
function mc_tic() {
    MC_TICTOC = Date.now();
}
function mc_toc() {
    var elapsed = Date.now() - MC_TICTOC;
    return elapsed / 1000;
}
function mc_resize(array, new_index) {
    var // new_index contains the 0-based index to assign to.
    new_array = mj_create(new Float64Array(new_index + 1), array.mj_dims());
    new_array.set(array, 0);
    return new_array;
}
function loop_direction(from, step, to) {
    if (from < to) {
        if (step <= 0)
            return mc_const_false;
        else
            return mc_le_SS;
    } else if (from > to) {
        if (step >= 0)
            return mc_const_false;
        else
            return mc_ge_SS;
    } else {
        return mc_eq_SS;
    }
}
function mc_slice_get(m, indices) {
    var slice_indices = mj_convert_to_slices(m, indices);
    var shape = mj_compute_shape(slice_indices);
    var numel = 1;
    for (var i = 0; i < shape.length; ++i)
        numel *= shape[i];
    var buf = new Float64Array(numel);
    var it = new MJSliceIterator(slice_indices);
    var i = 0;
    while ((x = it.next()) !== null) {
        var y = m.mj_get(x);
        buf[i++] = y;
    }
    var out$2 = mj_create(buf, shape);
    return out$2;
}
function mc_slice_set(m, values, indices) {
    var slice_indices = mj_convert_to_slices(m, indices);
    var i = 0;
    var it = new MJSliceIterator(slice_indices);
    while ((x = it.next()) !== null) {
        m.mj_set(values[i++], x);
    }
}
function mc_slice_set_scalar(m, scalar, indices) {
    var slice_indices = mj_convert_to_slices(m, indices);
    var it = new MJSliceIterator(slice_indices);
    while ((x = it.next()) !== null) {
        m.mj_set(scalar, x);
    }
}
function mc_size(m, dim) {
    if (dim === undefined) {
        var shape = m.mj_size();
        return mj_create(new Float64Array(shape), [
            1,
            shape.length
        ]);
    } else {
        var s = m.mj_size();
        if (dim > s.length)
            return 1;
        else
            return s[dim - 1];
    }
}
function mc_any(m) {
    if (// TODO: Handle 2d and ndarrays correctly
        typeof m === 'number')
        return m !== 0 ? 1 : 0;
    else if (typeof m === 'boolean')
        return m ? 1 : 0;
    else {
        for (var i = 0; i < m.length; ++i) {
            if (m[i] !== 0)
                return 1;
        }
        return 0;
    }
}
function mc_fix_S(x$2) {
    if (x$2 < 0)
        return Math.ceil(x$2);
    else
        return Math.floor(x$2);
}
function mc_fix_M(m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = m.mj_numel(); i <= N; ++i) {
        out$2.mj_set(mc_fix_S(m.mj_get([i])), [i]);
    }
    ;
    return out$2;
}
function mc_and_SS(x$2, y) {
    return x$2 && y;
}
function mc_and_SM(x$2, m) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = x$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2.mj_get([i]) && m, [i]);
    }
    ;
    return out$2;
}
function mc_and_MS(m, x$2) {
    var out$2 = mj_new_from(m);
    for (var i = 1, N = x$2.mj_numel(); i <= N; ++i) {
        out$2.mj_set(x$2.mj_get([i]) && m, [i]);
    }
    ;
    return out$2;
}
function mc_and_MM(m1, m2) {
    var out$2 = mj_new_from(m1);
    var m1_length = m1.mj_numel();
    var m2_length = m2.mj_numel();
    if (m1_length !== m2_length)
        throw new Error('array sizes differ');
    for (var i = 1, n = m1_length; i <= n; ++i) {
        var x$2 = m1.mj_get([i]);
        var y = m2.mj_get([i]);
        out$2.mj_set(x$2 && y, [i]);
    }
    ;
    return out$2;
}
function mc_sum(m, dim) {
    if (typeof m === 'number') {
        return m;
    } else if (m.mj_dims() !== 2) {
        throw new Error('Unimplemented \'sum\' operator for n-dimensional arrays');
    } else if ((m.mj_size()[0] == 1 || m.mj_size()[1] == 1) && dim === undefined) {
        var sum = 0;
        var n = m.mj_numel();
        for (var i = 1; i <= n; ++i)
            sum += m.mj_get([i]);
        return sum;
    } else {
        if (dim < 0) {
            throw new Error('Error using sum\n' + 'Dimension argument must be a positive integer scalar within indexing range.');
        }
        throw new Error('sum: Unimplemented for matrices');
    }
}
function mc_assert(bool) {
    if (typeof bool !== 'number' && typeof bool !== 'boolean') {
        throw new Error('Error using assert\n' + 'The condition input argument must be a scalar logical.');
    }
    if (!bool) {
        throw new Error('assertion failed');
    }
}
function mc_isequal(v1, v2) {
    if (typeof v1 !== typeof v2) {
        return false;
    } else if (typeof v1 === 'number') {
        return v1 === v2;
    } else if (!(v1 instanceof Float64Array && v2 instanceof Float64Array)) {
        throw new Error('Unsupported isequal method for non-matrix ' + v1 + ' or ' + v2);
    } else {
        if (v1.mj_dims() !== v2.mj_dims()) {
            return false;
        } else if (v1.mj_numel() !== v2.mj_numel()) {
            return false;
        } else {
            var v1size = v1.mj_size();
            var v2size = v2.mj_size();
            for (var d = 0; d < v1.mj_dims(); ++d) {
                if (v1size[d] !== v2size[d]) {
                    return false;
                }
            }
            for (var i = 1; i <= v1.mj_numel(); ++i) {
                if (v1.mj_get([i]) !== v2.mj_get([i])) {
                    return false;
                }
            }
            return true;
        }
    }
}
function mc_not(v) {
    if (typeof v == 'boolean') {
        return !v;
    } else if (typeof v === 'number') {
        if (v === 0) {
            return 1;
        } else {
            return 0;
        }
    } else if (v instanceof Float64Array) {
        var not_array = mj_new_from(v);
        for (var i = 1; i < not_array.mj_numel(); ++i) {
            not_array.mj_set([i], mc_not(not_array.mj_get([i])));
        }
    } else {
        throw new Error('Unimplemented \'not\' operation for ' + v);
    }
}


// BEGINNING OF PROGRAM

function drv_fdtd_S(scale){
    var Ets = 0;
    var Nt = 0;
    var nrm = 0;
    var Nx = 0;
    var Ny = 0;
    var mc_t0 = 0;
    var Lx = 0;
    var Nz = 0;
    var Ly = 0;
    var mc_t269 = 0;
    var Lz = 0;
    var Hx = 0;
    var Hy = 0;
    var Hz = 0;
    var Ex = 0;
    var Ey = 0;
    var t = 0;
    var Ez = 0;





    Lx = 0.050000000000000000000;
    Ly = 0.040000000000000000000;
    Lz = 0.030000000000000000000;

    Nx = 25;
    Ny = 20;
    Nz = 15;




    nrm = 866.02540000000000000;

    mc_t0 = 200;
    Nt = scale * mc_t0;

    mc_tic();
    mc_t269 = fdtd_SSSSSSSS(Lx, Ly, Lz, Nx, Ny, Nz, nrm, Nt);
    Ex = mc_t269[0];
    Ey = mc_t269[1];
    Ez = mc_t269[2];
    Hx = mc_t269[3];
    Hy = mc_t269[4];
    Hz = mc_t269[5];
    Ets = mc_t269[6];
    t = mc_toc();
    mc_disp_S(t);
    return;
}

function fdtd_SSSSSSSS(Lx, Ly, Lz, Nx, Ny, Nz, nrm, Nt){
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
    var mc_t30 = 0;
    var mc_t31 = 0;
    var mc_t32 = 0;
    var mc_t33 = 0;
    var mc_t139 = 0;
    var mc_t34 = 0;
    var mc_t138 = 0;
    var mc_t259 = 0;
    var mc_t35 = 0;
    var mc_t137 = 0;
    var mc_t258 = 0;
    var mc_t36 = 0;
    var mc_t136 = 0;
    var mc_t257 = 0;
    var mc_t37 = 0;
    var mc_t135 = 0;
    var mc_t256 = 0;
    var mc_t38 = 0;
    var mc_t39 = 0;
    var mc_t123 = 0;
    var mc_t244 = 0;
    var mc_t122 = 0;
    var mc_t243 = 0;
    var mc_t121 = 0;
    var mc_t242 = 0;
    var mc_t241 = 0;
    var mc_t120 = 0;
    var mc_t240 = 0;
    var eps0 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var mc_t129 = 0;
    var mc_t22 = 0;
    var mc_t128 = 0;
    var mc_t249 = 0;
    var mc_t23 = 0;
    var mc_t127 = 0;
    var mc_t248 = 0;
    var c0 = 0;
    var mc_t24 = 0;
    var mc_t126 = 0;
    var mc_t247 = 0;
    var mc_t25 = 0;
    var mc_t125 = 0;
    var mc_t246 = 0;
    var mc_t26 = 0;
    var mc_t124 = 0;
    var mc_t245 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var mc_t112 = 0;
    var mc_t233 = 0;
    var mc_t111 = 0;
    var mc_t232 = 0;
    var mc_t110 = 0;
    var mc_t231 = 0;
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
    var mc_t113 = 0;
    var mc_t234 = 0;
    var mc_t222 = 0;
    var mc_t101 = 0;
    var mc_t221 = 0;
    var mc_t100 = 0;
    var mc_t220 = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t109 = 0;
    var mc_t42 = 0;
    var mc_t108 = 0;
    var mc_t229 = 0;
    var mc_t43 = 0;
    var mc_t107 = 0;
    var mc_t228 = 0;
    var mc_t44 = 0;
    var mc_t106 = 0;
    var mc_t227 = 0;
    var mc_t45 = 0;
    var mc_t226 = 0;
    var mc_t105 = 0;
    var mc_t46 = 0;
    var mc_t225 = 0;
    var mc_t104 = 0;
    var n = 0;
    var mc_t47 = 0;
    var mc_t224 = 0;
    var mc_t103 = 0;
    var mc_t48 = 0;
    var mc_t223 = 0;
    var mc_t102 = 0;
    var mc_t49 = 0;
    var mc_t178 = 0;
    var mc_t177 = 0;
    var mc_t176 = 0;
    var mc_t175 = 0;
    var mc_t174 = 0;
    var mc_t173 = 0;
    var mc_t172 = 0;
    var mc_t171 = 0;
    var mc_t179 = 0;
    var Cx = 0;
    var Cy = 0;
    var Cz = 0;
    var mc_t181 = 0;
    var mc_t180 = 0;
    var mc_t167 = 0;
    var mc_t166 = 0;
    var mc_t165 = 0;
    var mc_t164 = 0;
    var mc_t163 = 0;
    var mc_t162 = 0;
    var mc_t161 = 0;
    var mc_t160 = 0;
    var mc_t169 = 0;
    var mc_t168 = 0;
    var Dt = 0;
    var mc_t170 = 0;
    var mc_t156 = 0;
    var mc_t155 = 0;
    var mc_t154 = 0;
    var mc_t153 = 0;
    var mc_t152 = 0;
    var mc_t151 = 0;
    var mc_t150 = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t159 = 0;
    var mc_t14 = 0;
    var mc_t158 = 0;
    var mc_t15 = 0;
    var mc_t157 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var Ex = 0;
    var mc_t19 = 0;
    var Ey = 0;
    var Ez = 0;
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
    var mc_t149 = 0;
    var mc_t148 = 0;
    var mc_t268 = 0;
    var mc_t147 = 0;
    var mc_t146 = 0;
    var Hx = 0;
    var Hy = 0;
    var Hz = 0;
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
    var mc_t211 = 0;
    var mc_t210 = 0;
    var mc_t70 = 0;
    var Ets = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
    var mc_t73 = 0;
    var mc_t74 = 0;
    var mc_t219 = 0;
    var mu0 = 0;
    var mc_t75 = 0;
    var mc_t218 = 0;
    var mc_t76 = 0;
    var mc_t217 = 0;
    var mc_t77 = 0;
    var mc_t216 = 0;
    var mc_t215 = 0;
    var mc_t78 = 0;
    var mc_t214 = 0;
    var mc_t79 = 0;
    var mc_t213 = 0;
    var mc_t212 = 0;
    var mc_t200 = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t5 = 0;
    var mc_t60 = 0;
    var mc_t6 = 0;
    var mc_t61 = 0;
    var mc_t3 = 0;
    var mc_t62 = 0;
    var mc_t4 = 0;
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






























































    eps0 = 8.8541878000000000000e-12;

    mc_t13 = mc_pi();
    mc_t174 = 4.0000000000000000000e-07;
    mu0 = mc_t174 * mc_t13;

    c0 = 299792458;


    Cx = Nx / Lx;
    Cy = Ny / Ly;
    Cz = Nz / Lz;


    mc_t14 = c0 * nrm;
    mc_t175 = 1;
    Dt = mc_t175 / mc_t14;



    mc_t15 = Nx;
    mc_t176 = 1;
    mc_t16 = Ny + mc_t176;
    mc_t177 = 1;
    mc_t17 = Nz + mc_t177;
    Ex = mc_zeros(mc_t15, mc_t16, mc_t17);
    mc_t178 = 1;
    mc_t18 = Nx + mc_t178;
    mc_t19 = Ny;
    mc_t179 = 1;
    mc_t20 = Nz + mc_t179;
    Ey = mc_zeros(mc_t18, mc_t19, mc_t20);
    mc_t180 = 1;
    mc_t21 = Nx + mc_t180;
    mc_t181 = 1;
    mc_t22 = Ny + mc_t181;
    mc_t23 = Nz;
    Ez = mc_zeros(mc_t21, mc_t22, mc_t23);
    mc_t182 = 1;
    mc_t24 = Nx + mc_t182;
    mc_t25 = Ny;
    mc_t26 = Nz;
    Hx = mc_zeros(mc_t24, mc_t25, mc_t26);
    mc_t27 = Nx;
    mc_t183 = 1;
    mc_t28 = Ny + mc_t183;
    mc_t29 = Nz;
    Hy = mc_zeros(mc_t27, mc_t28, mc_t29);
    mc_t30 = Nx;
    mc_t31 = Ny;
    mc_t184 = 1;
    mc_t32 = Nz + mc_t184;
    Hz = mc_zeros(mc_t30, mc_t31, mc_t32);


    mc_t185 = 3;
    Ets = mc_zeros(Nt, mc_t185);


    mc_t186 = 1;
    mc_t187 = 1;
    mc_t188 = 2;
    mc_t189 = 2;
    Ex[(((mc_t187-1)+(25*(mc_t188-1)))+(525*(mc_t189-1)))] = mc_t186;
    mc_t190 = 2;
    mc_t191 = 2;
    mc_t192 = 1;
    mc_t193 = 2;
    Ey[(((mc_t191-1)+(26*(mc_t192-1)))+(520*(mc_t193-1)))] = mc_t190;
    mc_t194 = 3;
    mc_t195 = 2;
    mc_t196 = 2;
    mc_t197 = 1;
    Ez[(((mc_t195-1)+(26*(mc_t196-1)))+(546*(mc_t197-1)))] = mc_t194;


    mc_t268 = 1;
    for (n = mc_t268; n<=Nt; n = n+1) {

        mc_t33 = Hx;
        mc_t35 = Dt / mu0;
        mc_t198 = 1;
        mc_t52 = Nz + mc_t198;
        mc_t199 = 2;
        mc_t51 = mc_colon(mc_t199, mc_t52);
        mc_t48 = mc_slice_get(Ey, [MC_COLON, MC_COLON, mc_t51]);
        mc_t200 = 1;
        mc_t50 = mc_colon(mc_t200, Nz);
        mc_t49 = mc_slice_get(Ey, [MC_COLON, MC_COLON, mc_t50]);
        mc_t46 = mc_minus_MM(mc_t48, mc_t49);
        mc_t47 = Cz;
        mc_t37 = mc_mtimes_MS(mc_t46, mc_t47);
        mc_t201 = 1;
        mc_t45 = Ny + mc_t201;
        mc_t202 = 2;
        mc_t44 = mc_colon(mc_t202, mc_t45);
        mc_t41 = mc_slice_get(Ez, [MC_COLON, mc_t44, MC_COLON]);
        mc_t203 = 1;
        mc_t43 = mc_colon(mc_t203, Ny);
        mc_t42 = mc_slice_get(Ez, [MC_COLON, mc_t43, MC_COLON]);
        mc_t39 = mc_minus_MM(mc_t41, mc_t42);
        mc_t40 = Cy;
        mc_t38 = mc_mtimes_MS(mc_t39, mc_t40);
        mc_t36 = mc_minus_MM(mc_t37, mc_t38);
        mc_t34 = mc_mtimes_SM(mc_t35, mc_t36);
        Hx = mc_plus_MM(mc_t33, mc_t34);
        mc_t53 = Hy;
        mc_t55 = Dt / mu0;
        mc_t204 = 1;
        mc_t72 = Nx + mc_t204;
        mc_t205 = 2;
        mc_t71 = mc_colon(mc_t205, mc_t72);
        mc_t68 = mc_slice_get(Ez, [mc_t71, MC_COLON, MC_COLON]);
        mc_t206 = 1;
        mc_t70 = mc_colon(mc_t206, Nx);
        mc_t69 = mc_slice_get(Ez, [mc_t70, MC_COLON, MC_COLON]);
        mc_t66 = mc_minus_MM(mc_t68, mc_t69);
        mc_t67 = Cx;
        mc_t57 = mc_mtimes_MS(mc_t66, mc_t67);
        mc_t207 = 1;
        mc_t65 = Nz + mc_t207;
        mc_t208 = 2;
        mc_t64 = mc_colon(mc_t208, mc_t65);
        mc_t61 = mc_slice_get(Ex, [MC_COLON, MC_COLON, mc_t64]);
        mc_t209 = 1;
        mc_t63 = mc_colon(mc_t209, Nz);
        mc_t62 = mc_slice_get(Ex, [MC_COLON, MC_COLON, mc_t63]);
        mc_t59 = mc_minus_MM(mc_t61, mc_t62);
        mc_t60 = Cz;
        mc_t58 = mc_mtimes_MS(mc_t59, mc_t60);
        mc_t56 = mc_minus_MM(mc_t57, mc_t58);
        mc_t54 = mc_mtimes_SM(mc_t55, mc_t56);
        Hy = mc_plus_MM(mc_t53, mc_t54);
        mc_t73 = Hz;
        mc_t75 = Dt / mu0;
        mc_t210 = 1;
        mc_t92 = Ny + mc_t210;
        mc_t211 = 2;
        mc_t91 = mc_colon(mc_t211, mc_t92);
        mc_t88 = mc_slice_get(Ex, [MC_COLON, mc_t91, MC_COLON]);
        mc_t212 = 1;
        mc_t90 = mc_colon(mc_t212, Ny);
        mc_t89 = mc_slice_get(Ex, [MC_COLON, mc_t90, MC_COLON]);
        mc_t86 = mc_minus_MM(mc_t88, mc_t89);
        mc_t87 = Cy;
        mc_t77 = mc_mtimes_MS(mc_t86, mc_t87);
        mc_t213 = 1;
        mc_t85 = Nx + mc_t213;
        mc_t214 = 2;
        mc_t84 = mc_colon(mc_t214, mc_t85);
        mc_t81 = mc_slice_get(Ey, [mc_t84, MC_COLON, MC_COLON]);
        mc_t215 = 1;
        mc_t83 = mc_colon(mc_t215, Nx);
        mc_t82 = mc_slice_get(Ey, [mc_t83, MC_COLON, MC_COLON]);
        mc_t79 = mc_minus_MM(mc_t81, mc_t82);
        mc_t80 = Cx;
        mc_t78 = mc_mtimes_MS(mc_t79, mc_t80);
        mc_t76 = mc_minus_MM(mc_t77, mc_t78);
        mc_t74 = mc_mtimes_SM(mc_t75, mc_t76);
        Hz = mc_plus_MM(mc_t73, mc_t74);


        mc_t216 = 2;
        mc_t117 = mc_colon(mc_t216, Ny);
        mc_t217 = 2;
        mc_t118 = mc_colon(mc_t217, Nz);
        mc_t93 = mc_slice_get(Ex, [MC_COLON, mc_t117, mc_t118]);
        mc_t95 = Dt / eps0;
        mc_t218 = 2;
        mc_t115 = mc_colon(mc_t218, Ny);
        mc_t219 = 2;
        mc_t116 = mc_colon(mc_t219, Nz);
        mc_t110 = mc_slice_get(Hz, [MC_COLON, mc_t115, mc_t116]);
        mc_t220 = 1;
        mc_t114 = Ny - mc_t220;
        mc_t221 = 1;
        mc_t112 = mc_colon(mc_t221, mc_t114);
        mc_t222 = 2;
        mc_t113 = mc_colon(mc_t222, Nz);
        mc_t111 = mc_slice_get(Hz, [MC_COLON, mc_t112, mc_t113]);
        mc_t108 = mc_minus_MM(mc_t110, mc_t111);
        mc_t109 = Cy;
        mc_t97 = mc_mtimes_MS(mc_t108, mc_t109);
        mc_t223 = 2;
        mc_t106 = mc_colon(mc_t223, Ny);
        mc_t224 = 2;
        mc_t107 = mc_colon(mc_t224, Nz);
        mc_t101 = mc_slice_get(Hy, [MC_COLON, mc_t106, mc_t107]);
        mc_t225 = 2;
        mc_t103 = mc_colon(mc_t225, Ny);
        mc_t226 = 1;
        mc_t105 = Nz - mc_t226;
        mc_t227 = 1;
        mc_t104 = mc_colon(mc_t227, mc_t105);
        mc_t102 = mc_slice_get(Hy, [MC_COLON, mc_t103, mc_t104]);
        mc_t99 = mc_minus_MM(mc_t101, mc_t102);
        mc_t100 = Cz;
        mc_t98 = mc_mtimes_MS(mc_t99, mc_t100);
        mc_t96 = mc_minus_MM(mc_t97, mc_t98);
        mc_t94 = mc_mtimes_SM(mc_t95, mc_t96);
        mc_t3 = mc_plus_MM(mc_t93, mc_t94);
        mc_t228 = 2;
        mc_t7 = mc_colon(mc_t228, Ny);
        mc_t229 = 2;
        mc_t8 = mc_colon(mc_t229, Nz);
        mc_slice_set(Ex, mc_t3, [MC_COLON, mc_t7, mc_t8]);
        mc_t230 = 2;
        mc_t143 = mc_colon(mc_t230, Nx);
        mc_t231 = 2;
        mc_t144 = mc_colon(mc_t231, Nz);
        mc_t119 = mc_slice_get(Ey, [mc_t143, MC_COLON, mc_t144]);
        mc_t121 = Dt / eps0;
        mc_t232 = 2;
        mc_t141 = mc_colon(mc_t232, Nx);
        mc_t233 = 2;
        mc_t142 = mc_colon(mc_t233, Nz);
        mc_t136 = mc_slice_get(Hx, [mc_t141, MC_COLON, mc_t142]);
        mc_t234 = 2;
        mc_t138 = mc_colon(mc_t234, Nx);
        mc_t235 = 1;
        mc_t140 = Nz - mc_t235;
        mc_t236 = 1;
        mc_t139 = mc_colon(mc_t236, mc_t140);
        mc_t137 = mc_slice_get(Hx, [mc_t138, MC_COLON, mc_t139]);
        mc_t134 = mc_minus_MM(mc_t136, mc_t137);
        mc_t135 = Cz;
        mc_t123 = mc_mtimes_MS(mc_t134, mc_t135);
        mc_t237 = 2;
        mc_t132 = mc_colon(mc_t237, Nx);
        mc_t238 = 2;
        mc_t133 = mc_colon(mc_t238, Nz);
        mc_t127 = mc_slice_get(Hz, [mc_t132, MC_COLON, mc_t133]);
        mc_t239 = 1;
        mc_t131 = Nx - mc_t239;
        mc_t240 = 1;
        mc_t129 = mc_colon(mc_t240, mc_t131);
        mc_t241 = 2;
        mc_t130 = mc_colon(mc_t241, Nz);
        mc_t128 = mc_slice_get(Hz, [mc_t129, MC_COLON, mc_t130]);
        mc_t125 = mc_minus_MM(mc_t127, mc_t128);
        mc_t126 = Cx;
        mc_t124 = mc_mtimes_MS(mc_t125, mc_t126);
        mc_t122 = mc_minus_MM(mc_t123, mc_t124);
        mc_t120 = mc_mtimes_SM(mc_t121, mc_t122);
        mc_t4 = mc_plus_MM(mc_t119, mc_t120);
        mc_t242 = 2;
        mc_t9 = mc_colon(mc_t242, Nx);
        mc_t243 = 2;
        mc_t10 = mc_colon(mc_t243, Nz);
        mc_slice_set(Ey, mc_t4, [mc_t9, MC_COLON, mc_t10]);
        mc_t244 = 2;
        mc_t169 = mc_colon(mc_t244, Nx);
        mc_t245 = 2;
        mc_t170 = mc_colon(mc_t245, Ny);
        mc_t145 = mc_slice_get(Ez, [mc_t169, mc_t170, MC_COLON]);
        mc_t147 = Dt / eps0;
        mc_t246 = 2;
        mc_t167 = mc_colon(mc_t246, Nx);
        mc_t247 = 2;
        mc_t168 = mc_colon(mc_t247, Ny);
        mc_t162 = mc_slice_get(Hy, [mc_t167, mc_t168, MC_COLON]);
        mc_t248 = 1;
        mc_t166 = Nx - mc_t248;
        mc_t249 = 1;
        mc_t164 = mc_colon(mc_t249, mc_t166);
        mc_t250 = 2;
        mc_t165 = mc_colon(mc_t250, Ny);
        mc_t163 = mc_slice_get(Hy, [mc_t164, mc_t165, MC_COLON]);
        mc_t160 = mc_minus_MM(mc_t162, mc_t163);
        mc_t161 = Cx;
        mc_t149 = mc_mtimes_MS(mc_t160, mc_t161);
        mc_t251 = 2;
        mc_t158 = mc_colon(mc_t251, Nx);
        mc_t252 = 2;
        mc_t159 = mc_colon(mc_t252, Ny);
        mc_t153 = mc_slice_get(Hx, [mc_t158, mc_t159, MC_COLON]);
        mc_t253 = 2;
        mc_t155 = mc_colon(mc_t253, Nx);
        mc_t254 = 1;
        mc_t157 = Ny - mc_t254;
        mc_t255 = 1;
        mc_t156 = mc_colon(mc_t255, mc_t157);
        mc_t154 = mc_slice_get(Hx, [mc_t155, mc_t156, MC_COLON]);
        mc_t151 = mc_minus_MM(mc_t153, mc_t154);
        mc_t152 = Cy;
        mc_t150 = mc_mtimes_MS(mc_t151, mc_t152);
        mc_t148 = mc_minus_MM(mc_t149, mc_t150);
        mc_t146 = mc_mtimes_SM(mc_t147, mc_t148);
        mc_t5 = mc_plus_MM(mc_t145, mc_t146);
        mc_t256 = 2;
        mc_t11 = mc_colon(mc_t256, Nx);
        mc_t257 = 2;
        mc_t12 = mc_colon(mc_t257, Ny);
        mc_slice_set(Ez, mc_t5, [mc_t11, mc_t12, MC_COLON]);


        mc_t258 = 4;
        mc_t259 = 4;
        mc_t260 = 4;
        mc_t171 = Ex[(((mc_t258-1)+(25*(mc_t259-1)))+(525*(mc_t260-1)))];
        mc_t261 = 4;
        mc_t262 = 4;
        mc_t263 = 4;
        mc_t172 = Ey[(((mc_t261-1)+(26*(mc_t262-1)))+(520*(mc_t263-1)))];
        mc_t264 = 4;
        mc_t265 = 4;
        mc_t266 = 4;
        mc_t173 = Ez[(((mc_t264-1)+(26*(mc_t265-1)))+(546*(mc_t266-1)))];
        mc_t6 = mc_horzcat(mc_t171, mc_t172, mc_t173);
        mc_slice_set(Ets, mc_t6, [n, MC_COLON]);
    }

    return [Ex, Ey, Ez, Hx, Hy, Hz, Ets];
}
drv_fdtd_S(1);
