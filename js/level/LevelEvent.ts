import { ExitTrigger } from "./ExitTrigger";

export class LevelEvent {
  constructor() {}

  isExitEvent() {
    return false;
  }

  isOpenPuzzleEvent() {
    return false;
  }

  isClosePuzzleEvent() {
    return false;
  }
}

export class ExitEvent extends LevelEvent {
  exitTrigger: ExitTrigger;

  constructor(exitTrigger: ExitTrigger) {
    super();
    this.exitTrigger = exitTrigger;
  }

  isExitEvent() {
    return true;
  }
}

export class OpenPuzzleEvent extends LevelEvent {
  puzzleId: string;

  constructor(puzzleId: string) {
    super();
    this.puzzleId = puzzleId;
  }

  isOpenPuzzleEvent() {
    return true;
  }
}

export class ClosePuzzleEvent extends LevelEvent {
  puzzleId: string;

  constructor(puzzleId: string) {
    super();
    this.puzzleId = puzzleId;
  }

  isClosePuzzleEvent() {
    return true;
  }
}
