function min(v) {
  let min = v[0];
  for (let val of v) {
    if (min > val) {
      min = val;
    }
  }

  return min;
}


module.exports = min;
