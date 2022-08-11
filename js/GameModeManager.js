import { PlayMode } from "./game-modes/PlayMode.js";

export class GameModeManager {
  constructor() {
    this.playMode = new PlayMode();

    // Probably needs to initially be a menu mode eventually, or some dev-mode tooling
    this.currentMode = this.playMode;
  }

  /**
   * Update the current gamemode.
   * @param {number} deltaTime The time that has elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime, inputState) {
    this.currentMode.update(deltaTime, inputState);
  }

  /**
   * Draw the current gamemode.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas) {
    this.currentMode.draw(canvas);
  }
}
