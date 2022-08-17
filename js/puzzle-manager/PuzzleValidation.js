class PuzzleValidator {
  constructor(validationItems) {
    this.validationItems = validationItems;
  }

  isValid(state) {
    this.validationItems.forEach(item => {
      item.validate(state);
    });

    return this.validationItems.every(item => item.isValid);
  }

  draw(canvas) {
    this.validationItems.forEach(item => {
      item.draw(canvas);
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

class EdgeCountValidationItem extends ValidationItem {
  constructor(isRow, index, count) {
    super();
    this.isRow = isRow;
    this.index = index;
    this.count = count;

    this.isValid = count === 0;
  }

  getRelevantRow(state) {
    if (this.isRow) {
      return state[this.index];
    } else {
      return state.map(row => row[this.index]);
    }
  }

  validate(state) {
    const row = this.getRelevantRow(state);

    const total = row.reduce((soFar, item) => item ? soFar + 1 : soFar, 0);

    this.isValid = total === this.count;
  }

  // draw(canvas) {

  // }
}

export class PuzzleValidatorFactory {
  constructor() {
    this.validationItems = [];
  }

  addEdgeCountValidators(nums, isRow) {
    nums.forEach((num, index) => {
      if (typeof num !== "number") {
        return;
      }

      this.validationItems.push(new EdgeCountValidationItem(isRow, index, num));
    });
  }

  addColumnCounts(nums) {
    this.addEdgeCountValidators(nums, false);
    return this;
  }

  addRowCounts(nums) {
    this.addEdgeCountValidators(nums, true);
    return this;
  }

  create() {
    return new PuzzleValidator(this.validationItems);
  }
}
