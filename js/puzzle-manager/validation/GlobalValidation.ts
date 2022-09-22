import { Canvas } from "../../Canvas";
import { PIXEL_WIDTH } from "../../constants/ScreenConstants";
import { Rectangle } from "../../math/Shapes";
import { PuzzleGrid, PuzzleValues } from "../types";
import { ValidationItem } from "./PuzzleValidation";

class GlobalValidationItem extends ValidationItem {
  constructor() {
    super();
    this.drawnOnLeft = true;
  }

  draw(canvas: Canvas, rectangle: Rectangle) {}
}

export class GlobalCountValidationItem extends GlobalValidationItem {
  desiredCount: number;
  currentCount: number;

  constructor(count: number) {
    super();
    this.desiredCount = count;
    this.currentCount = 0;
  }

  validate(_grid: PuzzleGrid, values: PuzzleValues) {
    this.currentCount = 0;
    for (const val of Object.values<boolean | null>(values)) {
      if (val) {
        this.currentCount++;
      }
    }

    this.isValid = this.currentCount === this.desiredCount;
  }

  drawNumber(canvas: Canvas, rectangle: Rectangle, number: number) {
    // TODO Draw numbers better, this is bad
    const center = rectangle.midpoint;
    const w = Math.min(rectangle.height, rectangle.width);
    const squareSize = Math.ceil(Math.sqrt(number));
    const radius = w / squareSize;
    const l = center.x - ((squareSize - 1) * radius) / 2;
    const t = center.y - ((squareSize - 1) * radius) / 2;

    if (number === 0) {
      canvas.setLineWidth(PIXEL_WIDTH);
      canvas.strokeEllipse(center.x, center.y, w * 0.4, w * 0.4);
    }

    for (let row = 0; row < squareSize; row++) {
      for (let col = 0; col < squareSize; col++) {
        const ind = row * squareSize + col;
        if (ind < number) {
          canvas.fillEllipse(
            l + col * radius,
            t + row * radius,
            radius * 0.4,
            radius * 0.4
          );
        }
      }
    }
  }

  draw(canvas: Canvas, cell: Rectangle) {
    if (this.isValid) {
      canvas.setColor("white");
    } else {
      canvas.setColor("red");
    }
    // const cell = positionGetter(0, -1).inset(PIXEL_WIDTH * 2);

    const halfWidth = cell.width / 2;
    const halfHeight = cell.height / 2;

    const midpoint = cell.midpoint;

    this.drawNumber(
      canvas,
      Rectangle.widthForm(cell.x1, cell.y1, halfWidth, halfHeight),
      this.currentCount
    );
    canvas.setLineWidth(PIXEL_WIDTH);
    canvas.drawLine(
      midpoint.x - halfWidth * 0.67,
      midpoint.y + halfHeight * 0.67,
      midpoint.x + halfWidth * 0.67,
      midpoint.y - halfHeight * 0.67
    );
    this.drawNumber(
      canvas,
      Rectangle.widthForm(midpoint.x, midpoint.y, halfWidth, halfHeight),
      this.desiredCount
    );
  }
}
