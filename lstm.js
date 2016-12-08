const math = require('./math');


class LSTM {
  constructor(nIn, nHidden, nOut, learningRate, activation = math.fn.tanh, rng = Math.random) {
    this.nIn = nIn;
    this.nHidden = nHidden;
    this.nOut = nOut;
    this.learningRate = learningRate;
    this.activation = activation;

    this.Wc = math.array.uniform(-Math.sqrt(1/nIn), Math.sqrt(1/nIn), rng, [nHidden, nIn]);
    this.Wi = math.array.uniform(-Math.sqrt(1/nIn), Math.sqrt(1/nIn), rng, [nHidden, nIn]);
    this.Wf = math.array.uniform(-Math.sqrt(1/nIn), Math.sqrt(1/nIn), rng, [nHidden, nIn]);
    this.Wo = math.array.uniform(-Math.sqrt(1/nIn), Math.sqrt(1/nIn), rng, [nHidden, nIn]);

    this.Uc = math.array.uniform(-Math.sqrt(1/nHidden), Math.sqrt(1/nHidden), rng, [nHidden, nHidden]);
    this.Ui = math.array.uniform(-Math.sqrt(1/nHidden), Math.sqrt(1/nHidden), rng, [nHidden, nHidden]);
    this.Uf = math.array.uniform(-Math.sqrt(1/nHidden), Math.sqrt(1/nHidden), rng, [nHidden, nHidden]);
    this.Uo = math.array.uniform(-Math.sqrt(1/nHidden), Math.sqrt(1/nHidden), rng, [nHidden, nHidden]);

    this.bc = math.array.zeros(nHidden);
    this.bi = math.array.zeros(nHidden);
    this.bf = math.array.zeros(nHidden);
    this.bo = math.array.zeros(nHidden);

    this.V = math.array.uniform(-Math.sqrt(1/nHidden), Math.sqrt(1/nHidden), rng, [nOut, nHidden]);
    this.b = math.array.zeros(nOut);
  }

  forwardProp(x) {
    let timeLength = x.length;

    let pre = {
      a: math.array.zeros(timeLength, this.nHidden),
      i: math.array.zeros(timeLength, this.nHidden),
      f: math.array.zeros(timeLength, this.nHidden),
      o: math.array.zeros(timeLength, this.nHidden),
      y: math.array.zeros(timeLength, this.nOut)
    };

    let a = math.array.zeros(timeLength, this.nHidden);
    let i = math.array.zeros(timeLength, this.nHidden);
    let f = math.array.zeros(timeLength, this.nHidden);
    let o = math.array.zeros(timeLength, this.nHidden);

    let c = math.array.zeros(timeLength, this.nHidden);
    let h = math.array.zeros(timeLength, this.nHidden);

    let y = math.array.zeros(timeLength, this.nOut);

    for (let t = 0; t < timeLength; t++) {
      let _ht = (t === 0) ? math.array.zeros(this.nHidden) : h[t - 1];
      pre.a[t] = math.add(math.add(math.dot(this.Wc, x[t]), math.dot(this.Uc, _ht)), this.bc);
      pre.i[t] = math.add(math.add(math.dot(this.Wi, x[t]), math.dot(this.Ui, _ht)), this.bi);
      pre.f[t] = math.add(math.add(math.dot(this.Wf, x[t]), math.dot(this.Uf, _ht)), this.bf);
      pre.o[t] = math.add(math.add(math.dot(this.Wo, x[t]), math.dot(this.Uo, _ht)), this.bo);

      a[t] = this.activation(pre.a[t]);
      i[t] = math.fn.sigmoid(pre.i[t]);
      f[t] = math.fn.sigmoid(pre.f[t]);
      o[t] = math.fn.sigmoid(pre.o[t]);

      if (t !== 0) {
        c[t] = math.add(math.mul(i[t], a[t]), math.mul(f[t], c[t - 1]));
      }

      h[t] = math.mul(o[t], this.activation(c[t]));

      pre.y[t] = math.add(math.dot(this.V, h[t]), this.b);

      // y[t] = math.fn.softmax(pre.y[t]);
      y[t] = math.fn.linear(pre.y[t]);
    }

    return {
      a: a,
      i: i,
      f: f,
      o: o,
      c: c,
      h: h,
      y: y,
      pre: pre
    };
  }

