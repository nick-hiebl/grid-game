import { Puzzle } from "./Puzzle";
import { initPuzzle, PuzzleRules } from "./PuzzleFactory";

const RULES: Record<string, PuzzleRules> = {
  1: { rows: 1, cols: 1, columnCounts: [1], rowCounts: [1] },
  2: { rows: 2, cols: 1, columnCounts: [2], rowCounts: [1, 1] },
  3: { rows: 2, cols: 2, columnCounts: [2, 1], rowCounts: [1, 2] },
  4: { rows: 3, cols: 3, columnCounts: [1, 3, 2], rowCounts: [1, 2, 3] },
  5: { rows: 3, cols: 3, columnCounts: [2, 3, 1], rowCounts: [2, 3, 1] },
  6: { rows: 3, cols: 4, columnCounts: [2, 1, 3, 2], rowCounts: [3, 4, 1] },
  7: { rows: 4, cols: 4, columnCounts: [2, 4, 2, 1], rowCounts: [4, 1, 1, 3] },
  8: { rows: 4, cols: 4, columnCounts: [3, 2, 4, 1], rowCounts: [2, 4, 1, 3] },
  9: {
    rows: 5,
    cols: 5,
    columnCounts: [2, 4, 2, 3, 5],
    rowCounts: [1, 3, 5, 5, 2],
  },
};

function makePuzzle(id: string): Puzzle {
  if (id in RULES) {
    return initPuzzle(id, RULES[id]);
  }

  throw new Error(`Cannot find puzzle with id: ${id}`);
}

class PuzzleManagerInstance {
  puzzleMap: Record<string, Puzzle>;

  constructor() {
    this.puzzleMap = {};
  }

  loadPuzzle(id: string): Puzzle {
    return makePuzzle(id);
  }

  getPuzzle(id: string) {
    if (id in this.puzzleMap) {
      return this.puzzleMap[id];
    }

    const puzzle = this.loadPuzzle(id);
    this.puzzleMap[id] = puzzle;

    return puzzle;
  }
}

export const PuzzleManager = new PuzzleManagerInstance();
