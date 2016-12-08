const DimensionError = require('../error').DimensionError;
const eq = require('../array/equals');
const dim = require('./dimension');


function multiply(a, b) {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return _multiply(a, b);
    } else {
      return _scale(b, a);
    }
  } else if (Array.isArray(b)) {
    if (Array.isArray(a)) {
      return _multiply(a, b);
    } else {
      return _scale(a, b);
    }
  } else {
    return a * b;
  }
}


function _multiply(a, b) {
  let res = [];

  let aDim = dim(a);
  let bDim = dim(b);

  if (!eq(aDim, bDim)) {
    throw DimensionError.unmatch(aDim, bDim);
  }

  for (let i = 0; i < a.length; i++) {
    res.push(multiply(a[i], b[i]));
  }

  return res;
}


function _scale(scalar, arr) {
  let res = [];

  for (let elem of arr) {
    if (Array.isArray(elem)) {
      res.push(_scale(scalar, elem));
    } else {
      res.push(scalar * elem);
    }
  }

  return res;
}


module.exports = multiply;
