import { DataLoader } from "../level/DataLoader";
import { Puzzle } from "./Puzzle";
import { initPuzzle } from "./PuzzleFactory";

function makePuzzle(id: string): Puzzle {
  const rules = DataLoader.puzzles;
  if (id in rules) {
    return initPuzzle(id, rules[id]);
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
