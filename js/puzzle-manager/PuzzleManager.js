import { Puzzle } from "./Puzzle.js";
import { PuzzleValidatorFactory } from "./PuzzleValidation.js";

class PuzzleManagerInstance {
  constructor() {
    this.puzzleMap = {};
  }

  loadPuzzle(id) {
    const factory = new PuzzleValidatorFactory();
    let rows = 3,
      cols = 4;

    if (id === "1") {
      factory.addColumnCounts([1, 3, 1]);
      factory.addRowCounts([null, 2, null]);
      factory.addRowBlankGroups([null, null, 2]);
      factory.addRowNoTriple([true, null, null]);
      rows = 3;
      cols = 3;
    } else if (id === "3") {
      factory.addRowCounts([4, 3, null]);
      factory.addColumnGroups([1, null, null, 2]);
    }

    return new Puzzle(id, rows, cols, factory.create());
  }

  getPuzzle(id) {
    if (id in this.puzzleMap) {
      return this.puzzleMap[id];
    }

    const puzzle = this.loadPuzzle(id);
    this.puzzleMap[id] = puzzle;

    return puzzle;
  }
}

export const PuzzleManager = new PuzzleManagerInstance();
