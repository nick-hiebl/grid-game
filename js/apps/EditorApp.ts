import { DataLoader } from "../level/DataLoader";

import { AppCore } from "../AppCore";
import { EditorGameManager } from "./EditorGameManager";
import { EditorScreen } from "./EditorScreen";
import { InputManager } from "../InputManager";

/**
 * The function used to kick off the whole app.
 */
const main = () => {
  const loading = DataLoader.start();

  loading.then(() => {
    const gameManager = new EditorGameManager();
    const app = new AppCore(new EditorScreen(), gameManager, new InputManager(() => undefined));

    app.start();

    (window as any).app = app;
  });
};

window.onload = () => {
  main();
};
