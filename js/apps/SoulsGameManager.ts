import { SoulsMode } from "../game-modes/SoulsMode";
import { InputEvent, InputState } from "../InputManager";
import { ScreenManager } from "../ScreenManager";
import { GameModeManagerEssentials, Mode } from "../types";


export class SoulsGameManager implements GameModeManagerEssentials<ScreenManager> {
  soulsMode: SoulsMode;

  currentMode: Mode<ScreenManager>;

  constructor() {
    this.soulsMode = new SoulsMode(this);

    this.currentMode = this.soulsMode;
    this.soulsMode.onStart();
  }

  /**
     * Update the current gamemode.
     * @param {number} deltaTime The time that has elapsed since the last update.
     * @param {InputState} inputState The current state of inputs.
     */
  update(deltaTime: number, inputState: InputState) {
    this.currentMode.update(deltaTime, inputState);
  }

  switchToMode(mode: Mode<ScreenManager>) {
    this.currentMode = mode;
    mode.onStart();
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
