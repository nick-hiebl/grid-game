import { InputEvent, InputManager } from "./InputManager";
import { GameModeManagerEssentials, ScreenManagerEssentials } from "./types";

const MAX_FRAME_TIME = 1 / 20;

/**
 * The head owner of everything.
 */
export class AppCore<Screen extends ScreenManagerEssentials> {
  screenManager: Screen;
  gameModeManager: GameModeManagerEssentials<Screen>;
  inputManager: InputManager;

  lastFrameTime: number;

  constructor(screenManager: Screen, gameModeManager: GameModeManagerEssentials<Screen>, inputManager: InputManager) {
    this.screenManager = screenManager;
    this.gameModeManager = gameModeManager;
    this.inputManager = inputManager;

    this.inputManager.setListener((input) => this.onInput(input));

    this.lastFrameTime = performance.now();
  }

  start() {
    this.inputManager.init();
    this.lastFrameTime = performance.now();
    requestAnimationFrame(() => this.mainLoop());
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.gameModeManager.onInput(input);
  }

  mainLoop() {
    const now = performance.now();
    const deltaTime = Math.min(
      (now - this.lastFrameTime) / 1000,
      MAX_FRAME_TIME
    );
    // Do stuff
    this.gameModeManager.update(deltaTime, this.inputManager.getInputState());
    this.gameModeManager.draw(this.screenManager);
    this.screenManager.drawToScreen();

    // Loop
    requestAnimationFrame(() => this.mainLoop());
    this.lastFrameTime = now;
  }
}
