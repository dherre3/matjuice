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

function PNxx_Legendre_vectN_MS(x, n){
    var mc_t134 = 0;
    var mc_t133 = 0;
    var mc_t132 = 0;
    var mc_t131 = 0;
    var mc_t130 = 0;
    var mc_t173 = 0;
    var mc_t172 = 0;
    var mc_t171 = 0;
    var mc_t139 = 0;
    var mc_t138 = 0;
    var mc_t137 = 0;
    var mc_t136 = 0;
    var mc_t135 = 0;
    var mc_t167 = 0;
    var mc_t123 = 0;
    var mc_t122 = 0;
    var mc_t166 = 0;
    var mc_t121 = 0;
    var mc_t165 = 0;
    var mc_t164 = 0;
    var mc_t120 = 0;
    var mc_t163 = 0;
    var mc_t162 = 0;
    var mc_t161 = 0;
    var mc_t160 = 0;
    var mc_t129 = 0;
    var mc_t128 = 0;
    var mc_t127 = 0;
    var mc_t126 = 0;
    var mc_t169 = 0;
    var mc_t125 = 0;
    var PNxxa = 0;
    var mc_t168 = 0;
    var mc_t124 = 0;
    var mc_t170 = 0;
    var mc_t156 = 0;
    var mc_t112 = 0;
    var mc_t155 = 0;
    var mc_t154 = 0;
    var mc_t153 = 0;
    var mc_t152 = 0;
    var mc_t151 = 0;
    var mc_t150 = 0;
    var mc_t119 = 0;
    var mc_t118 = 0;
    var mc_t117 = 0;
    var mc_t116 = 0;
    var mc_t159 = 0;
    var mc_t115 = 0;
    var mc_t158 = 0;
    var mc_t114 = 0;
    var mc_t157 = 0;
    var mc_t113 = 0;
    var mc_t145 = 0;
    var mc_t144 = 0;
    var mc_t143 = 0;
    var mc_t142 = 0;
    var mc_t141 = 0;
    var mc_t140 = 0;
    var j = 0;
    var mc_t149 = 0;
    var mc_t148 = 0;
    var mc_t147 = 0;
    var mc_t146 = 0;













    mc_t116 = mc_length_M(x);
    mc_t142 = 1;
    mc_t117 = n + mc_t142;
    PNxxa = mc_zeros(mc_t116, mc_t117);
    mc_t143 = 0;
    mc_t144 = 1;
    mc_slice_set_scalar(PNxxa, mc_t143, [MC_COLON, mc_t144]);
    mc_t148 = 0;
    mc_t147 = n > mc_t148;
    if (mc_t147) {
        mc_t145 = 0;
        mc_t146 = 2;
        mc_slice_set_scalar(PNxxa, mc_t145, [MC_COLON, mc_t146]);
    }


    mc_t152 = 1;
    mc_t151 = n > mc_t152;
    if (mc_t151) {
        mc_t149 = 3;
        mc_t150 = 3;
        mc_slice_set_scalar(PNxxa, mc_t149, [MC_COLON, mc_t150]);
    }


    mc_t156 = 2;
    mc_t155 = n > mc_t156;
    if (mc_t155) {
        mc_t118 = mc_transpose(x);
        mc_t153 = 15;
        mc_t112 = mc_mtimes_SM(mc_t153, mc_t118);
        mc_t154 = 4;
        mc_slice_set(PNxxa, mc_t112, [MC_COLON, mc_t154]);
    }


    mc_t169 = 3;
    mc_t168 = n > mc_t169;
    if (mc_t168) {
        mc_t157 = 3;
        mc_t135 = n - mc_t157;
        mc_t167 = 1;
        for (j = mc_t167; j<=mc_t135; j = j+1) {
            mc_t158 = 1;
            mc_t134 = j + mc_t158;
            mc_t159 = 1;
            mc_t119 = mc_t159 / mc_t134;
            mc_t132 = j;
            mc_t160 = 5;
            mc_t161 = 2;
            mc_t133 = mc_t160 / mc_t161;
            mc_t131 = mc_t132 + mc_t133;
            mc_t162 = 2;
            mc_t129 = mc_t162 * mc_t131;
            mc_t130 = mc_transpose(x);
            mc_t126 = mc_mtimes_SM(mc_t129, mc_t130);
            mc_t163 = 3;
            mc_t128 = j + mc_t163;
            mc_t127 = mc_slice_get(PNxxa, [MC_COLON, mc_t128]);
            mc_t121 = mc_times_MM(mc_t126, mc_t127);
            mc_t164 = 4;
            mc_t123 = j + mc_t164;
            mc_t165 = 2;
            mc_t125 = j + mc_t165;
            mc_t124 = mc_slice_get(PNxxa, [MC_COLON, mc_t125]);
            mc_t122 = mc_mtimes_SM(mc_t123, mc_t124);
            mc_t120 = mc_minus_MM(mc_t121, mc_t122);
            mc_t113 = mc_mtimes_SM(mc_t119, mc_t120);
            mc_t166 = 4;
            mc_t115 = j + mc_t166;
            mc_slice_set(PNxxa, mc_t113, [MC_COLON, mc_t115]);
        }

    }


    mc_t170 = 1;
    mc_t141 = n + mc_t170;
    mc_t173 = 1;
    for (j = mc_t173; j<=mc_t141; j = j+1) {
        mc_t136 = mc_slice_get(PNxxa, [MC_COLON, j]);
        mc_t139 = j;
        mc_t171 = 1;
        mc_t172 = 2;
        mc_t140 = mc_t171 / mc_t172;
        mc_t138 = mc_t139 - mc_t140;
        mc_t137 = mc_sqrt_S(mc_t138);
        mc_t114 = mc_mtimes_MS(mc_t136, mc_t137);
        mc_slice_set(PNxxa, mc_t114, [MC_COLON, j]);
    }


    return PNxxa;
}

