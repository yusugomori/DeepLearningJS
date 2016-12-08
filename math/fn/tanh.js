/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _tanh(x) {
  return Math.tanh(x);
}

function _dtanh(x) {
  return 1 - Math.pow(_tanh(x), 2);
}

function tanh(x) {
  return dimensionizer(x, _tanh);
}

function dtanh(x) {
  return dimensionizer(x, _dtanh);
}


module.exports = tanh;
module.exports.grad = dtanh;
