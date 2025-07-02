import { AppCore } from "../AppCore";
import { InputManager } from "../InputManager";
import { ScreenManager } from "../ScreenManager";
import { SoulsGameManager } from "./SoulsGameManager";

/**
 * The function used to kick off the whole app.
 */
const main = () => {
  const gameManager = new SoulsGameManager();

  const app = new AppCore(
    ScreenManager.getInstance(),
    gameManager,
    new InputManager(() => undefined),
  );

  app.start();

  (window as any).app = app;
};

window.onload = () => {
  main();
};
