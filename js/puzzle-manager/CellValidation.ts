import { Canvas } from "../Canvas";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

import { N_CIRCLE_LAYOUT, SOLVED_BACKGROUND } from "./constants";
import { ValidationItem } from "./PuzzleValidation";
import { PositionGetter, PuzzleState } from "./types";

export class CellValidation extends ValidationItem {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    super();
    this.row = row;
    this.column = column;
  }
}

export class ForcedCellValidation extends CellValidation {
  mustBeOn: boolean;

  constructor(row: number, column: number, mustBeOn: boolean) {
    super(row, column);
    this.mustBeOn = mustBeOn;

    this.isValid = !mustBeOn;
  }

  validate(state: PuzzleState) {
    const cell = state[this.row][this.column];

    this.isValid = !!cell === !!this.mustBeOn;
  }

  draw(canvas: Canvas, positionGetter: PositionGetter) {
    if (this.isValid) {
      canvas.setColor("white");
    } else {
      canvas.setColor("red");
    }

    const rect = positionGetter(this.row, this.column);

    const width = Math.min(rect.width, rect.height);

    const center = new Vector(rect.x2 - width * 0.15, rect.y1 + width * 0.15);

    if (this.mustBeOn) {
      canvas.fillEllipse(center.x, center.y, width * 0.1, width * 0.1);
    } else {
      canvas.setLineWidth(width * 0.05);
      canvas.strokeEllipse(center.x, center.y, width * 0.075, width * 0.075);
    }
  }
}

export class CountInAreaValidation extends CellValidation {
  desiredCount: number;
  isCellColoured: boolean;

  constructor(row: number, column: number, desiredCount: number) {
    super(row, column);

    this.desiredCount = desiredCount;
    this.isValid = desiredCount === 0;
    this.isCellColoured = false;
  }

  *iterateArea(state: PuzzleState) {
    for (
      let row = Math.max(this.row - 1, 0);
      row <= Math.min(this.row + 1, state.length - 1);
      row++
    ) {
      for (
        let col = Math.max(this.column - 1, 0);
        col <= Math.min(this.column + 1, state[row].length - 1);
        col++
      ) {
        yield [row, col];
      }
    }
  }

  validate(state: PuzzleState) {
    let count = 0;

    for (let [row, col] of this.iterateArea(state)) {
      if (!!state[row][col]) {
        count++;
      }
    }

    this.isValid = count === this.desiredCount;
    this.isCellColoured = !!state[this.row][this.column];
  }

  draw(canvas: Canvas, positionGetter: (row: number, column: number) => Rectangle) {
    if (this.isValid) {
      canvas.setColor(this.isCellColoured ? SOLVED_BACKGROUND : "white");
    } else {
      canvas.setColor("red");
    }

    const rect = positionGetter(this.row, this.column);

    const width = Math.min(rect.width, rect.height) * 0.25;

    const center = rect.midpoint;

    for (const circle of N_CIRCLE_LAYOUT[this.desiredCount]) {
      const position = Vector.add(center, Vector.scale(circle.position, width));

      if (this.desiredCount === 0) {
        canvas.setLineWidth(circle.radius * width * 0.5);
        canvas.strokeEllipse(
          position.x,
          position.y,
          circle.radius * width * 0.75,
          circle.radius * width * 0.75
        );
      } else {
        canvas.fillEllipse(
          position.x,
          position.y,
          circle.radius * width,
          circle.radius * width
        );
      }
    }
  }
}
