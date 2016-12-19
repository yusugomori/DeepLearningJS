/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _lrelu(x) {
  return (x < 0) ? 0.01 * x : x;
}

function _dlrelu(x) {
  return (x < 0) ? 0.01 : 1;
}

function lrelu(x) {
  return dimensionizer(x, _lrelu);
}

function dlrelu(x) {
  return dimensionizer(x, _dlrelu);
}


module.exports = lrelu;
module.exports.grad = dlrelu;
