function uniform(min = 0.0, max = 1.0, rng = Math.random) {
  return rng() * (max - min) + min;
}

module.exports = uniform;
