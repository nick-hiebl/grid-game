import { clamp } from "../math/Common.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

const OPEN_DURATION = 0.4;
const CLOSE_DURATION = 0.25;

const PUZZLE_WINDOW_WIDTH = 960;

export class Puzzle {
  constructor(id) {
    this.id = id;
    this.openCloseStatus = 0;
    this.isOpen = false;

    this.elements = [];
    for (let i = 0; i < 9; i++) {
      const x = i % 3;
      const y = Math.floor(i / 3);

      this.elements.push({
        shape: Rectangle.widthForm(x * 315 + 15, y * 315 + 15, 300, 300),
        isEnabled: false,
        isHovered: false
      });
    }
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

  uiPosition() {
    // Function with f(0) = 1, f(1) = 0, f'(1) = 0
    // Feel free to replace this with any other function moving those
    // parameters.
    const pos = Math.pow(1 - this.openCloseStatus, 2);

    const slideInOffset = new Vector(0, canvas.height * pos);
    const puzzleScreenOffset = new Vector(
      (canvas.width - PUZZLE_WINDOW_WIDTH) / 2,
      (canvas.height - PUZZLE_WINDOW_WIDTH) / 2
    );
    return Vector.add(slideInOffset, puzzleScreenOffset);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager) {
    const canvas = screenManager.uiCanvas;

    canvas.clear();

    if (this.openCloseStatus === 0) {
      return;
    }

    const offset = this.uiPosition();

    canvas.translate(offset.x, offset.y);

    canvas.setColorRGB(0, 150, 255, 200);
    canvas.fillRect(0, 0, PUZZLE_WINDOW_WIDTH, PUZZLE_WINDOW_WIDTH);

    // Draw outline
    canvas.setColorRGB(255, 255, 255, 100);
    canvas.setLineWidth(6);
    const LW = 3;
    canvas.strokeRect(
      0 + LW,
      0 + LW,
      PUZZLE_WINDOW_WIDTH - LW * 2,
      PUZZLE_WINDOW_WIDTH - LW * 2
    );

    for (const element of this.elements) {
      if (element.isHovered) {
        canvas.setColorRGB(255, 255, 255, 255);
      } else {
        canvas.setColorRGB(255, 255, 255, 100);
      }
      canvas.strokeRect(
        element.shape.x1 + LW,
        element.shape.y1 + LW,
        element.shape.width - LW * 2,
        element.shape.height - LW * 2
      );

      if (element.isEnabled) {
        const mid = element.shape.midpoint;
        canvas.fillEllipse(mid.x, mid.y, 120, 120);
      }
    }

    canvas.translate(-offset.x, -offset.y);
  }

  update(deltaTime, inputState) {
    if (this.isOpen && this.openCloseStatus < 1) {
      this.openCloseStatus += deltaTime / OPEN_DURATION;
    } else if (!this.isOpen && this.openCloseStatus > 0) {
      this.openCloseStatus -= deltaTime / CLOSE_DURATION;
    }

    this.openCloseStatus = clamp(this.openCloseStatus, 0, 1);

    if (inputState) {
      const position = Vector.diff(inputState.mousePosition, this.uiPosition());

      for (const element of this.elements) {
        element.isHovered = element.shape.intersectsPoint(position);
      }
    }
  }

  onInput(input) {
    if (input.isClick()) {
      const clickPosition = Vector.diff(input.position, this.uiPosition());
      for (const element of this.elements) {
        element.isHovered = element.shape.intersectsPoint(clickPosition);

        if (element.isHovered) {
          element.isEnabled = !element.isEnabled;
        }
      }
    }
  }
}
