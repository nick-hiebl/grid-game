import { Input } from "./constants/Keys";
import {
  UI_CANVAS_WIDTH,
  ON_SCREEN_CANVAS_WIDTH,
} from "./constants/ScreenConstants";
import { Vector } from "./math/Vector";

const KEY_MAP: Record<string, Key> = {
  " ": Input.Jump,
  escape: Input.Escape,
  esc: Input.Escape,
  Escape: Input.Escape,
  Esc: Input.Escape,
  w: Input.Up,
  a: Input.Left,
  s: Input.Down,
  d: Input.Right,
  e: Input.Interact,
};

type ValueOf<T> = T[keyof T];

type Key = ValueOf<typeof Input>;

type KeyMap = Record<Key, boolean>;

export class InputState {
  keyMap: KeyMap;
  mousePosition: Vector;

  constructor(keyMap: KeyMap, mousePosition: Vector) {
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
  isPressed(input: Key) {
    return !!this.keyMap[input];
  }

  static empty() {
    return new InputState({}, new Vector(0, 0));
  }
}

export class InputEvent {
  constructor() {}

  isForKey(_key: Key) {
    return false;
  }

  isClick() {
    return false;
  }
}

export class KeyPressEvent extends InputEvent {
  input: Key;

  constructor(input: Key) {
    super();
    this.input = input;
  }

  isForKey(key: Key) {
    return key === this.input;
  }
}

export class ClickEvent extends InputEvent {
  position: Vector;
  isRight: boolean;

  constructor(position: Vector, isRightClick: boolean) {
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
  listener: (inputEvent: InputEvent) => void;

  isMouseDown: boolean;
  isButtonDown: KeyMap;
  mousePosition: Vector;

  canvas: HTMLCanvasElement;

  constructor(listener: (inputEvent: InputEvent) => void) {
    this.isMouseDown = false;
    this.isButtonDown = {};
    this.listener = listener;
    this.mousePosition = new Vector(0, 0);

    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
  }

  /**
   * Set up event listeners.
   */
  init() {
    const onKeyEvent = (symbol: Key) => {
      if (this.listener) {
        this.listener(new KeyPressEvent(symbol));
      }
    };

    document.addEventListener("keydown", (e) => {
      if (e.repeat) {
        return;
      }
      const symbol = KEY_MAP[e.key];
      if (!symbol) {
        return;
      }

      this.isButtonDown[symbol] = true;
      onKeyEvent(symbol);
    });

    document.addEventListener("keyup", (e) => {
      const symbol = KEY_MAP[e.key];
      if (!symbol) {
        return;
      }

      this.isButtonDown[symbol] = false;
    });

    document.addEventListener("mousemove", (event) => {
      this.mousePosition = this.toCanvasPosition(event);
    });

    document.addEventListener("mousedown", (event) => {
      this.mousePosition = this.toCanvasPosition(event);

      if (event.button === 0) {
        this.listener?.(new ClickEvent(this.mousePosition, false));
      } else if (event.button === 2) {
        this.listener?.(new ClickEvent(this.mousePosition, true));
      }
    });

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    const wireButton = (id: string, input: Key) => {
      const btn = document.getElementById(id);

      if (!btn) {
        return;
      }

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.isButtonDown[input] = true;

        onKeyEvent(input);
      });

      btn.addEventListener("touchcancel", (e) => {
        e.preventDefault();
        this.isButtonDown[input] = false;
      });

      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.isButtonDown[input] = false;
      });
    };

    wireButton("left", Input.Left);
    wireButton("right", Input.Right);
    wireButton("jump", Input.Jump);
    wireButton("down", Input.Down);
    wireButton("escape", Input.Escape);
    wireButton("interact", Input.Interact);
  }

  toCanvasPosition(event: MouseEvent) {
    return Vector.scale(
      new Vector(
        event.clientX - this.canvas.offsetLeft,
        event.clientY - this.canvas.offsetTop
      ),
      ((this.canvas.width / this.canvas.clientWidth) * UI_CANVAS_WIDTH) /
        ON_SCREEN_CANVAS_WIDTH
    );
  }

  /**
   * @return {InputState} The current state of inputs
   */
  getInputState() {
    return new InputState(this.isButtonDown, this.mousePosition);
  }
}
