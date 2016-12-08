const math = require('./math');

class RNN {
  constructor(nIn, nHidden, nOut, truncatedTime = 3, learningRate = 0.1, activation = math.fn.tanh, rng = Math.random) {
    this.nIn = nIn;
    this.nHidden = nHidden;
    this.nOut = nOut;
    this.truncatedTime = truncatedTime;
    this.learningRate = learningRate;
    this.activation = activation;

    // this._activationOutput = (nOut === 1) ? math.fn.sigmoid : math.fn.softmax;

    this.U = math.array.uniform(-Math.sqrt(1/nIn), Math.sqrt(1/nIn), rng, [nHidden, nIn]);  // input -> hidden
    this.V = math.array.uniform(-Math.sqrt(1/nHidden), Math.sqrt(1/nHidden), rng, [nOut, nHidden]);  // hidden -> output
    this.W = math.array.uniform(-Math.sqrt(1/nHidden), Math.sqrt(1/nHidden), rng, [nHidden, nHidden]);  // hidden -> hidden

    this.b = math.array.zeros(nHidden);  // hidden bias
    this.c = math.array.zeros(nOut);  // output bias
  }

  // x: number[][]  ( number[time][index] )
  forwardProp(x) {
    let timeLength = x.length;

    let s = math.array.zeros(timeLength, this.nHidden);
    let u = math.array.zeros(timeLength, this.nHidden);
    let y = math.array.zeros(timeLength, this.nOut);
    let v = math.array.zeros(timeLength, this.nOut);

    for (let t = 0; t < timeLength; t++) {
      let _st = (t === 0) ? math.array.zeros(this.nHidden) : s[t - 1];
      u[t] = math.add(math.add(math.dot(this.U, x[t]), math.dot(this.W, _st)), this.b);
      s[t] = this.activation(u[t]);

      v[t] = math.add(math.dot(this.V, s[t]), this.c)
      // y[t] = this._activationOutput(this.v[t]);
      y[t] = math.fn.linear(v[t]);
    }

    return {
      s: s,
      u: u,
      y: y,
      v: v
    };
  }

  backProp(x, label) {
    let dU = math.array.zeros(this.nHidden, this.nIn);
    let dV = math.array.zeros(this.nOut, this.nHidden);
    let dW = math.array.zeros(this.nHidden, this.nHidden);
    let db = math.array.zeros(this.nHidden);
    let dc = math.array.zeros(this.nOut);

    let timeLength = x.length;
    let units = this.forwardProp(x);
    let s = units.s;
    let u = units.u;
    let y = units.y;
    let v = units.v;

    // let eo = math.mul(math.sub(o, label), this._activationOutput.grad(this.v));
    let eo = math.mul(math.sub(y, label), math.fn.linear.grad(v));
    let eh = math.array.zeros(timeLength, this.nHidden);

    for (let t = timeLength - 1; t >= 0; t--) {
      dV = math.add(dV, math.outer(eo[t], s[t]));
      dc = math.add(dc, eo[t]);
      eh[t] = math.mul(math.dot(eo[t], this.V), this.activation.grad(u[t]));

      for (let z = 0; z < this.truncatedTime; z++) {
        if (t - z < 0) {
          break;
        }

        dU = math.add(dU, math.outer(eh[t - z], x[t - z]));
        db = math.add(db, eh[t - z]);

        if (t - z - 1 >= 0) {
          dW = math.add(dW, math.outer(eh[t - z], s[t - z - 1]));
          eh[t - z - 1] = math.mul(math.dot(eh[t - z], this.W), this.activation.grad(u[t - z - 1]));
        }
      }
    }

    return {
      grad: {
        U: dU,
        V: dV,
        W: dW,
        b: db,
        c: dc
      }
    };
  }

  sgd(x, label, learningRate) {
    learningRate = learningRate || this.learningRate;
    let grad = this.backProp(x, label).grad;

    this.U = math.sub(this.U, math.mul(learningRate, grad.U));
    this.V = math.sub(this.V, math.mul(learningRate, grad.V));
    this.W = math.sub(this.W, math.mul(learningRate, grad.W));
    this.b = math.sub(this.b, math.mul(learningRate, grad.b));
    this.c = math.sub(this.c, math.mul(learningRate, grad.c));
  }

  predict(x) {
    let units = this.forwardProp(x);
    return units.y;
  }
}


module.exports = RNN;
