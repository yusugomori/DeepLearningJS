function equals(a, b) {
  let len = a.length;
  if (len !== b.length) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    let _a = a[i];
    let _b = b[i];
    if (Array.isArray(_a)) {
      if (Array.isArray(_b)) {
        return equals(_a, _b);
      } else {
        return false;
      }
    } else {
      if (_a !== _b) {
        return false;
      }
    }
  }

  return true;
}


module.exports = equals;
