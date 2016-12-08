const initializer = require('./_initializer');
const random = require('../random');

let generator = (min, max, rng) => {
  return random.uniform(min, max, rng);
}

function uniform(min = 0.0, max = 1.0, rng = Math.random, dimensions = null) {
  dimensions = dimensions || [];
  return initializer(generator.bind(null, min, max, rng), ...dimensions);
}

module.exports = uniform;
