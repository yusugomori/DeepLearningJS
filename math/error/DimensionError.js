class DimensionError extends Error {
  constructor(a, b, str = 'do not match') {
    let log = `Dimension ${String(a)} and ${String(b)} ${str}.`;
    super(log);
  }

  static unmatch(a, b) {
    return new DimensionError(a, b);
  }

  static unsatisfy(a, b) {
    return new DimensionError(a, b, 'does not satisfy requirements');
  }
}

module.exports = DimensionError;
