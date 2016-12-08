const initializer = require('./_initializer');

let generator = () => {
  return 1.0;
}

function ones(...dimensions) {
  return initializer(generator, ...dimensions);
}


module.exports = ones;