  backProp(x, label) {
    let dV = math.array.zeros(this.nOut, this.nHidden);
    let db = math.array.zeros(this.nOut);

    let timeLength = x.length;
    let units = this.forwardProp(x);
    let a = units.a;
    let i = units.i;
    let f = units.f;
    let o = units.o;
    let c = units.c;
    let h = units.h;
    let y = units.y;
    let pre = units.pre;

    let W = this._packW();
    let dW = math.array.zeros(this.nHidden * 4, this.nIn + this.nHidden + 1);
    let z = math.array.zeros(timeLength, this.nIn + this.nHidden + 1);
    let s = math.array.zeros(timeLength, this.nHidden * 4);

    let delta = {
      o: math.sub(y, label),
      h: math.mul(math.sub(y, label), math.fn.linear.grad(pre.y))
      // h: math.mul(math.sub(y, label), math.fn.softmax.grad(pre.y))
    };

    let e = {
      a: math.array.zeros(timeLength, this.nHidden),  // input error of LSTM block
      i: math.array.zeros(timeLength, this.nHidden),  // input gate
      f: math.array.zeros(timeLength, this.nHidden),  // forget gate
      o: math.array.zeros(timeLength, this.nHidden),  // output gate
      c: math.array.zeros(timeLength, this.nHidden),  // cell
      h: math.array.zeros(timeLength, this.nHidden),  // output error of LSTM block
      pre: {
        a: math.array.zeros(timeLength, this.nHidden),
        i: math.array.zeros(timeLength, this.nHidden),
        f: math.array.zeros(timeLength, this.nHidden),
        o: math.array.zeros(timeLength, this.nHidden),
      },

      s: math.array.zeros(timeLength, this.nHidden * 4),  // pack errors above
      z: math.array.zeros(timeLength, this.nIn + this.nHidden + 1)  // error for z: [x(t), h(t-1), 1] below
    };

    for (let t = timeLength - 1; t >= 0; t--) {
      dV = math.add(dV, math.outer(delta.o[t], h[t]));
      db = math.add(db, delta.o[t]);

      e.h[t] = math.dot(delta.h[t], this.V);

      e.o[t] = math.mul(e.h[t], this.activation(c[t]));
      let _ec = math.mul(math.mul(e.h[t], o[t]), this.activation.grad(c[t]));
      e.c[t] = math.add(e.c[t], _ec);

      if (t !== 0) {
        e.c[t - 1] = math.mul(e.c[t], f[t]);
        e.f[t] = math.mul(e.c[t], c[t - 1]);
      }
      e.i[t] = math.mul(e.c[t], a[t]);

      e.a[t] = math.mul(e.c[t], i[t]);

      e.pre.a[t] = math.mul(e.a[t], this.activation.grad(pre.a[t]));
      e.pre.i[t] = math.mul(e.i[t], math.fn.sigmoid.grad(pre.i[t]));
      e.pre.f[t] = math.mul(e.f[t], math.fn.sigmoid.grad(pre.f[t]));
      e.pre.o[t] = math.mul(e.o[t], math.fn.sigmoid.grad(pre.o[t]));

      let _ht = (t === 0) ? math.array.zeros(this.nHidden) : h[t - 1];
      e.s[t] = e.pre.a[t].concat(e.pre.i[t], e.pre.f[t], e.pre.o[t]);
      z[t] = x[t].concat(_ht, [1]);

      s[t] = math.dot(z[t], math.T(W));
      e.z[t] = math.dot(e.s[t], W);

      dW = math.add(dW, math.outer(e.s[t], z[t]));
    }

    return {
      grad: {
        W: dW,
        V: dV,
        b: db
      }
    };
  }

