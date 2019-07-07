const Shapes = (function () {
  let pcs = 2.5;
  let eps = 0.01;

  class point {
    constructor(x = 0, y = 0) {
      if (x instanceof point) {
        this._x = x._x;
        this._y = x._y;

        return;
      }

      this._x = x;
      this._y = y;
    }

    /**
     * @param {{ _x: any; _y: any; }} p
     */
    set value(p) {
      console.assert(p instanceof point);
      this._x = p._x;
      this._y = p._y;
    }

    sub(p) {
      console.assert(p instanceof point);
      return new point(this._x - p._x, this._y - p._y);
    }

    add(p) {
      console.assert(p instanceof point);
      return new point(this._x + p._x, this._y + p._y);
    }

    dot(p) {
      console.assert(p instanceof point);
      return (this._x * p._x + this._y * p._y).toFixed(3);
    }

    cross(p) {
      console.assert(p instanceof point);
      return (this._x * p._y - p._x * this._y).toFixed(3);
    }

    getDistance(p) {
      console.assert(p instanceof point);
      return suport.getDistance(this._x, this._y, p._x, p._y).toFixed(3);
    }
  }

  class size {
    constructor(w = 0, h = 0) {
      this._w = w;
      this._h = h;
    }
  }

  class circle {
    constructor(p1 = new point(), r = 0) {
      this._p1 = p1;
      this._r = r;
    }

    contain(point) {
      if (Math.abs(this._p1.getDistance(point) - this._r) <= pcs) return true;
      return false;
    }

  }

  class polygon {
    constructor(...ps) {

      this._ps = ps;
    }

    push(p) {
      this._ps.push(p);
      return this;
    }

    contain(p) {

      let flag = false;
      let P1 = new point();
      let P2 = new point();

      for (let i = this._ps.length - 1, j = 0;
        j < this._ps.length;
        i = j, j++) {

        P1 = this._ps[i];
        P2 = this._ps[j];
        // if (new Line(P1, P2).onsegment(p)) return true;

        if (p._y < suport.min(P1._y, P2._y) || p._y > suport.max(P1._y, P2._y)) continue;

        if (Math.abs(P1._y - P1._y) <= eps && Math.abs(p._y - P1._y) <= eps) continue;

        if (Math.abs(p._y - P1._y) <= eps && P1._y === suport.max(P1._y, P2._y)) {
          flag = !flag;
          continue;
        }

        if (p._x < P1._x + (p._y - P1._y) * (P2._x - P1._x) / (P2._y - P1._y)) {
          flag = !flag;
        }
      }
      return flag;
    }

  }

  return {
    point: point,
    size: size,
    circle: circle,
    polygon: polygon
  }
})();