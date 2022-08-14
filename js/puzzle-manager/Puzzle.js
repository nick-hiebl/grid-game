import { clamp } from "../math/Common.js";

const OPEN_DURATION = 0.4;
const CLOSE_DURATION = 0.25;

export class Puzzle {
  constructor(id) {
    this.id = id;
    this.openCloseStatus = 0;
    this.isOpen = false;
  }

  open() {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.openCloseStatus = 0;
  }

  close() {
    this.isOpen = false;
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager) {
    if (this.openCloseStatus === 0) {
      return;
    }

    const canvas = screenManager.uiCanvas;
    const t = this.openCloseStatus;
    // Cubic with f(0) = 0, f(1) = 1, f'(1) = 0
    // Feel free to replace this with any other function moving those
    // parameters.
    const pos = Math.pow(t - 1, 3) + 1;

    canvas.translate(0, canvas.height * (1 - pos));

    canvas.setColorRGB(0, 150, 255, 200);
    canvas.fillRect(100, 100, 500, 300);

    canvas.translate(0, -canvas.height * (1 - pos));
  }

  update(deltaTime) {
    if (this.isOpen && this.openCloseStatus < 1) {
      this.openCloseStatus += deltaTime / OPEN_DURATION;
    } else if (!this.isOpen && this.openCloseStatus > 0) {
      this.openCloseStatus -= deltaTime / CLOSE_DURATION;
    }

    this.openCloseStatus = clamp(this.openCloseStatus, 0, 1);
  }
}
