function flatten(matrix) {
  return Array.prototype.concat.apply([], matrix);
}

module.exports = flatten;
