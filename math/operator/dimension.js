// a: array (tensor)

function dimension(a, dim = null) {
  if (!Array.isArray(a)) {
    return [];
  }

  dim = dim || [];
  dim.push(a.length);
  if (Array.isArray(a[0])) {
    dimension(a[0], dim);
  }
  return dim;
}


module.exports = dimension;
