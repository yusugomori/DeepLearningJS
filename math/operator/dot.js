// TODO: support n-dim array

const DimensionError = require('../error').DimensionError;
const dim = require('./dimension');
const transpose = require('./transpose');


function dot(a, b) {
  let aDim = dim(a);
  let bDim = dim(b);

  if (aDim.length === 1) {  // (vector dot vector) or (vector dot matrix)

    if (aDim[0] !== bDim[0]) {
      _unsatisfy(aDim, bDim);
    }

    if (bDim.length === 1) {
      return _dot(a, b);
    } else {
      let _res = [];
      for (let _v of transpose(b)) {
        _res.push(_dot(a, _v));
      }
      return _res;
    }

  } else {  // (matrix dot vector) or (matrix dot matrix)

    if (aDim[aDim.length - 1] !== bDim[0]) {
      _unsatisfy(aDim, bDim);
    }

    let _res = [];

    if (bDim.length === 1) {
      for (let _v of a) {
        _res.push(_dot(_v, b));
      }
    } else {
      let _b = transpose(b);
      for (let _v1 of a) {
        let _v = [];
        for (let _v2 of _b) {
          _v.push(_dot(_v1, _v2));
        }
        _res.push(_v)
      }
    }

    return _res;
  }
}


function _dot(v1, v2) {
  let sum = 0.0;
  for (let i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
  }

  return sum;
}

function _unsatisfy(a, b) {
  throw DimensionError.unsatisfy(a, b);
}


module.exports = dot;
