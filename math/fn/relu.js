/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _relu(x) {
  return (x < 0) ? 0 : x;
}

function _drelu(x) {
  return (x < 0) ? 0 : 1;
}

function relu(x) {
  return dimensionizer(x, _relu);
}

function drelu(x) {
  return dimensionizer(x, _drelu);
}


module.exports = relu;
module.exports.grad = drelu;
