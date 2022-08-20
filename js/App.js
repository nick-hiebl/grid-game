import { DataLoader } from "./level/DataLoader.js";

import { GameModeManager } from "./GameModeManager.js";
import { InputManager } from "./InputManager.js";
import { ScreenManager } from "./ScreenManager.js";

const MAX_FRAME_TIME = 1 / 20;

/**
 * The head owner of everything.
 */
class App {
  constructor() {
    this.screenManager = ScreenManager.getInstance();
    this.gameModeManager = new GameModeManager();
    this.inputManager = new InputManager((input) => this.onInput(input));
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
  onInput(input) {
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

/**
 * The function used to kick off the whole app.
 */
const main = () => {
  const app = new App();

  app.start();

  window.app = app;
};

window.onload = () => {
  DataLoader.start().then(() => {
    main();
  });
};
