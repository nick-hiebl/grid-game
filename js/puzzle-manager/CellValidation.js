import { Vector } from "../math/Vector.js";

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
