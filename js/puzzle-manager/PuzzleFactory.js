import { Puzzle } from "./Puzzle.js";
import { PuzzleValidatorFactory } from "./PuzzleValidatorFactory.js";

export const initPuzzle = (id, options) => {
  const { rows, cols } = options;

  const rules = new PuzzleValidatorFactory();

  if (options.columnCounts) {
    rules.addColumnCounts(options.columnCounts);
  }
  if (options.rowCounts) {
    rules.addRowCounts(options.rowCounts);
  }
  if (options.columnGroups) {
    rules.addColumnGroups(options.columnGroups);
  }
  if (options.rowGroups) {
    rules.addRowGroups(options.rowGroups);
  }
  if (options.columnBlankGroups) {
    rules.addColumnBlankGroups(options.columnBlankGroups);
  }
  if (options.rowBlankGroups) {
    rules.addRowBlankGroups(options.rowBlankGroups);
  }
  if (options.columnNoTriple) {
    rules.addColumnNoTriple(options.columnNoTriple);
  }
  if (options.rowNoTriple) {
    rules.addRowNoTriple(options.rowNoTriple);
  }
  if (options.forcedCells) {
    options.forcedCells.forEach((cell) => {
      rules.addForcedCellValidator(cell.row, cell.col, cell.on);
    });
  }
  if (options.countAreas) {
    options.forcedCells.forEach((cell) => {
      rules.addCountAreaValidator(cell.row, cell.col, cell.count);
    });
  }

  return new Puzzle(id, rows, cols, rules.create());
};
