const dimension = require('./dimension');
const zeros = require('../array/zeros');

function transpose(a) {
  let reverses = dimension(a).reverse();
  let res = zeros(...reverses);

  _set(a, res, reverses)

  return res;
}


function _set(a, b, reverses, ...index) {
  let reverse = reverses.shift();

  for (let i = 0; i < reverse; i++) {
    let _indices = [i, ...index];

    if (reverses.length === 0) {
      b[i] = _getValue(a, ..._indices);
    } else {
      _set(a, b[i], reverses.concat(), ..._indices);
    }
  }
}


function _getValue(a, ...index) {
  let arr = a.concat();
  let indices = [...index];
  for (let i = 0; i < indices.length; i++) {
    arr = arr[indices[i]];
  }

  return arr;
}


module.exports = transpose;
