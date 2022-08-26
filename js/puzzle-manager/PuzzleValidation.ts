import { Canvas } from "../Canvas";
import { PuzzleState } from "./types";

export class PuzzleValidator {
  validationItems: ValidationItem[];

  constructor(validationItems: ValidationItem[]) {
    this.validationItems = validationItems;
  }

  isValid(state: PuzzleState) {
    this.validationItems.forEach((item) => {
      item.validate(state);
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

  constructor() {
    this.isValid = false;
  }

  validate(_state: PuzzleState) {
    // Do nothing...
  }

  draw(_canvas: Canvas, ..._args: unknown[]) {
    // Do nothing...
  }
}
