import { Input } from "./constants/Keys.js";

const KEY_MAP = {
  " ": Input.Jump,
  w: Input.Up,
  a: Input.Left,
  s: Input.Down,
  d: Input.Right,
  e: Input.Interact
};

export class InputState {
  constructor(keyMap) {
    this.keyMap = keyMap;
  }

  /**
   * Check the current value for the horizontal axis input.
   * @return {number} a value from -1 to 1.
   */
  getHorizontalAxis() {
    return +!!this.keyMap[Input.Right] - +!!this.keyMap[Input.Left];
  }

  /**
   * Checks whether an input is currently pressed.
   * @param {Input} input
   */
  isPressed(input) {
    return !!this.keyMap[input];
  }
}

export class InputEvent {
  /**
   * Create an input event.
   * @param {Input} input This identifies the kind of input received
   * @param {Vector?} position The position (for mouse events only)
   */
  constructor(input, position) {
    this.input = input;
    this.position = position;
  }
}

export class InputManager {
  constructor(listener) {
    this.isMouseDown = false;
    this.isButtonDown = {};
    this.listener = listener;
  }

  /**
   * Set up event listeners.
   */
  init() {
    document.addEventListener("keydown", e => {
      if (e.repeat) {
        return;
      }
      const symbol = KEY_MAP[e.key];
      if (!symbol) {
        return;
      }

      this.isButtonDown[symbol] = true;
      if (this.listener) {
        this.listener(new InputEvent(symbol));
      }
    });

    document.addEventListener("keyup", e => {
      const symbol = KEY_MAP[e.key];
      if (!symbol) {
        return;
      }

      this.isButtonDown[symbol] = false;
    });
  }

  /**
   * @return {InputState} The current state of inputs
   */
  getInputState() {
    return new InputState(this.isButtonDown);
  }
}
