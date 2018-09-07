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

function drv_nb1d_S(scale){
    var seed = 0;
    var mc_t10 = 0;
    var mc_t11 = 0;
    var mc_t12 = 0;
    var mc_t13 = 0;
    var mc_t14 = 0;
    var mc_t15 = 0;
    var mc_t16 = 0;
    var mc_t17 = 0;
    var mc_t18 = 0;
    var mc_t19 = 0;
    var T = 0;
    var mc_t9 = 0;
    var mc_t7 = 0;
    var Vx = 0;
    var mc_t8 = 0;
    var Vy = 0;
    var mc_t5 = 0;
    var Vz = 0;
    var mc_t6 = 0;
    var mc_t3 = 0;
    var Rx = 0;
    var mc_t4 = 0;
    var Ry = 0;
    var mc_t1 = 0;
    var Rz = 0;
    var mc_t2 = 0;
    var mc_t20 = 0;
    var mc_t21 = 0;
    var mc_t87 = 0;
    var mc_t0 = 0;
    var mc_t22 = 0;
    var mc_t23 = 0;
    var mc_t24 = 0;
    var m = 0;
    var n = 0;
    var mc_t25 = 0;
    var mc_t26 = 0;
    var dT = 0;
    var mc_t27 = 0;
    var Fx = 0;
    var Fy = 0;
    var Fz = 0;





    seed = 1;

    mc_t10 = 0.40000000000000000000;
    mc_t1 = mc_mpower_SS(scale, mc_t10);
    mc_t11 = 30;
    mc_t0 = mc_t1 * mc_t11;
    n = mc_round_S(mc_t0);

    mc_t12 = 0.50000000000000000000;
    mc_t13 = 0.083300000000000000000;
    dT = mc_t12 * mc_t13;
    mc_t14 = 0.50000000000000000000;
    mc_t15 = 32.436200000000000000;
    mc_t2 = mc_t14 * mc_t15;
    mc_t3 = mc_sqrt_S(scale);
    T = mc_t2 * mc_t3;
    mc_t16 = 1;
    mc_t17 = 0.10000000000000000000;
    mc_t4 = rand1_SSS(n, mc_t16, mc_t17);
    mc_t18 = 1000.2300000000000000;
    Rx = mc_mtimes_MS(mc_t4, mc_t18);
    mc_t19 = 1;
    mc_t20 = 0.40000000000000000000;
    mc_t5 = rand1_SSS(n, mc_t19, mc_t20);
    mc_t21 = 1000.2300000000000000;
    Ry = mc_mtimes_MS(mc_t5, mc_t21);
    mc_t22 = 1;
    mc_t23 = 0.90000000000000000000;
    mc_t6 = rand1_SSS(n, mc_t22, mc_t23);
    mc_t24 = 1000.2300000000000000;
    Rz = mc_mtimes_MS(mc_t6, mc_t24);

    mc_t8 = n;
    mc_t25 = 0.40000000000000000000;
    mc_t9 = -mc_t25;
    mc_t26 = 1;
    mc_t7 = rand1_SSS(mc_t8, mc_t26, mc_t9);
    mc_t27 = 345;
    m = mc_mtimes_MS(mc_t7, mc_t27);

    mc_t87 = nbody1d_SMMMMSS(n, Rx, Ry, Rz, m, dT, T);
    Fx = mc_t87[0];
    Fy = mc_t87[1];
    Fz = mc_t87[2];
    Vx = mc_t87[3];
    Vy = mc_t87[4];
    Vz = mc_t87[5];

    return;
}

function rand1_SSS(m, n, seed){
    var mc_t80 = 0;
    var mc_t81 = 0;
    var mc_t82 = 0;
    var mc_t83 = 0;
    var mc_t73 = 0;
    var mc_t84 = 0;
    var mc_t74 = 0;
    var mc_t85 = 0;
    var mc_t75 = 0;
    var mc_t86 = 0;
    var i = 0;
    var j = 0;
    var mc_t76 = 0;
    var mc_t77 = 0;
    var mc_t78 = 0;
    var M = 0;
    var mc_t79 = 0;

    mc_t74 = seed;
    mc_t75 = m * n;
    seed = mc_t74 + mc_t75;
    M = mc_zeros(m, n);
    mc_t86 = 1;
    for (i = mc_t86; i<=m; i = i+1) {
        mc_t85 = 1;
        for (j = mc_t85; j<=n; j = j+1) {
            mc_t82 = 1;
            mc_t73 = mc_mod_SS(seed, mc_t82);
            M[((i-1)+(M.mj_stride()[1]*(j-1)))] = mc_t73;
            mc_t78 = seed;
            mc_t80 = M[((i-1)+(M.mj_stride()[1]*(j-1)))];
            mc_t83 = 100;
            mc_t81 = mc_sqrt_S(mc_t83);
            mc_t79 = mc_t80 * mc_t81;
            mc_t76 = mc_t78 + mc_t79;
            mc_t84 = 2;
            mc_t77 = mc_sqrt_S(mc_t84);
            seed = mc_t76 + mc_t77;
        }
    }
    return M;
}

