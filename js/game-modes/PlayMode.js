import { LevelManager } from "../level/LevelManager.js";

export class PlayMode {
  constructor() {
    this.levelManager = new LevelManager();
    this.currentLevel = this.levelManager.getInitialLevel();
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime, inputState) {
    this.currentLevel.update(deltaTime, inputState);

    const exit = this.currentLevel.shouldExit();
    if (exit) {
      this.currentLevel = this.levelManager.getLevel(exit.key, exit);
    }
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager) {
    this.currentLevel.draw(screenManager);
  }
}
