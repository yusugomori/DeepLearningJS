/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _linear(x) {
  return x;
}

function _dlinear(x) {
  return 1;
}


function linear(x) {
  return dimensionizer(x, _linear);
}

function dlinear(x) {
  return dimensionizer(x, _dlinear);
}


module.exports = linear;
module.exports.grad = dlinear;
