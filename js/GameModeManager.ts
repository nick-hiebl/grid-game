import { Input } from "./constants/Keys";
import { MapMode } from "./game-modes/MapMode";
import { PlayMode } from "./game-modes/PlayMode";
import { InputEvent, InputState } from "./InputManager";
import { ScreenManager } from "./ScreenManager";

interface Mode {
  update(deltaTime: number, inputState: InputState): void;
  onInput(inputEvent: InputEvent): void;
  draw(screenManager: ScreenManager): void;
  onStart(): void;
}

export class GameModeManager {
  playMode: PlayMode;
  mapMode: MapMode;

  currentMode: Mode;

  constructor() {
    this.playMode = new PlayMode();
    this.mapMode = new MapMode(this.playMode);

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

  switchToMode(mode: Mode) {
    this.currentMode = mode;
    mode.onStart();
  }

  /**
   * Process an input event
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    let consumed = false;
    if (this.currentMode === this.playMode) {
      if (input.isForKey(Input.Map)) {
        consumed = true;
        this.switchToMode(this.mapMode);
      }
    } else if (this.currentMode === this.mapMode) {
      if (input.isForKey(Input.Escape) || input.isForKey(Input.Map)) {
        consumed = false;
        this.switchToMode(this.playMode);
      }
    }

    if (!consumed) {
      this.currentMode.onInput(input);
    }
  }

  /**
   * Draw the current gamemode.
   * @param {ScreenManager} screenManager The screenManager object.
   */
  draw(screenManager: ScreenManager) {
    this.currentMode.draw(screenManager);
  }
}
