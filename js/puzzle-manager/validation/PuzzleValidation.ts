import { Canvas } from "../../Canvas";
import { Rectangle } from "../../math/Shapes";
import { PositionGetter, PuzzleGrid, PuzzleValues } from "../types";

export class PuzzleValidator {
  validationItems: ValidationItem[];

  leftAreas: Rectangle[] | undefined;

  constructor(validationItems: ValidationItem[]) {
    this.validationItems = validationItems;
  }

  isValid(grid: PuzzleGrid, values: PuzzleValues) {
    this.validationItems.forEach((item) => {
      item.validate(grid, values);
    });

    return this.validationItems.every((item) => item.isValid);
  }

  getLeftArea(index: number, total: number, positionGetter: PositionGetter) {
    if (this.leftAreas) {
      return this.leftAreas[index];
    }
    // TODO Draw this better when there are more global rules than fits
    const leftColumn = Rectangle.merged([
      positionGetter(-1, -1),
      positionGetter("end", -1),
    ]);

    const width = leftColumn.width;
    const top = leftColumn.midpoint.y - width * (total + 0.1 * (total - 1));
    this.leftAreas = [];
    for (let i = 0; i < total; i++) {
      this.leftAreas.push(
        Rectangle.widthForm(leftColumn.x1, top + i * width * 1.1, width, width)
      );
    }

    console.log(this.leftAreas);

    return this.leftAreas[index];
  }

  draw(canvas: Canvas, positionGetter: PositionGetter, ...args: unknown[]) {
    this.validationItems.forEach((item) => {
      if (!item.drawnOnLeft) {
        item.draw(canvas, positionGetter, ...args);
      }
    });

    const globals = this.validationItems.filter((item) => item.drawnOnLeft);

    globals.forEach((item, index) => {
      item.draw(
        canvas,
        this.getLeftArea(index, globals.length, positionGetter)
      );
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
