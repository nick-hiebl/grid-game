import { IS_MOBILE } from "./constants/ScreenConstants";
import { DataLoader } from "./level/DataLoader";

import { GameModeManager } from "./GameModeManager";
import { InputEvent, InputManager } from "./InputManager";
import { ScreenManager } from "./ScreenManager";

const MAX_FRAME_TIME = 1 / 20;

/**
 * The head owner of everything.
 */
class App {
  screenManager: ScreenManager;
  gameModeManager: GameModeManager;
  inputManager: InputManager;

  lastFrameTime: number;

  constructor() {
    this.screenManager = ScreenManager.getInstance();
    this.gameModeManager = new GameModeManager();
    this.inputManager = new InputManager((input) => this.onInput(input));

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

function findById(id: string) {
  const element = document.getElementById(id);

  if (!element) {
    console.warn(`Can't find element with id: ${id}`);
  }

  return element;
}

/**
 * The function used to kick off the whole app.
 */
const main = () => {
  const loading = DataLoader.start();

  loading.then(() => {
    const app = new App();

    app.start();

    (window as any).app = app;
  });

  if (!IS_MOBILE && !location.href.includes("localhost")) {
    Array.from(document.getElementsByTagName("p")).forEach((tag) =>
      tag.classList.add("visible")
    );
  }
  if (!IS_MOBILE) {
    findById("mobile-controls")?.remove();
  }
  if (IS_MOBILE) {
    findById("canvas")?.classList.add("fit-screen");
    findById("mobile-controls")?.classList.remove("hidden");
  }
};

window.onload = () => {
  main();
};
