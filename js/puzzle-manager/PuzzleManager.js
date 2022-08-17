import { Puzzle } from "./Puzzle.js";
import { PuzzleValidatorFactory } from "./PuzzleValidation.js";

class PuzzleManagerInstance {
  constructor() {
    this.puzzleMap = {};
  }

  loadPuzzle(id) {
    const factory = new PuzzleValidatorFactory()

    if (id === "1") {
      factory.addColumnCounts([null, 2, null, null]);
    } else if (id === "3") {
      factory.addRowCounts([4, null, null, null]);
    }

    return new Puzzle(id, 4, 4, factory.create());
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
