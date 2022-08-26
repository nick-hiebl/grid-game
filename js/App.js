import { DataLoader } from "./level/DataLoader.js";

import { GameModeManager } from "./GameModeManager.js";
import { InputManager } from "./InputManager.js";
import { ScreenManager } from "./ScreenManager";
import { IS_MOBILE } from "./constants/ScreenConstants";

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
  const loading = DataLoader.start();

  loading.then(() => {
    const app = new App();

    app.start();

    window.app = app;
  });

  if (!IS_MOBILE && !location.href.includes("localhost")) {
    Array.from(document.getElementsByTagName("p")).forEach((tag) =>
      tag.classList.add("visible")
    );
  }
  if (!IS_MOBILE) {
    document.getElementById("mobile-controls").remove();
  }
  if (IS_MOBILE) {
    document.getElementById("canvas").classList.add("fit-screen");
    document.getElementById("mobile-controls").classList.remove("hidden");
  }
};

window.onload = () => {
  main();
};
