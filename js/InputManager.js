import { Down, Left, Right, Up } from "./constants/Keys.js";

const KEY_MAP = {
  w: Up,
  a: Left,
  s: Down,
  d: Right
};

export class InputManager {
  constructor() {
    this.isMouseDown = false;
    this.isButtonDown = {};
  }

  /**
   * Set up event listeners.
   */
  init() {
    document.addEventListener('keydown', (e) => {
      const symbol = KEY_MAP[e.key];
      if (!symbol) {
        return;
      }

      this.isButtonDown[symbol] = true;
    });

    document.addEventListener('keyup', (e) => {
      const symbol = KEY_MAP[e.key];
      if (!symbol) {
        return;
      }

      this.isButtonDown[symbol] = false;
    });
  }

  getKeyState() {
    return this.isButtonDown;
  }
}
