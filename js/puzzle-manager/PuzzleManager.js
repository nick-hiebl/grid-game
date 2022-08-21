import { Puzzle } from "./Puzzle.js";
import { PuzzleValidatorFactory } from "./PuzzleValidatorFactory.js";

function puzzleRules(id) {
  if (id === "1") {
    return new PuzzleValidatorFactory()
      .addColumnCounts([1, 3, 1])
      .addRowCounts([2, 2, 1])
      .create();
  } else if (id === "2") {
    return new PuzzleValidatorFactory()
      .addColumnCounts([4, 3, 2, 1])
      .addRowCounts([1, 2, 3, 4])
      .create();
  } else if (id === "3") {
    return new PuzzleValidatorFactory()
      .addColumnCounts([1, 1, 1])
      .addRowCounts([1, 1, 1])
      .create();
  } else if (id === "4") {
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
  const rules = puzzleRules(id);
  if (id === "1") {
    return new Puzzle(id, 3, 3, rules);
  } else if (id === "2") {
    return new Puzzle(id, 4, 4, rules);
  } else if (id === "3") {
    return new Puzzle(id, 3, 3, rules);
  } else if (id === "4") {
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
