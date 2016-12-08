function normal(loc = 0.0, scale = 1.0, rng = Math.random) {
  return Math.sqrt(-1 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());
}

module.exports = normal;
