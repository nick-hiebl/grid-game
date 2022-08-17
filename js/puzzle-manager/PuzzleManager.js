import { Puzzle } from "./Puzzle.js";

class PuzzleManagerInstance {
  constructor() {
    this.puzzleMap = {};
  }

  getPuzzle(id) {
    if (id in this.puzzleMap) {
      return this.puzzleMap[id];
    }

    const puzzle = new Puzzle(id);
    this.puzzleMap[id] = puzzle;

    return puzzle;
  }
}

export const PuzzleManager = new PuzzleManagerInstance();
