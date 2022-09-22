import { CountInAreaValidation, ForcedCellValidation } from "./CellValidation";
import {
  EdgeBlankGroupsValidationItem,
  EdgeCountValidationItem,
  EdgeGroupsValidationItem,
  EdgeNoTripleValidationItem,
} from "./EdgeValidation";
import { GlobalContinentValidationItem, GlobalCountValidationItem } from "./GlobalValidation";
import { PuzzleValidator, ValidationItem } from "./PuzzleValidation";

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

  addEdgeValidators(
    nums: (number | null)[],
    isRow: boolean,
    ValidationItemType = EdgeCountValidationItem
  ) {
    nums.forEach((num, index) => {
      if (typeof num !== "number") {
        return;
      }

      this.validationItems.push(new ValidationItemType(isRow, index, num));
    });
  }

  addColumnCounts(nums: (number | null)[]) {
    this.addEdgeValidators(nums, false);
    return this;
  }

  addRowCounts(nums: (number | null)[]) {
    this.addEdgeValidators(nums, true);
    return this;
  }

  addColumnGroups(nums: (number | null)[]) {
    this.addEdgeValidators(nums, false, EdgeGroupsValidationItem);
    return this;
  }

  addRowGroups(nums: (number | null)[]) {
    this.addEdgeValidators(nums, true, EdgeGroupsValidationItem);
    return this;
  }

  addColumnBlankGroups(nums: (number | null)[]) {
    this.addEdgeValidators(nums, false, EdgeBlankGroupsValidationItem);
    return this;
  }

  addRowBlankGroups(nums: (number | null)[]) {
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
    return this;
  }

  addRowNoTriple(yeses: boolean[]) {
    yeses.forEach((bool, index) => {
      if (!bool) {
        return;
      }

      this.validationItems.push(new EdgeNoTripleValidationItem(true, index));
    });
    return this;
  }

  setGlobalCount(count: number) {
    this.validationItems.push(new GlobalCountValidationItem(count));
    return this;
  }

  addContinentRule() {
    this.validationItems.push(new GlobalContinentValidationItem());
    return this;
  }

  create() {
    return new PuzzleValidator(this.validationItems);
  }
}