function PN_Legendre_vectN_MS(x, n){
    var mc_t50 = 0;
    var mc_t51 = 0;
    var mc_t30 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t31 = 0;
    var mc_t10 = 0;
    var mc_t32 = 0;
    var mc_t11 = 0;
    var mc_t33 = 0;
    var mc_t12 = 0;
    var mc_t34 = 0;
    var mc_t35 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t37 = 0;
    var mc_t15 = 0;
    var mc_t38 = 0;
    var mc_t16 = 0;
    var mc_t39 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var mc_t9 = 0;
    var PNa = 0;
    var mc_t7 = 0;
    var mc_t8 = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t42 = 0;
    var mc_t20 = 0;
    var j = 0;
    var mc_t43 = 0;
    var mc_t21 = 0;
    var mc_t44 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t45 = 0;
    var mc_t24 = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t25 = 0;
    var mc_t48 = 0;
    var mc_t26 = 0;
    var mc_t49 = 0;
    var mc_t27 = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;













    mc_t11 = mc_length_M(x);
    mc_t33 = 1;
    mc_t12 = n + mc_t33;
    PNa = mc_zeros(mc_t11, mc_t12);
    mc_t34 = 1;
    mc_t35 = 1;
    mc_slice_set_scalar(PNa, mc_t34, [MC_COLON, mc_t35]);
    mc_size(PNa);
    mc_t39 = 0;
    mc_t38 = n > mc_t39;
    if (mc_t38) {
        mc_t7 = mc_transpose(x);
        mc_t37 = 2;
        mc_slice_set(PNa, mc_t7, [MC_COLON, mc_t37]);
    }


    mc_t49 = 1;
    mc_t48 = n > mc_t49;
    if (mc_t48) {
        mc_t40 = 1;
        mc_t26 = n - mc_t40;
        mc_t47 = 1;
        for (j = mc_t47; j<=mc_t26; j = j+1) {
            mc_t41 = 1;
            mc_t25 = j + mc_t41;
            mc_t42 = 1;
            mc_t13 = mc_t42 / mc_t25;
            mc_t43 = 2;
            mc_t24 = mc_t43 * j;
            mc_t44 = 1;
            mc_t22 = mc_t24 + mc_t44;
            mc_t23 = mc_transpose(x);
            mc_t19 = mc_mtimes_SM(mc_t22, mc_t23);
            mc_t45 = 1;
            mc_t21 = j + mc_t45;
            mc_t20 = mc_slice_get(PNa, [MC_COLON, mc_t21]);
            mc_t15 = mc_times_MM(mc_t19, mc_t20);
            mc_t17 = j;
            mc_t18 = mc_slice_get(PNa, [MC_COLON, j]);
            mc_t16 = mc_mtimes_SM(mc_t17, mc_t18);
            mc_t14 = mc_minus_MM(mc_t15, mc_t16);
            mc_t8 = mc_mtimes_SM(mc_t13, mc_t14);
            mc_t46 = 2;
            mc_t10 = j + mc_t46;
            mc_slice_set(PNa, mc_t8, [MC_COLON, mc_t10]);
        }

    }


    mc_t50 = 1;
    mc_t32 = n + mc_t50;
    mc_t53 = 1;
    for (j = mc_t53; j<=mc_t32; j = j+1) {
        mc_t27 = mc_slice_get(PNa, [MC_COLON, j]);
        mc_t30 = j;
        mc_t51 = 1;
        mc_t52 = 2;
        mc_t31 = mc_t51 / mc_t52;
        mc_t29 = mc_t30 - mc_t31;
        mc_t28 = mc_sqrt_S(mc_t29);
        mc_t9 = mc_mtimes_MS(mc_t27, mc_t28);
        mc_slice_set(PNa, mc_t9, [MC_COLON, j]);
    }

    return PNa;
}

