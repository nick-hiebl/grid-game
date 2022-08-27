import { Canvas } from "../Canvas";
import { Circle, Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

import { N_CIRCLE_LAYOUT, N_SQUARE_LAYOUT } from "./constants";
import { ValidationItem } from "./PuzzleValidation";
import { CellValue, PositionGetter, PuzzleGrid, PuzzleValues } from "./types";

const rotRight = (vector: Vector) => new Vector(-vector.y, vector.x);

class EdgeValidationItem extends ValidationItem {
  isRow: boolean;
  index: number;

  constructor(isRow: boolean, index: number) {
    super();
    this.isRow = isRow;
    this.index = index;

    this.isValid = false;
  }

  getRelevantRow(grid: PuzzleGrid, valueMap: PuzzleValues): CellValue[] {
    const cells = this.isRow
      ? grid[this.index]
      : grid.map((row) => row[this.index]);

    const [values] = cells.reduce<[CellValue[], number]>(
      ([valuesSoFar, lastId], cell) => [
        cell.id === lastId
          ? valuesSoFar
          : valuesSoFar.concat([valueMap[cell.id]]),
        cell.id,
      ],
      [[], -1]
    );

    return values;
  }

  validateRow(_row: CellValue[]): boolean {
    throw new TypeError("Cannot validate as a generic EdgeValidationItem");
  }

  validate(grid: PuzzleGrid, values: PuzzleValues) {
    const row = this.getRelevantRow(grid, values);

    this.isValid = this.validateRow(row);
  }

  drawInCell(
    _canvas: Canvas,
    _center: Vector,
    _scaleBy: number,
    _isSideways: boolean
  ) {
    throw new TypeError("Cannot draw a generic EdgeValidationItem");
  }

  draw(canvas: Canvas, positionGetter: PositionGetter) {
    if (this.isValid) {
      canvas.setColor("white");
    } else {
      canvas.setColor("red");
    }

    if (this.isRow) {
      const cell = positionGetter(this.index, "end");

      this.drawInCell(canvas, cell.midpoint, cell.width / 2, true);
    } else {
      const cell = positionGetter(-1, this.index);

      this.drawInCell(canvas, cell.midpoint, cell.height / 2, false);
    }
  }
}

export class EdgeCountValidationItem extends EdgeValidationItem {
  count: number;

  constructor(isRow: boolean, index: number, count: number) {
    super(isRow, index);
    this.count = count;

    this.isValid = count === 0;
  }

  validateRow(row: CellValue[]) {
    const count = row.reduce((soFar, item) => (item ? soFar + 1 : soFar), 0);

    return count === this.count;
  }

  drawInCell(
    canvas: Canvas,
    center: Vector,
    scaleBy: number,
    isSideways: boolean
  ) {
    const transformCircle = isSideways
      ? (circle: Circle) => new Circle(rotRight(circle.position), circle.radius)
      : (v: Circle) => v;

    for (let circle of N_CIRCLE_LAYOUT[this.count]) {
      circle = transformCircle(circle);
      const position = Vector.add(
        center,
        Vector.scale(circle.position, scaleBy)
      );

      if (this.count === 0) {
        canvas.setLineDash([]);
        canvas.setLineWidth(circle.radius * scaleBy * 0.5);
        canvas.strokeEllipse(
          position.x,
          position.y,
          circle.radius * scaleBy * 0.75,
          circle.radius * scaleBy * 0.75
        );
      } else {
        canvas.fillEllipse(
          position.x,
          position.y,
          circle.radius * scaleBy,
          circle.radius * scaleBy
        );
      }
    }
  }
}

export class EdgeGroupsValidationItem extends EdgeCountValidationItem {
  validateRow(row: CellValue[]) {
    const [numGroups] = row.reduce(
      ([soFar, inGroup], item) =>
        item && !inGroup
          ? // Start of new group
            [soFar + 1, true]
          : // Continue, updating inGroup based on current item state
            [soFar, !!item],
      [0, false]
    );

    return numGroups === this.count;
  }

  drawSquare(canvas: Canvas, position: Vector, width: number) {
    canvas.fillRect(
      position.x - width / 2,
      position.y - width / 2,
      width,
      width
    );
  }

  drawInCell(
    canvas: Canvas,
    center: Vector,
    scaleBy: number,
    isSideways: boolean
  ) {
    const moveCenter = (pos: Vector) => (isSideways ? rotRight(pos) : pos);

    for (const square of N_SQUARE_LAYOUT[this.count]) {
      const position = Vector.add(
        center,
        Vector.scale(moveCenter(square.midpoint), scaleBy)
      );
      const width = square.width * scaleBy;

      this.drawSquare(canvas, position, width);
    }
  }
}

export class EdgeBlankGroupsValidationItem extends EdgeGroupsValidationItem {
  constructor(isRow: boolean, index: number, count: number) {
    super(isRow, index, count);

    this.isValid = count === 1;
  }

  validateRow(row: CellValue[]) {
    const [numGroups] = row.reduce(
      ([soFar, inGroup], item) =>
        !item && inGroup
          ? // Start of new group
            [soFar + 1, false]
          : // Continue, updating inGroup based on current item state
            [soFar, !!item],
      [0, true]
    );

    return numGroups === this.count;
  }

  drawSquare(canvas: Canvas, position: Vector, width: number) {
    canvas.setLineDash([]);
    canvas.setLineWidth(width * 0.25);
    canvas.strokeRectInset(position.x, position.y, 0, 0, -width * 0.4);
  }
}

export class EdgeNoTripleValidationItem extends EdgeValidationItem {
  constructor(isRow: boolean, index: number) {
    super(isRow, index);

    // Valid by default if no triple
    this.isValid = true;
  }

  validateRow(row: CellValue[]) {
    let count = 0;
    for (const value of row) {
      if (value) {
        count += 1;
      } else {
        count = 0;
      }
      if (count >= 3) {
        return false;
      }
    }

    return true;
  }

  drawInCell(
    canvas: Canvas,
    center: Vector,
    scaleBy: number,
    isSideways: boolean
  ) {
    canvas.setLineWidth(scaleBy * 0.1);
    canvas.setLineDash([]);

    canvas.fillEllipse(center.x, center.y, 0.22 * scaleBy, 0.22 * scaleBy);
    const center2 = Vector.add(
      center,
      Vector.scale(
        isSideways ? new Vector(-0.5, 0) : new Vector(0, 0.5),
        scaleBy
      )
    );
    canvas.fillEllipse(center2.x, center2.y, 0.22 * scaleBy, 0.22 * scaleBy);
    const center3 = Vector.add(center, Vector.diff(center, center2));

    const radius = scaleBy * 0.22;
    canvas.drawLine(
      center3.x - radius,
      center3.y - radius,
      center3.x + radius,
      center3.y + radius
    );
    canvas.drawLine(
      center3.x - radius,
      center3.y + radius,
      center3.x + radius,
      center3.y - radius
    );
  }
}
