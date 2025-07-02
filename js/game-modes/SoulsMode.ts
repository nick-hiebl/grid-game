import { SoulsGameManager } from "../apps/SoulsGameManager";
import { InputEvent, InputState } from "../InputManager";
import { ScreenManager } from "../ScreenManager";
import { Room } from "../souls/Room";

export class SoulsMode {
  gameModeManager: SoulsGameManager;
  room: Room;

  constructor(gameModeManager: SoulsGameManager) {
    this.gameModeManager = gameModeManager;

    this.room = new Room();
  }

  onStart() {

  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.room?.update(deltaTime, inputState);
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.room?.onInput(input);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: ScreenManager) {
    this.room?.draw(screenManager);
  }
}
