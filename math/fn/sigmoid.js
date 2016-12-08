/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _sigmoid(x) {
  return 1 / (1 + Math.pow(Math.E, -x));
}

function _dsigmoid(x) {
  return _sigmoid(x) * (1 - _sigmoid(x));
}

function sigmoid(x) {
  return dimensionizer(x, _sigmoid);
}

function dsigmoid(x) {
  return dimensionizer(x, _dsigmoid);
}


module.exports = sigmoid;
module.exports.grad = dsigmoid;
