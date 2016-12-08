class ArgumentError extends Error {
  constructor(a, str = 'does not satisfy requirements') {
    let log = `Argument ${a} (${typeof a}) ${str}.`;
    super(log);
  }
}

module.exports = ArgumentError;
