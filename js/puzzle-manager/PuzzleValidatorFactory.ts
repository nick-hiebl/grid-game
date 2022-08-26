import {
  CountInAreaValidation,
  ForcedCellValidation,
} from "./CellValidation.js";
import {
  EdgeBlankGroupsValidationItem,
  EdgeCountValidationItem,
  EdgeGroupsValidationItem,
  EdgeNoTripleValidationItem,
} from "./EdgeValidation.js";
import { PuzzleValidator, ValidationItem } from "./PuzzleValidation.js";

export class PuzzleValidatorFactory {
  validationItems: ValidationItem[];

  constructor() {
    this.validationItems = [];
  }

  addForcedCellValidator(row: number, column: number, mustBeOn: boolean) {
    this.validationItems.push(new ForcedCellValidation(row, column, mustBeOn));
    return this;
  }

  addCountAreaValidator(row: number, column: number, count: number) {
    this.validationItems.push(new CountInAreaValidation(row, column, count));
    return this;
  }

  addEdgeValidators(nums: number[], isRow: boolean, ValidationItemType = EdgeCountValidationItem) {
    nums.forEach((num, index) => {
      if (typeof num !== "number") {
        return;
      }

      this.validationItems.push(new ValidationItemType(isRow, index, num));
    });
  }

  addColumnCounts(nums: number[]) {
    this.addEdgeValidators(nums, false);
    return this;
  }

  addRowCounts(nums: number[]) {
    this.addEdgeValidators(nums, true);
    return this;
  }

  addColumnGroups(nums: number[]) {
    this.addEdgeValidators(nums, false, EdgeGroupsValidationItem);
    return this;
  }

  addRowGroups(nums: number[]) {
    this.addEdgeValidators(nums, true, EdgeGroupsValidationItem);
    return this;
  }

  addColumnBlankGroups(nums: number[]) {
    this.addEdgeValidators(nums, false, EdgeBlankGroupsValidationItem);
    return this;
  }

  addRowBlankGroups(nums: number[]) {
    this.addEdgeValidators(nums, true, EdgeBlankGroupsValidationItem);
    return this;
  }

  addColumnNoTriple(yeses: boolean[]) {
    yeses.forEach((bool, index) => {
      if (!bool) {
        return;
      }

      this.validationItems.push(new EdgeNoTripleValidationItem(false, index));
    });
  }

  addRowNoTriple(yeses: boolean[]) {
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
