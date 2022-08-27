import { Puzzle } from "./Puzzle";
import { initPuzzle, PuzzleRules } from "./PuzzleFactory";

const RULES: Record<string, PuzzleRules> = {
  "intro-1": { rows: 1, cols: 1, columnCounts: [1], rowCounts: [1] },
  "intro-2": { rows: 2, cols: 1, columnCounts: [2], rowCounts: [1, 1] },
  "intro-3": { rows: 2, cols: 2, columnCounts: [2, 1], rowCounts: [1, 2] },
  "intro-side": {
    rows: 3,
    cols: 3,
    columnCounts: [1, 3, 2],
    rowCounts: [1, 2, 3],
  },
  // "intro-secret": {
  //   rows: 7,
  //   cols: 7,
  //   columnCounts: [5, 4, 7, 6, 2, 3, 1],
  //   rowCounts: [1, 5, 6, 3, 7, 4, 2],
  // },
  "intro-secret": {
    rows: 2,
    cols: 2,
    columnCounts: [1, 1],
    rowCounts: [1, 2],
    config: {
      combinedGroups: [
        [
          [0, 0],
          [1, 0],
        ],
      ],
    },
  },

  "hall-1": { rows: 3, cols: 3, columnCounts: [2, 3, 1], rowCounts: [2, 3, 1] },
  "hall-2": { rows: 3, cols: 3, columnCounts: [3, 2, 3], rowCounts: [3, 2, 3] },
  "hall-3": {
    rows: 3,
    cols: 4,
    columnCounts: [2, 1, 3, 2],
    rowCounts: [3, 4, 1],
  },
  "hall-4": {
    rows: 4,
    cols: 4,
    columnCounts: [2, 4, 2, 1],
    rowCounts: [4, 1, 1, 3],
  },
  "hall-5": {
    rows: 4,
    cols: 4,
    columnCounts: [3, 2, 4, 1],
    rowCounts: [2, 4, 1, 3],
  },
  "hall-6": {
    rows: 5,
    cols: 5,
    columnCounts: [2, 4, 2, 3, 5],
    rowCounts: [1, 3, 5, 5, 2],
  },

  "obvious-secret": {
    rows: 4,
    cols: 5,
    columnCounts: [1, 3, 2, 3, 1],
    rowCounts: [2, 0, 5, 3],
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