function nbody1d_SMMMMSS(n, Rx, Ry, Rz, m, dT, T){
    var mc_t70 = 0;
    var mc_t71 = 0;
    var mc_t72 = 0;
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
    var mc_t60 = 0;
    var mc_t61 = 0;
    var mc_t62 = 0;
    var mc_t63 = 0;
    var mc_t64 = 0;
    var mc_t65 = 0;
    var dry = 0;
    var mc_t66 = 0;
    var drx = 0;
    var mc_t67 = 0;
    var fry = 0;
    var mc_t68 = 0;
    var drz = 0;
    var frx = 0;
    var mc_t69 = 0;
    var frz = 0;
    var mc_t28 = 0;
    var mc_t29 = 0;
    var ax = 0;
    var ay = 0;
    var az = 0;
    var mc_t50 = 0;
    var G = 0;
    var mc_t51 = 0;
    var mc_t52 = 0;
    var mc_t53 = 0;
    var mc_t54 = 0;
    var mc_t55 = 0;
    var mc_t56 = 0;
    var M = 0;
    var mc_t57 = 0;
    var mc_t58 = 0;
    var mc_t59 = 0;
    var Vx = 0;
    var Vy = 0;
    var Vz = 0;
    var f = 0;
    var mc_t40 = 0;
    var mc_t41 = 0;
    var mc_t42 = 0;
    var mc_t43 = 0;
    var k = 0;
    var mc_t44 = 0;
    var mc_t45 = 0;
    var mc_t46 = 0;
    var mc_t47 = 0;
    var mc_t48 = 0;
    var mc_t49 = 0;
    var Fx = 0;
    var r = 0;
    var Fy = 0;
    var Fz = 0;
    var t = 0;


























































    mc_t63 = 1;
    Fx = mc_zeros(n, mc_t63);
    mc_t64 = 1;
    Fy = mc_zeros(n, mc_t64);
    mc_t65 = 1;
    Fz = mc_zeros(n, mc_t65);

    mc_t66 = 1;
    Vx = mc_zeros(n, mc_t66);
    mc_t67 = 1;
    Vy = mc_zeros(n, mc_t67);
    mc_t68 = 1;
    Vz = mc_zeros(n, mc_t68);

    G = 1.0000000000000000000e-11;


    mc_t72 = 1;
    for (t = mc_t72; t<=T; t = t+dT) {
        mc_t71 = 1;
        for (k = mc_t71; k<=n; k = k+1) {




            mc_t31 = Rx;
            mc_t32 = Rx[(k-1)];
            drx = mc_minus_MS(mc_t31, mc_t32);
            mc_t33 = Ry;
            mc_t34 = Ry[(k-1)];
            dry = mc_minus_MS(mc_t33, mc_t34);
            mc_t35 = Rz;
            mc_t36 = Rz[(k-1)];
            drz = mc_minus_MS(mc_t35, mc_t36);




            mc_t39 = mc_times_MM(drx, drx);
            mc_t40 = mc_times_MM(dry, dry);
            mc_t37 = mc_plus_MM(mc_t39, mc_t40);
            mc_t38 = mc_times_MM(drz, drz);
            r = mc_plus_MM(mc_t37, mc_t38);
            mc_t69 = 1.0000000000000000000;
            r[(k-1)] = mc_t69;




            mc_t41 = m;
            mc_t42 = m[(k-1)];
            M = mc_mtimes_MS(mc_t41, mc_t42);
            mc_t70 = 0.0000000000000000000;
            M[(k-1)] = mc_t70;



            mc_t43 = G;
            mc_t44 = mc_rdivide_MM(M, r);
            f = mc_mtimes_SM(mc_t43, mc_t44);



            r = mc_sqrt_M(r);
            drx = mc_rdivide_MM(drx, r);
            dry = mc_rdivide_MM(dry, r);
            drz = mc_rdivide_MM(drz, r);



            frx = mc_times_MM(f, drx);
            fry = mc_times_MM(f, dry);
            frz = mc_times_MM(f, drz);

            mc_t45 = mc_mean(frx);
            mc_t46 = n;
            mc_t28 = mc_t45 * mc_t46;
            Fx[(k-1)] = mc_t28;
            mc_t47 = mc_mean(fry);
            mc_t48 = n;
            mc_t29 = mc_t47 * mc_t48;
            Fy[(k-1)] = mc_t29;
            mc_t49 = mc_mean(frz);
            mc_t50 = n;
            mc_t30 = mc_t49 * mc_t50;
            Fz[(k-1)] = mc_t30;

        }



        ax = mc_rdivide_MM(Fx, m);
        ay = mc_rdivide_MM(Fy, m);
        az = mc_rdivide_MM(Fz, m);



        mc_t51 = Vx;
        mc_t52 = mc_mtimes_MS(ax, dT);
        Vx = mc_plus_MM(mc_t51, mc_t52);
        mc_t53 = Vy;
        mc_t54 = mc_mtimes_MS(ay, dT);
        Vy = mc_plus_MM(mc_t53, mc_t54);
        mc_t55 = Vz;
        mc_t56 = mc_mtimes_MS(az, dT);
        Vz = mc_plus_MM(mc_t55, mc_t56);



        mc_t57 = Rx;
        mc_t58 = mc_mtimes_MS(Vx, dT);
        Rx = mc_plus_MM(mc_t57, mc_t58);
        mc_t59 = Ry;
        mc_t60 = mc_mtimes_MS(Vy, dT);
        Ry = mc_plus_MM(mc_t59, mc_t60);
        mc_t61 = Rz;
        mc_t62 = mc_mtimes_MS(Vz, dT);
        Rz = mc_plus_MM(mc_t61, mc_t62);

    }

    return [Fx, Fy, Fz, Vx, Vy, Vz];
}
drv_nb1d_S(1);
