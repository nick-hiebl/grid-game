import { ForcedCellValidation } from "./CellValidation.js";
import {
  EdgeBlankGroupsValidationItem,
  EdgeCountValidationItem,
  EdgeGroupsValidationItem,
  EdgeNoTripleValidationItem,
} from "./EdgeValidation";
import { PuzzleValidator } from "./PuzzleValidation.js";

export class PuzzleValidatorFactory {
  constructor() {
    this.validationItems = [];
  }

  addForcedCellValidator(row, column, mustBeOn) {
    this.validationItems.push(new ForcedCellValidation(row, column, mustBeOn));
    return this;
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
