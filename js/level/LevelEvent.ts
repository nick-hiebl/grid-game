import { PlayMode } from "../game-modes/PlayMode";
import { PortalInteractible } from "./interactibles/PortalInteractible";
import { ExitTrigger } from "./ExitTrigger";
import { Level } from "./Level";

export class LevelEvent {
  constructor() {}

  isExitEvent() {
    return false;
  }

  isOpenPuzzleEvent(): this is OpenPuzzleEvent {
    return false;
  }

  isClosePuzzleEvent(): this is ClosePuzzleEvent {
    return false;
  }

  isOpenMapEvent(): this is OpenMapEvent {
    return false;
  }

  process(_playMode: PlayMode) {}
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

export class OpenMapEvent extends LevelEvent {
  fromPortal: PortalInteractible;
  fromLevel: Level;

  constructor(portal: PortalInteractible, level: Level) {
    super();

    this.fromPortal = portal;
    this.fromLevel = level;
  }

  isOpenMapEvent() {
    return true;
  }
}

export class ToPortalEvent extends LevelEvent {
  toPortal: PortalInteractible;
  toLevel: Level;

  constructor(portal: PortalInteractible, level: Level) {
    super();

    this.toPortal = portal;
    this.toLevel = level;
  }

  process(playMode: PlayMode): void {
    const currentPortal = playMode.currentLevel.interactingWith;
    if (currentPortal && currentPortal instanceof PortalInteractible) {
      playMode.currentLevel.interactingWith = undefined;
    }

    playMode.goToPortal(this.toLevel, this.toPortal);
  }
}
