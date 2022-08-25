import { Puzzle } from "./Puzzle.js";
import { initPuzzle } from "./PuzzleFactory.js";
import { PuzzleValidatorFactory } from "./PuzzleValidatorFactory.js";

const RULES = {
  "1": { rows: 1, cols: 1, columnCounts: [1], rowCounts: [1] },
  "2": { rows: 2, cols: 1, columnCounts: [2], rowCounts: [1, 1] },
  "3": { rows: 2, cols: 2, columnCounts: [2, 1], rowCounts: [1, 2] },
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
