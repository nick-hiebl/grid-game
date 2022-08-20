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
    return new Vector(a.x + b.x, a.y + b.y);
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

  static manhattanDist(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  static dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  static lerp(v1, v2, t) {
    return new Vector(v1.x * (1 - t) + v2.x * t, v1.y * (1 - t) + v2.y * t);
  }
}
