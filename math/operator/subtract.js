const DimensionError = require('../error').DimensionError;
const eq = require('../array/equals');
const dim = require('./dimension');


function subtract(a, b) {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return _subtract(a, b);
    } else {
      return _trans(b, a);
    }
  } else if (Array.isArray(b)) {
    if (Array.isArray(a)) {
      return _subtract(a, b);
    } else {
      return _trans(a, b);
    }
  } else {
    return a - b;
  }
}


function _subtract(a, b) {
  let res = [];

  let aDim = dim(a);
  let bDim = dim(b);

  if (!eq(aDim, bDim)) {
    throw DimensionError.unmatch(aDim, bDim);
  }

  for (let i = 0; i < a.length; i++) {
    res.push(subtract(a[i], b[i]));
  }

  return res;
}


function _trans(scalar, arr) {
  let res = [];

  for (let elem of arr) {
    if (Array.isArray(elem)) {
      res.push(_trans(scalar, elem));
    } else {
      res.push(-scalar + elem);
    }
  }

  return res;
}


module.exports = subtract;
