import { clamp, sign } from "./Common.js";
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
      point.y <= this.y2
    );
  }

  get width() {
    return this.x2 - this.x1;
  }

  get height() {
    return this.y2 - this.y1;
  }

  get midpoint() {
    return new Vector((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
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
   * Compute the smallest vector in the reverse direction to movement to
   * uncollide with a given rectangle.
   *
   * This ASSUMES that they do intersect, but only works correctly when the
   * circle's center does not overlap the rectangle.
   *
   * @param {Circle} circle
   */
  uncollideCircle(circle) {
    const closestX = clamp(circle.position.x, this.x1, this.x2);
    const closestY = clamp(circle.position.y, this.y1, this.y2);

    const p0 = new Vector(closestX, closestY);
    const pToCenter = Vector.diff(circle.position, p0);

    const distFromCenter = pToCenter.magnitude || 1;

    if (distFromCenter >= circle.radius) {
      const circleDistToMyCenter = Vector.diff(circle.position, this.midpoint);
      const horizontalDistance =
        this.width / 2 - Math.abs(circleDistToMyCenter.x);
      const verticalDistance =
        this.height / 2 - Math.abs(circleDistToMyCenter.y);

      // Shortest way out is horizontally
      if (horizontalDistance < verticalDistance) {
        return new Vector(
          (horizontalDistance + circle.radius) * sign(circleDistToMyCenter.x),
          0
        );
      } else {
        return new Vector(
          0,
          (verticalDistance + circle.radius) * sign(circleDistToMyCenter.y)
        );
      }
    }

    return Vector.scale(
      pToCenter,
      (circle.radius - distFromCenter) / distFromCenter
    );
  }

  /**
   * Draw this rectangle onto a canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas) {
    canvas.fillRect(this.x1, this.y1, this.width, this.height);
  }

  stroke(canvas, inset = 0) {
    canvas.strokeRectInset(this.x1, this.y1, this.width, this.height, inset);
  }

  inset(insetBy) {
    return new Rectangle(
      this.x1 + insetBy,
      this.y1 + insetBy,
      this.x2 - insetBy,
      this.y2 - insetBy
    );
  }

  static widthForm(x, y, width, height) {
    return new Rectangle(x, y, x + width, y + height);
  }

  static centerForm(x, y, width, height) {
    return new Rectangle(x - width, y - height, x + width, y + height);
  }

  static aroundPoint(point, halfWidth, halfHeight) {
    return new Rectangle(point.x - halfWidth, point.y - halfHeight, point.x + halfWidth, point.y + halfHeight);
  }
}
