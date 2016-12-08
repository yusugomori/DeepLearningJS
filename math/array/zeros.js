const initializer = require('./_initializer');

let generator = () => {
  return 0.0;
}

function zeros(...dimensions) {
  return initializer(generator, ...dimensions);
}


module.exports = zeros;
