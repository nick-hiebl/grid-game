import { Vector } from "../math/Vector.js";

import { N_CIRCLE_LAYOUT, SOLVED_BACKGROUND } from "./constants.js";
import { ValidationItem } from "./PuzzleValidation.js";

export class CellValidation extends ValidationItem {
  constructor(row, column) {
    super();
    this.row = row;
    this.column = column;
  }
}

export class ForcedCellValidation extends CellValidation {
  constructor(row, column, mustBeOn) {
    super(row, column);
    this.mustBeOn = mustBeOn;

    this.isValid = !mustBeOn;
  }

  validate(state) {
    const cell = state[this.row][this.column];

    this.isValid = !!cell === !!this.mustBeOn;
  }

  draw(canvas, positionGetter) {
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
  constructor(row, column, desiredCount) {
    super(row, column);

    this.desiredCount = desiredCount;
    this.isValid = desiredCount === 0;
    this.isCellColoured = false;
  }

  validate(state) {
    let count = 0;
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
        if (!!state[row][col]) {
          count++;
        }
      }
    }

    this.isValid = count === this.desiredCount;
    this.isCellColoured = !!state[this.row][this.column];
  }

  draw(canvas, positionGetter) {
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
