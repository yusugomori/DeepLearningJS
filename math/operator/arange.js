function arange(start, end = null) {
  let res = [];
  if (!end) {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i++) {
    res.push(i);
  }

  return res;
}

module.exports = arange;
