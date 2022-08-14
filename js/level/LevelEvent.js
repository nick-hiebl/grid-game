class LevelEvent {
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
  constructor(exitTrigger) {
    super();
    this.exitTrigger = exitTrigger;
  }

  isExitEvent() {
    return true;
  }
}

export class OpenPuzzleEvent extends LevelEvent {
  constructor(puzzleId) {
    super();
    this.puzzleId = puzzleId;
  }

  isOpenPuzzleEvent() {
    return true;
  }
}

export class ClosePuzzleEvent extends LevelEvent {
  constructor(puzzleId) {
    super();
    this.puzzleId = puzzleId;
  }

  isClosePuzzleEvent() {
    return true;
  }
}
