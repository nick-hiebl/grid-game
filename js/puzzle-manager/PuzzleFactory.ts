import { Puzzle, PuzzleConfig } from "./Puzzle";
import { PuzzleValidatorFactory } from "./validation/PuzzleValidatorFactory";

export interface PuzzleRules {
  rows: number;
  cols: number;

  columnCounts?: (number | null)[];
  rowCounts?: (number | null)[];

  columnGroups?: (number | null)[];
  rowGroups?: (number | null)[];

  columnBlankGroups?: (number | null)[];
  rowBlankGroups?: (number | null)[];

  columnNoTriple?: boolean[];
  rowNoTriple?: boolean[];

  forcedCells?: { row: number; col: number; on: boolean }[];
  countAreas?: { row: number; col: number; count: number }[];

  globalCount?: number;
  continent?: boolean;

  config?: PuzzleConfig;
}

export const initPuzzle = (id: string, options: PuzzleRules) => {
  const { rows, cols, config } = options;

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
    options.countAreas.forEach((cell) => {
      rules.addCountAreaValidator(cell.row, cell.col, cell.count);
    });
  }
  if (options.globalCount) {
    rules.setGlobalCount(options.globalCount);
  }
  if (options.continent) {
    rules.addContinentRule();
  }

  return new Puzzle(id, rows, cols, rules.create(), config);
};
