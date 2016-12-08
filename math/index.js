const operator = require('./operator');

module.exports = {
  array:     require('./array'),
  error:     require('./error'),
  fn:        require('./fn'),
  operator:  operator,
  random:    require('./random'),

  // aliases
  // dimension: operator.dimension,
  // dim:       operator.dim,
  // dot:       operator.dot,
  // multiply:  operator.multiply,
  // mul:       operator.mul,
  // transpose: operator.transpose,
  // T:         operator.T
};


for (let name of Object.getOwnPropertyNames(operator)) {
  module.exports[name] = operator[name];
}