function drv_lgdr_S(scale){
    var PNa = 0;
    var PNxa = 0;
    var mc_t5 = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var mc_t4 = 0;
    var mc_t1 = 0;
    var x = 0;
    var mc_t2 = 0;
    var i = 0;
    var n = 0;
    var PNxxa = 0;



    mc_t1 = 0;
    mc_t2 = 0.30000000000000000000;
    mc_t3 = 0.90000000000000000000;
    mc_t4 = 0.70000000000000000000;
    mc_t5 = 0.50000000000000000000;
    x = mc_horzcat(mc_t1, mc_t2, mc_t3, mc_t4, mc_t5);
    n = 5;
    mc_t6 = 1;
    for (i = mc_t6; i<=scale; i = i+1) {
        PNa = PN_Legendre_vectN_MS(x, n);
        PNxa = PNx_Legendre_vectN_MS(x, n);
        PNxxa = PNxx_Legendre_vectN_MS(x, n);
    }

    return;
}

function PNx_Legendre_vectN_MS(x, n){
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
    var mc_t111 = 0;
    var PNxa = 0;
    var mc_t90 = 0;
    var mc_t110 = 0;
    var mc_t91 = 0;
    var mc_t92 = 0;
    var mc_t93 = 0;
    var mc_t94 = 0;
    var mc_t95 = 0;
    var mc_t96 = 0;
    var mc_t97 = 0;
    var mc_t54 = 0;
    var mc_t98 = 0;
    var mc_t99 = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var mc_t57 = 0;
    var mc_t58 = 0;
    var mc_t59 = 0;
    var mc_t101 = 0;
    var mc_t100 = 0;
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t84 = 0;
    var mc_t85 = 0;
    var mc_t109 = 0;
    var mc_t86 = 0;
    var mc_t108 = 0;
    var mc_t87 = 0;
    var mc_t107 = 0;
    var j = 0;
    var mc_t88 = 0;
    var mc_t106 = 0;
    var mc_t89 = 0;
    var mc_t105 = 0;
    var mc_t104 = 0;
    var mc_t103 = 0;
    var mc_t102 = 0;













    mc_t58 = mc_length_M(x);
    mc_t84 = 1;
    mc_t59 = n + mc_t84;
    PNxa = mc_zeros(mc_t58, mc_t59);
    mc_t85 = 0;
    mc_t86 = 1;
    mc_slice_set_scalar(PNxa, mc_t85, [MC_COLON, mc_t86]);
    mc_t90 = 0;
    mc_t89 = n > mc_t90;
    if (mc_t89) {
        mc_t87 = 1;
        mc_t88 = 2;
        mc_slice_set_scalar(PNxa, mc_t87, [MC_COLON, mc_t88]);
    }


    mc_t94 = 1;
    mc_t93 = n > mc_t94;
    if (mc_t93) {
        mc_t60 = mc_transpose(x);
        mc_t91 = 3;
        mc_t54 = mc_mtimes_SM(mc_t91, mc_t60);
        mc_t92 = 3;
        mc_slice_set(PNxa, mc_t54, [MC_COLON, mc_t92]);
    }


    mc_t107 = 2;
    mc_t106 = n > mc_t107;
    if (mc_t106) {
        mc_t95 = 2;
        mc_t77 = n - mc_t95;
        mc_t105 = 1;
        for (j = mc_t105; j<=mc_t77; j = j+1) {
            mc_t96 = 1;
            mc_t76 = j + mc_t96;
            mc_t97 = 1;
            mc_t61 = mc_t97 / mc_t76;
            mc_t74 = j;
            mc_t98 = 3;
            mc_t99 = 2;
            mc_t75 = mc_t98 / mc_t99;
            mc_t73 = mc_t74 + mc_t75;
            mc_t100 = 2;
            mc_t71 = mc_t100 * mc_t73;
            mc_t72 = mc_transpose(x);
            mc_t68 = mc_mtimes_SM(mc_t71, mc_t72);
            mc_t101 = 2;
            mc_t70 = j + mc_t101;
            mc_t69 = mc_slice_get(PNxa, [MC_COLON, mc_t70]);
            mc_t63 = mc_times_MM(mc_t68, mc_t69);
            mc_t102 = 2;
            mc_t65 = j + mc_t102;
            mc_t103 = 1;
            mc_t67 = j + mc_t103;
            mc_t66 = mc_slice_get(PNxa, [MC_COLON, mc_t67]);
            mc_t64 = mc_mtimes_SM(mc_t65, mc_t66);
            mc_t62 = mc_minus_MM(mc_t63, mc_t64);
            mc_t55 = mc_mtimes_SM(mc_t61, mc_t62);
            mc_t104 = 3;
            mc_t57 = j + mc_t104;
            mc_slice_set(PNxa, mc_t55, [MC_COLON, mc_t57]);
        }

    }


    mc_t108 = 1;
    mc_t83 = n + mc_t108;
    mc_t111 = 1;
    for (j = mc_t111; j<=mc_t83; j = j+1) {
        mc_t78 = mc_slice_get(PNxa, [MC_COLON, j]);
        mc_t81 = j;
        mc_t109 = 1;
        mc_t110 = 2;
        mc_t82 = mc_t109 / mc_t110;
        mc_t80 = mc_t81 - mc_t82;
        mc_t79 = mc_sqrt_S(mc_t80);
        mc_t56 = mc_mtimes_MS(mc_t78, mc_t79);
        mc_slice_set(PNxa, mc_t56, [MC_COLON, j]);
    }


    return PNxa;
}
drv_lgdr_S(1);
