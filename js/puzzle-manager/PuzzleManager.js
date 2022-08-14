import { Puzzle } from "./Puzzle.js";

export class PuzzleManager {
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
