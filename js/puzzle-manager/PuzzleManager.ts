import { DataLoader } from "../level/DataLoader";
import { Puzzle } from "./Puzzle";
import { PuzzleRules, initPuzzle } from "./PuzzleFactory";

function makePuzzle(id: string): Puzzle {
  const rules = DataLoader.puzzles;
  if (id in rules) {
    return initPuzzle(id, rules[id]);
  }

  console.warn(`Cannot find puzzle with id: ${id}`);

  return initPuzzle(id, {
    rows: 1,
    cols: 1,
    rowCounts: [1],
    columnCounts: [1],
  });
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

  insertPuzzle(id: string, rules: PuzzleRules): Puzzle {
    if (id in this.puzzleMap) {
      return this.puzzleMap[id];
    }

    const puzzle = initPuzzle(id, rules);
    this.puzzleMap[id] = puzzle;

    return puzzle;
  }
}

export const PuzzleManager = new PuzzleManagerInstance();