  sgd(x, label, learningRate) {
    learningRate = learningRate || this.learningRate;
    let grad = this.backProp(x, label).grad;
    let dW = grad.W;
    let dV = grad.V;
    let db = grad.b;

    let index = {
      row: {
        c: this.nHidden,
        i: this.nHidden * 2,
        f: this.nHidden * 3,
        o: this.nHidden * 4
      },
      col: {
        W: this.nIn,
        U: this.nIn + this.nHidden,
        b: this.nIn + this.nHidden + 1
      }
    };

    let dWc = math.subset(dW, [[          0, index.row.c], [0, index.col.W]]);
    let dWi = math.subset(dW, [[index.row.c, index.row.i], [0, index.col.W]]);
    let dWf = math.subset(dW, [[index.row.i, index.row.f], [0, index.col.W]]);
    let dWo = math.subset(dW, [[index.row.f, index.row.o], [0, index.col.W]]);

    let dUc = math.subset(dW, [[          0, index.row.c], [index.col.W, index.col.U]]);
    let dUi = math.subset(dW, [[index.row.c, index.row.i], [index.col.W, index.col.U]]);
    let dUf = math.subset(dW, [[index.row.i, index.row.f], [index.col.W, index.col.U]]);
    let dUo = math.subset(dW, [[index.row.f, index.row.o], [index.col.W, index.col.U]]);

    let dbc = math.flatten(math.subset(dW, [[          0, index.row.c], [index.col.U, index.col.b]]));
    let dbi = math.flatten(math.subset(dW, [[index.row.c, index.row.i], [index.col.U, index.col.b]]));
    let dbf = math.flatten(math.subset(dW, [[index.row.i, index.row.f], [index.col.U, index.col.b]]));
    let dbo = math.flatten(math.subset(dW, [[index.row.f, index.row.o], [index.col.U, index.col.b]]));

    this.Wc = math.sub(this.Wc, math.mul(learningRate, dWc));
    this.Wi = math.sub(this.Wi, math.mul(learningRate, dWi));
    this.Wf = math.sub(this.Wf, math.mul(learningRate, dWf));
    this.Wo = math.sub(this.Wo, math.mul(learningRate, dWo));

    this.Uc = math.sub(this.Uc, math.mul(learningRate, dUc));
    this.Ui = math.sub(this.Ui, math.mul(learningRate, dUi));
    this.Uf = math.sub(this.Uf, math.mul(learningRate, dUf));
    this.Uo = math.sub(this.Uo, math.mul(learningRate, dUo));

    this.bc = math.sub(this.bc, math.mul(learningRate, dbc));
    this.bi = math.sub(this.bi, math.mul(learningRate, dbi));
    this.bf = math.sub(this.bf, math.mul(learningRate, dbf));
    this.bo = math.sub(this.bo, math.mul(learningRate, dbo));

    this.V = math.sub(this.V, math.mul(learningRate / x.length, dV));
    this.b = math.sub(this.b, math.mul(learningRate / x.length, db));
  }

  _packW() {
    let W = math.array.zeros(this.nHidden * 4, this.nIn + this.nHidden + 1);

    let subset = (index, w, u, b) => {
      let i = index * this.nHidden;
      for (let j = 0; j < this.nHidden; j++) {
        W[i + j] = w[j].concat(u[j], b[j]);
      }
    };

    for (let index of [0, 1, 2, 3]) {
      switch (index) {
        case 0:
          subset(index, this.Wc, this.Uc, this.bc);
          break;
        case 1:
          subset(index, this.Wi, this.Ui, this.bi);
          break;
        case 2:
          subset(index, this.Wf, this.Uf, this.bf);
          break;
        case 3:
          subset(index, this.Wo, this.Uo, this.bo);
          break;
        default:
          break;
      }
    }
    return W;
  }

  predict(x) {
    let units = this.forwardProp(x);
    return units.y;
  }
}

module.exports = LSTM;
