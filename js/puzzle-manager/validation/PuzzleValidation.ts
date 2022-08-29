import { Canvas } from "../../Canvas";
import { PuzzleGrid, PuzzleValues } from "../types";

export class PuzzleValidator {
  validationItems: ValidationItem[];

  constructor(validationItems: ValidationItem[]) {
    this.validationItems = validationItems;
  }

  isValid(grid: PuzzleGrid, values: PuzzleValues) {
    this.validationItems.forEach((item) => {
      item.validate(grid, values);
    });

    return this.validationItems.every((item) => item.isValid);
  }

  draw(canvas: Canvas, ...args: unknown[]) {
    this.validationItems.forEach((item) => {
      item.draw(canvas, ...args);
    });
  }
}

export class ValidationItem {
  isValid: boolean;
  drawnOnLeft: boolean;

  constructor() {
    this.isValid = false;
    this.drawnOnLeft = false;
  }

  validate(_grid: PuzzleGrid, _values: PuzzleValues) {
    // Do nothing...
  }

  draw(_canvas: Canvas, ..._args: unknown[]) {
    // Do nothing...
  }
}
