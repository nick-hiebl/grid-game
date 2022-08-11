export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    
    return this;
  }

  multiply(factor) {
    this.x *= factor;
    this.y *= factor;

    return this;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  get magnitude() {
    return Math.hypot(this.x, this.y);
  }

  static add(a, b) {
    return new Vector(a.x + b.x, a.y - b.y);
  }

  static diff(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
  }

  static scale(vector, factor) {
    return new Vector(vector.x * factor, vector.y * factor);
  }

  static sqrDist(a, b) {
    const xDiff = a.x - b.x;
    const yDiff = a.y - b.y;
    return xDiff * xDiff + yDiff * yDiff;
  }

  static dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
}
