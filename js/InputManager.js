import { Input } from "./constants/Keys.js";
import { UI_CANVAS_WIDTH, ON_SCREEN_CANVAS_WIDTH } from "./constants/ScreenConstants.js";
import { Vector } from "./math/Vector.js";

const KEY_MAP = {
  " ": Input.Jump,
  escape: Input.Escape,
  esc: Input.Escape,
  Escape: Input.Escape,
  Esc: Input.Escape,
  w: Input.Up,
  a: Input.Left,
  s: Input.Down,
  d: Input.Right,
  e: Input.Interact
};

export class InputState {
  constructor(keyMap, mousePosition) {
    this.keyMap = keyMap;
    this.mousePosition = mousePosition;
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

  static empty() {
    return new InputState({});
  }
}

export class InputEvent {
  /**
   * Create an input event.
   * @param {Input} input This identifies the kind of input received
   * @param {Vector?} position The position (for mouse events only)
   */
  constructor() {}

  isForKey() {
    return false;
  }

  isClick() {
    return false;
  }
}

export class KeyPressEvent extends InputEvent {
  constructor(input) {
    super();
    this.input = input;
  }

  isForKey(key) {
    return key === this.input;
  }
}

export class ClickEvent extends InputEvent {
  constructor(position, isRightClick) {
    super();
    this.position = position;
    this.isRight = isRightClick;
  }

  isClick() {
    return true;
  }

  isRightClick() {
    return this.isRight;
  }
}

export class InputManager {
  constructor(listener) {
    this.isMouseDown = false;
    this.isButtonDown = {};
    this.listener = listener;
    this.mousePosition = new Vector(0, 0);

    this.canvas = document.getElementById("canvas");
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
        this.listener(new KeyPressEvent(symbol));
      }
    });

    document.addEventListener("keyup", e => {
      const symbol = KEY_MAP[e.key];
      if (!symbol) {
        return;
      }

      this.isButtonDown[symbol] = false;
    });

    document.addEventListener("mousemove", event => {
      this.mousePosition = this.toCanvasPosition(event);
    });

    document.addEventListener("click", event => {
      this.mousePosition = this.toCanvasPosition(event);

      if (this.listener) {
        this.listener(new ClickEvent(this.mousePosition, false));
      }
    });

    document.addEventListener("contextmenu", event => {
      event.preventDefault();
      this.mousePosition = this.toCanvasPosition(event);

      if (this.listener) {
        this.listener(new ClickEvent(this.mousePosition, true));
      }
    });
  }

  toCanvasPosition(event) {
    return Vector.scale(
      new Vector(
        event.clientX - this.canvas.offsetLeft,
        event.clientY - this.canvas.offsetTop
      ),
      this.canvas.width / this.canvas.clientWidth * UI_CANVAS_WIDTH / ON_SCREEN_CANVAS_WIDTH
    );
  }

  /**
   * @return {InputState} The current state of inputs
   */
  getInputState() {
    return new InputState(this.isButtonDown, this.mousePosition);
  }
}
