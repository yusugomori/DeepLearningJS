/*
 *  value: number | number[]([]+)?
 *  fn: Function
 */

function _dimensionize(value, fn) {
  if (Array.isArray(value)) {
    let _res = [];
    for (let _row of value) {
      _res.push(_dimensionize(_row, fn));
    }
    return _res;
  } else {
    return fn(value);
  }
}


module.exports = _dimensionize;
