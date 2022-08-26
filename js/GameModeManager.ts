import { PlayMode } from "./game-modes/PlayMode";
import { InputEvent, InputState } from "./InputManager";
import { ScreenManager } from "./ScreenManager";

type Mode = PlayMode;

export class GameModeManager {
  playMode: PlayMode;

  currentMode: Mode;

  constructor() {
    this.playMode = new PlayMode();

    // Probably needs to initially be a menu mode eventually, or some dev-mode tooling
    this.currentMode = this.playMode;
  }

  /**
   * Update the current gamemode.
   * @param {number} deltaTime The time that has elapsed since the last update.
   * @param {InputState} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.currentMode.update(deltaTime, inputState);
  }

  /**
   * Process an input event
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.currentMode.onInput(input);
  }

  /**
   * Draw the current gamemode.
   * @param {ScreenManager} screenManager The screenManager object.
   */
  draw(screenManager: ScreenManager) {
    this.currentMode.draw(screenManager);
  }
}