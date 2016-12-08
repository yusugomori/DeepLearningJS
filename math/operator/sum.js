function sum(v) {
  let res = 0.0;
  for (let val of v) {
    res += val;
  }

  return res;
}


module.exports = sum;
