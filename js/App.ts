import { IS_MOBILE } from "./constants/ScreenConstants";
import { DataLoader } from "./level/DataLoader";

import { AppCore } from "./AppCore";
import { GameModeManager } from "./GameModeManager";
import { InputManager } from "./InputManager";
import { ScreenManager } from "./ScreenManager";

function findById(id: string) {
  const element = document.getElementById(id);

  if (!element) {
    console.warn(`Can't find element with id: ${id}`);
  }

  return element;
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * The function used to kick off the whole app.
 */
const main = () => {
  const loading = DataLoader.start();

  loading.then(() => {
    const app = new AppCore(
      ScreenManager.getInstance(),
      new GameModeManager(),
      new InputManager(() => undefined),
    );

    app.start();

    (window as any).app = app;
  });

  if (!IS_MOBILE) {
    findById("mobile-controls")?.remove();
  }
  if (IS_MOBILE) {
    findById("canvas")?.classList.add("fit-screen");
    findById("mobile-controls")?.classList.remove("hidden");

    const fullScreenButton = findById("fullscreen");

    if (!fullScreenButton) {
      // Do nothing
    } else if (inIframe()) {
      fullScreenButton.classList.add("hidden");
    } else {
      fullScreenButton.addEventListener("click", () => {
        if (document.fullscreenElement) {
          fullScreenButton.classList.remove("smaller");
          document.exitFullscreen();
        } else {
          document.body.requestFullscreen({
            navigationUI: 'hide',
          }).then(() => {
            fullScreenButton.classList.add("smaller");
          });
        }
      });
    }

  }
};

window.onload = () => {
  main();
};
