const arange = require('./arange');
const ArgumentError = require('../error');


function subset(matrix, indices) {
  if (!Array.isArray(indices)) {
    throw new ArgumentError(indices, 'is not an array.');
  }

  if (!Array.isArray(indices[0])) {
    return matrix.slice(...indices);
  }

  let res = [];
  let range = arange(...indices[0]);

  for (let i of range) {
    res.push(matrix[i].slice(...indices[1]));
  }

  return res;
}

module.exports = subset;
