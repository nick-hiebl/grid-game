import { LevelManager } from "../level/LevelManager.js";
import { PuzzleManager } from "../puzzle-manager/PuzzleManager.js";

export class PlayMode {
  constructor() {
    this.levelManager = new LevelManager();
    this.startLevel(this.levelManager.getInitialLevel());
    this.puzzleManager = new PuzzleManager();

    this.currentPuzzle = undefined;
  }

  startLevel(level) {
    this.currentLevel = level;
    level.start(this);
  }

  onLevelEvent(event) {
    if (event.isExitEvent()) {
      const exitTrigger = event.exitTrigger;
      this.startLevel(this.levelManager.getLevel(exitTrigger.key, exitTrigger));
    } else if (event.isOpenPuzzleEvent()) {
      this.currentPuzzle = this.puzzleManager.getPuzzle(event.puzzleId);
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
  update(deltaTime, inputState) {
    this.currentLevel.update(deltaTime, inputState);
    this.currentPuzzle?.update(deltaTime, inputState);
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input) {
    this.currentLevel.onInput(input);
    this.currentPuzzle?.onInput(input);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager) {
    this.currentLevel.draw(screenManager);
    this.currentPuzzle?.draw(screenManager);
  }
}
