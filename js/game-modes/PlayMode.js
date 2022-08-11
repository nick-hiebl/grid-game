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
   * @param {Canvas} canvas The canvas to draw upon.
   */
  draw(canvas) {
    this.currentLevel.draw(canvas);
  }
}
