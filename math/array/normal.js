const initializer = require('./_initializer');
const random = require('../random');

let generator = (loc, scale, rng) => {
  return random.normal(loc, scale, rng);
}

function normal(loc = 0.0, scale = 1.0, rng = Math.random, dimensions = null) {
  dimensions = dimensions || [];
  return initializer(generator.bind(null, loc, scale, rng), ...dimensions);
}

module.exports = normal;
