function argmax(v) {
  let index = 0;
  let max = v[index];

  for (let i = 1; i < v.length; i++) {
    if (max < v[i]) {
      max = v[i];
      index = i;
    }
  }

  return index;
}


module.exports = argmax;
