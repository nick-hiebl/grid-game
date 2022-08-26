import { LevelManager } from "../level/LevelManager";
import { PuzzleManager } from "../puzzle-manager/PuzzleManager";
import { Puzzle } from "../puzzle-manager/Puzzle";
import { Level } from "../level/Level";
import { ExitEvent, LevelEvent, OpenPuzzleEvent } from "../level/LevelEvent";
import { InputEvent, InputState } from "../InputManager";
import { ScreenManager } from "../ScreenManager";

export class PlayMode {
  levelManager: LevelManager;
  puzzleManager: typeof PuzzleManager;

  currentPuzzle: Puzzle | undefined;
  currentLevel?: Level;

  constructor() {
    this.levelManager = new LevelManager();
    this.startLevel(this.levelManager.getInitialLevel());
    this.puzzleManager = PuzzleManager;

    this.currentPuzzle = undefined;
  }

  startLevel(level: Level) {
    this.currentLevel = level;
    level.start(this);
  }

  onLevelEvent(event: LevelEvent) {
    if (event.isExitEvent()) {
      const exitTrigger = (event as ExitEvent).exitTrigger;
      this.startLevel(this.levelManager.getLevel(exitTrigger.key, exitTrigger));
    } else if (event.isOpenPuzzleEvent()) {
      this.currentPuzzle = this.puzzleManager.getPuzzle(
        (event as OpenPuzzleEvent).puzzleId
      );
      this.currentPuzzle.open();
    } else if (event.isClosePuzzleEvent()) {
      this.currentPuzzle?.close();
    }
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.currentLevel?.update(deltaTime, inputState);
    this.currentPuzzle?.update(deltaTime, inputState);
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.currentLevel?.onInput(input);
    this.currentPuzzle?.onInput(input);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: ScreenManager) {
    this.currentLevel?.draw(screenManager);
    this.currentPuzzle?.draw(screenManager);
  }
}
