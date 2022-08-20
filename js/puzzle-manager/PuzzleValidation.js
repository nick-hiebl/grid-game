import { Circle, Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

class PuzzleValidator {
  constructor(validationItems) {
    this.validationItems = validationItems;
  }

  isValid(state) {
    this.validationItems.forEach((item) => {
      item.validate(state);
    });

    return this.validationItems.every((item) => item.isValid);
  }

  draw(canvas, ...args) {
    this.validationItems.forEach((item) => {
      item.draw(canvas, ...args);
    });
  }
}

class ValidationItem {
  constructor() {
    this.isValid = false;
  }

  validate(state) {
    // Do nothing...
  }

  draw(canvas) {
    // Do nothing...
  }
}

const EDGE_COUNT_LAYOUT = [
  [new Circle(new Vector(0, 0), 0.33)],
  [new Circle(new Vector(0, 0), 0.33)],
  [new Circle(new Vector(0, 0.4), 0.33), new Circle(new Vector(0, -0.4), 0.33)],
  [
    new Circle(new Vector(-0.42, 0.4), 0.33),
    new Circle(new Vector(0.42, 0.4), 0.33),
    new Circle(new Vector(0, -0.4), 0.33),
  ],
  [
    new Circle(new Vector(0.4, 0.4), 0.33),
    new Circle(new Vector(0.4, -0.4), 0.33),
    new Circle(new Vector(-0.4, 0.4), 0.33),
    new Circle(new Vector(-0.4, -0.4), 0.33),
  ],
  [
    new Circle(new Vector(0, 0.3), 0.28),
    new Circle(new Vector(0.64, 0.3), 0.28),
    new Circle(new Vector(-0.64, 0.3), 0.28),
    new Circle(new Vector(-0.32, -0.3), 0.28),
    new Circle(new Vector(0.32, -0.3), 0.28),
  ],
  [
    new Circle(new Vector(0, 0.6), 0.28),
    new Circle(new Vector(0.64, 0.6), 0.28),
    new Circle(new Vector(-0.64, 0.6), 0.28),
    new Circle(new Vector(-0.32, 0), 0.28),
    new Circle(new Vector(0.32, 0), 0.28),
    new Circle(new Vector(0, -0.6), 0.28),
  ],
  [
    new Circle(new Vector(0, 0), 0.28),
    new Circle(new Vector(0.64, 0), 0.28),
    new Circle(new Vector(-0.64, 0), 0.28),
    new Circle(new Vector(-0.32, -0.6), 0.28),
    new Circle(new Vector(0.32, -0.6), 0.28),
    new Circle(new Vector(-0.32, 0.6), 0.28),
    new Circle(new Vector(0.32, 0.6), 0.28),
  ],
  [
    new Circle(new Vector(0, 0.6), 0.28),
    new Circle(new Vector(0.64, 0.6), 0.28),
    new Circle(new Vector(-0.64, 0.6), 0.28),
    new Circle(new Vector(-0.32, 0), 0.28),
    new Circle(new Vector(0.32, 0), 0.28),
    new Circle(new Vector(0, -0.6), 0.28),
    new Circle(new Vector(0.64, -0.6), 0.28),
    new Circle(new Vector(-0.64, -0.6), 0.28),
  ]
];

const EDGE_GROUP_LAYOUT = [
  [Rectangle.centerForm(0, 0, 0.33, 0.33)],
  [Rectangle.centerForm(0, 0, 0.33, 0.33)],
  [
    Rectangle.centerForm(0, -0.4, 0.33, 0.33),
    Rectangle.centerForm(0, 0.4, 0.33, 0.33),
  ],
  [
    Rectangle.centerForm(0, -0.4, 0.33, 0.33),
    Rectangle.centerForm(-0.4, 0.4, 0.33, 0.33),
    Rectangle.centerForm(0.4, 0.4, 0.33, 0.33),
  ],
  [
    Rectangle.centerForm(-0.4, -0.4, 0.33, 0.33),
    Rectangle.centerForm(0.4, -0.4, 0.33, 0.33),
    Rectangle.centerForm(-0.4, 0.4, 0.33, 0.33),
    Rectangle.centerForm(0.4, 0.4, 0.33, 0.33),
  ],
];

const rotRight = (vector) => new Vector(-vector.y, vector.x);

class EdgeValidationItem extends ValidationItem {
  constructor(isRow, index) {
    super();
    this.isRow = isRow;
    this.index = index;

    this.isValid = false;
  }

  getRelevantRow(state) {
    if (this.isRow) {
      return state[this.index];
    } else {
      return state.map((row) => row[this.index]);
    }
  }

  validateRow(row) {
    throw new TypeError("Cannot validate as a generic EdgeValidationItem");
  }

  validate(state) {
    const row = this.getRelevantRow(state);

    this.isValid = this.validateRow(row);
  }

  drawInCell(canvas, center, scaleBy, isSideways) {
    throw new TypeError("Cannot draw a generic EdgeValidationItem");
  }

  draw(canvas, positionGetter) {
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

class EdgeCountValidationItem extends EdgeValidationItem {
  constructor(isRow, index, count) {
    super(isRow, index);
    this.count = count;

    this.isValid = count === 0;
  }

  validateRow(row) {
    const count = row.reduce((soFar, item) => (item ? soFar + 1 : soFar), 0);

    return count === this.count;
  }

  drawInCell(canvas, center, scaleBy, isSideways) {
    const transformCircle = isSideways
      ? (circle) => new Circle(rotRight(circle.position), circle.radius)
      : (v) => v;

    for (let circle of EDGE_COUNT_LAYOUT[this.count]) {
      circle = transformCircle(circle);
      const position = Vector.add(
        center,
        Vector.scale(circle.position, scaleBy)
      );

      if (this.count === 0) {
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

class EdgeGroupsValidationItem extends EdgeCountValidationItem {
  validateRow(row) {
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

  drawSquare(canvas, position, width) {
    canvas.fillRect(
      position.x - width / 2,
      position.y - width / 2,
      width,
      width
    );
  }

  drawInCell(canvas, center, scaleBy, isSideways) {
    const moveCenter = (pos) => (isSideways ? rotRight(pos) : pos);

    for (const square of EDGE_GROUP_LAYOUT[this.count]) {
      const position = Vector.add(
        center,
        Vector.scale(moveCenter(square.midpoint), scaleBy)
      );
      const width = square.width * scaleBy;

      this.drawSquare(canvas, position, width);
    }
  }
}

class EdgeBlankGroupsValidationItem extends EdgeGroupsValidationItem {
  constructor(isRow, index, count) {
    super(isRow, index, count);

    this.isValid = count === 1;
  }

  validateRow(row) {
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

  drawSquare(canvas, position, width) {
    canvas.setLineDash([]);
    canvas.setLineWidth(width * 0.25);
    canvas.strokeRectInset(position.x, position.y, 0, 0, -width * 0.4);
  }
}

class EdgeNoTripleValidationItem extends EdgeValidationItem {
  constructor(isRow, index) {
    super(isRow, index);

    // Valid by default if no triple
    this.isValid = true;
  }

  validateRow(row) {
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

  drawInCell(canvas, center, scaleBy, isSideways) {
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

export class PuzzleValidatorFactory {
  constructor() {
    this.validationItems = [];
  }

  addEdgeValidators(nums, isRow, ValidationItemType = EdgeCountValidationItem) {
    nums.forEach((num, index) => {
      if (typeof num !== "number") {
        return;
      }

      this.validationItems.push(new ValidationItemType(isRow, index, num));
    });
  }

  addColumnCounts(nums) {
    this.addEdgeValidators(nums, false);
    return this;
  }

  addRowCounts(nums) {
    this.addEdgeValidators(nums, true);
    return this;
  }

  addColumnGroups(nums) {
    this.addEdgeValidators(nums, false, EdgeGroupsValidationItem);
    return this;
  }

  addRowGroups(nums) {
    this.addEdgeValidators(nums, true, EdgeGroupsValidationItem);
    return this;
  }

  addColumnBlankGroups(nums) {
    this.addEdgeValidators(nums, false, EdgeBlankGroupsValidationItem);
    return this;
  }

  addRowBlankGroups(nums) {
    this.addEdgeValidators(nums, true, EdgeBlankGroupsValidationItem);
    return this;
  }

  addColumnNoTriple(yeses) {
    yeses.forEach((bool, index) => {
      if (!bool) {
        return;
      }

      this.validationItems.push(new EdgeNoTripleValidationItem(false, index));
    });
  }

  addRowNoTriple(yeses) {
    yeses.forEach((bool, index) => {
      if (!bool) {
        return;
      }

      this.validationItems.push(new EdgeNoTripleValidationItem(true, index));
    });
  }

  create() {
    return new PuzzleValidator(this.validationItems);
  }
}
