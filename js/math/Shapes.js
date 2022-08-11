import { clamp } from "./Common.js";
import { Vector } from "./Vector.js";

export class Circle {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;
  }

  /**
   * Check if another circle intersects with this circle
   * @param {Circle} otherCircle The circle to check intersection with
   */
  intersectsCircle(otherCircle) {
    const radiusSum = this.radius + otherCircle.radius;
    return (
      Vector.sqrDist(this.position, otherCircle.position) <
      radiusSum * radiusSum
    );
  }

  /**
   * Check if a point intersects with this circle.
   * @param {Vector} point The point to check intersection with
   */
  intersectsVector(point) {
    return Vector.sqrDist(this.position, point) < this.radius * this.radius;
  }

  /**
   * Check if a rectangle intersects with this circle.
   * @param {Rectangle} rectangle The rectangle to check intersection with
   */
  intersectsRectangle(rectangle) {
    // Find the co-ordinates of the closest point in the rectangle to the circle center.
    const closestX = clamp(this.position.x, rectangle.x1, rectangle.x2);
    const closestY = clamp(this.position.y, rectangle.y1, rectangle.y2);

    // Find if the closest point in the rectangle overlaps with the circle.
    return this.intersectsVector(new Vector(closestX, closestY));
  }

  /**
   * Compute the smallest vector in the reverse direction to movement to
   * uncollide with a given rectangle.
   *
   * This ASSUMES that they do intersect, but only works correctly when the
   * circle's center does not overlap the rectangle.
   *
   * @param {Rectangle} rectangle
   */
  uncollideWithRectangle(rectangle) {
    const closestX = clamp(this.position.x, rectangle.x1, rectangle.x2);
    const closestY = clamp(this.position.y, rectangle.y1, rectangle.y2);

    const p0 = new Vector(closestX, closestY);
    const pToCenter = Vector.diff(this.position, p0);
    // TODO Handle this case way better.
    const distFromCenter = pToCenter.magnitude || 1;

    if (distFromCenter >= this.radius) {
      return new Vector(0, 0);
    }
    return Vector.scale(
      pToCenter,
      (this.radius - distFromCenter) / distFromCenter
    );

    // const p1 = Vector.add(p0, movementVector);

    // const a = Vector.sqrDist(movementVector, new Vector(0, 0));
    // const b =
    //   2 * (p1.x - p0.x) * (p0.x - this.position.x) +
    //   2 * (p1.y - p0.y) * (p0.y - this.position.y);
    // const c = Vector.sqrDist(p0, this.position) - this.radius * this.radius;

    // const determinant = b * b - 4 * a * c;

    // // If the determinant is 0, then the circle and line are kissing. If the
    // // determinant is negative then they are not touching.
    // if (determinant <= 0) {
    //   return new Vector(0, 0);
    // }

    // const t = (-b - Math.sqrt(determinant)) / (2 * a);
    // return Vector.scale(movementVector, t);
  }

  /**
   * Determine if this circle is exactly kissing a rectangle below.
   * @param {Rectangle} rectangle The rectangle to check for a kiss with
   */
  isKissingBelow(rectangle) {
    return (
      this.position.y + this.radius === rectangle.y1 &&
      rectangle.x1 <= this.position.x &&
      this.position.x <= rectangle.x2
    );
  }

  /**
   * Draw this circle onto a canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas) {
    canvas.fillEllipse(
      this.position.x,
      this.position.y,
      this.radius,
      this.radius
    );
  }
}

export class Rectangle {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    // Consider storing center Vector and pre-computed half-widths and half-heights if useful.
    this.width = x2 - x1;
    this.height = y2 - y1;
  }

  /**
   * Check if a point intersects with this rectangle.
   * @param {Vector} point The point to check intersection with
   */
  intersectsPoint(point) {
    return (
      this.x1 <= point.x &&
      point.x <= this.x2 &&
      this.y1 <= point.y &&
      this.y2 <= point.y
    );
  }

  /**
   * Check if another rectangle intersects with this rectangle.
   * @param {Rectangle} otherRectangle The rectangle to check intersection with
   */
  intersectsRectangle(otherRectangle) {
    return (
      otherRectangle.x1 <= this.x2 &&
      this.x1 <= otherRectangle.x2 &&
      otherRectangle.y1 <= this.y2 &&
      this.y1 <= otherRectangle.y2
    );
  }

  /**
   * Draw this rectangle onto a canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas) {
    canvas.fillRect(this.x1, this.y1, this.width, this.height);
  }
}
