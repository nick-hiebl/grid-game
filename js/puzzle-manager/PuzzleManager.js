import { Puzzle } from "./Puzzle.js";
import { initPuzzle } from "./PuzzleFactory.js";
import { PuzzleValidatorFactory } from "./PuzzleValidatorFactory.js";

const RULES = {
  1: { rows: 1, cols: 1, columnCounts: [1], rowCounts: [1] },
  2: { rows: 2, cols: 1, columnCounts: [2], rowCounts: [1, 1] },
  3: { rows: 2, cols: 2, columnCounts: [2, 1], rowCounts: [1, 2] },
  4: { rows: 3, cols: 3, columnCounts: [1, 3, 2], rowCounts: [1, 2, 3] },
  5: { rows: 3, cols: 3, columnCounts: [2, 3, 1], rowCounts: [2, 3, 1] },
  6: { rows: 3, cols: 4, columnCounts: [2, 1, 3, 2], rowCounts: [3, 4, 1] },
  7: { rows: 4, cols: 4, columnCounts: [2, 4, 2, 1], rowCounts: [4, 1, 1, 3] },
  8: { rows: 5, cols: 5, columnCounts: [2, 4, 2, 3, 5], rowCounts: [1, 3, 5, 5, 2] },
};

function puzzleRules(id) {
  if (id === "4") {
    return new PuzzleValidatorFactory()
      .addRowCounts([4, 3, null])
      .addColumnGroups([1, null, null, 2])
      .create();
  } else {
    console.error("Cannot find puzzle with id", id);
  }
  return new PuzzleValidatorFactory().create();
}

function makePuzzle(id) {
  if (id in RULES) {
    return initPuzzle(id, RULES[id]);
  }
  const rules = puzzleRules(id);
  if (id === "4") {
    return new Puzzle(id, 3, 4, rules);
  } else {
    console.error("Cannot find puzzle with id", id);
  }
}

class PuzzleManagerInstance {
  constructor() {
    this.puzzleMap = {};
  }

  loadPuzzle(id) {
    return makePuzzle(id);
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
