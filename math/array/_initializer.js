function _initializer(generator, ...dimensions) {
  let arr = [];
  let dims = [...dimensions];
  let dim = dims.shift();

  for (let i = 0; i < dim; i++) {
    if (dims.length === 0) {
      arr.push(generator());
    } else {
      arr.push(_initializer(generator, ...dims));
    }
  }

  return arr;
}


module.exports = _initializer;
