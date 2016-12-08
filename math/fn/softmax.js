/*
 * x: number[]
 */

const operator = require('../operator');

const max = operator.max;
const sum = operator.sum;
const divide = operator.divide;

function softmax(x) {
  let y = [];
  let maxVal = max(x);

  for (let i = 0; i < x.length; i++) {
    y.push(Math.exp(x[i] - maxVal));
  }

  return divide(y, sum(y));
}

module.exports = softmax;
