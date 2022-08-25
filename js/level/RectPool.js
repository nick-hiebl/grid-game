import { Rectangle } from "../math/Shapes.js";

/**
 * They say premature optimization is the root of all evil.
 *
 * Oh no.
 */

class RectPoolClass {
  constructor() {
    this.grid = [];
    this.shortGrid = [];
  }

  innerGet(row, col, isShort, grid) {
    if (!(row in grid)) {
      grid[row] = [];
    }
    if (!(col in grid[row])) {
      grid[row][col] = Rectangle.widthForm(col, row, 1, isShort ? 0.2 : 1);
    }

    return grid[row][col];
  }

  get(row, col, isShort = false) {
    return this.innerGet(row, col, isShort, isShort ? this.shortGrid : this.grid);
  }
}

// Woo! Singleton pattern again...
export const RectPool = new RectPoolClass();
