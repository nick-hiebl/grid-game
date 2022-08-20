import { Rectangle } from "../math/Shapes.js";

/**
 * They say premature optimization is the root of all evil.
 *
 * Oh no.
 */

class RectPoolClass {
  constructor() {
    this.grid = [];
  }

  get(row, col) {
    if (!(row in this.grid)) {
      this.grid[row] = [];
    }
    if (!(col in this.grid[row])) {
      this.grid[row][col] = Rectangle.widthForm(col, row, 1, 1);
    }

    return this.grid[row][col];
  }
}

// Woo! Singleton pattern again...
export const RectPool = new RectPoolClass();
