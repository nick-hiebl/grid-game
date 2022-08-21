export class PuzzleValidator {
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

export class ValidationItem {
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
