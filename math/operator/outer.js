function outer(v1, v2) {
  let res = [];
  for (let i = 0; i < v1.length; i++) {
    res.push([]);
    for (let j = 0; j < v2.length; j++) {
      res[i].push(v1[i] * v2[j]);
    }
  }

  return res;
}


module.exports = outer;
