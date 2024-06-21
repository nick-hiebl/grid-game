import { DataLoader } from "../level/DataLoader";

import { AppCore } from "../AppCore";
import { InputManager } from "../InputManager";
import { SimpleGameManager } from "./SimpleGameManager";
import { SimpleScreen } from "./SimpleScreen";

/**
 * The function used to kick off the whole app.
 */
const main = () => {
  const loading = DataLoader.start();

  loading.then(() => {
    const gameManager = new SimpleGameManager();
    const app = new AppCore(new SimpleScreen(), gameManager, new InputManager(() => undefined));

    app.start();

    (window as any).app = app;

    const main = document.getElementById("main");
    if (main) {
      main.addEventListener("click", (e) => {
        if (e.target === main) {
          gameManager.puzzleMode.dismissCurrentPuzzle();
        }
      });
    }
  });
};

window.onload = () => {
  main();
};
