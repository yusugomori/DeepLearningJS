function max(v) {
  let max = v[0];
  for (let val of v) {
    if (max < val) {
      max = val;
    }
  }

  return max;
}


module.exports = max;
