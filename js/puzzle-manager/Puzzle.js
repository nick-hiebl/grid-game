import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PIXEL_WIDTH,
} from "../constants/ScreenConstants.js";
import { clamp } from "../math/Common.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

const OPEN_DURATION = 0.4;
const CLOSE_DURATION = 0.25;

const PUZZLE_WINDOW_WIDTH = (8 / 9) * CANVAS_HEIGHT;

const PARTIAL_RADIUS = 0.4;

export class Puzzle {
  constructor(id) {
    this.id = id;
    this.openCloseStatus = 0;
    this.isOpen = false;
    this.rows = 5;
    this.cols = 5;

    this.state = [];
    this.elements = [];

    const PAD = 2 * PIXEL_WIDTH;

    const CELL_WIDTH = Math.floor(
      (PUZZLE_WINDOW_WIDTH - PAD * (this.cols + 1)) / this.cols
    );
    const CELL_HEIGHT = Math.floor(
      (PUZZLE_WINDOW_WIDTH - PAD * (this.rows + 1)) / this.rows
    );
    const LEFT_PAD =
      Math.ceil(
        (PUZZLE_WINDOW_WIDTH - (CELL_WIDTH + PAD) * this.cols + PAD) / PAD / 2
      ) * PAD;
    const TOP_PAD =
      Math.ceil(
        (PUZZLE_WINDOW_WIDTH - (CELL_HEIGHT + PAD) * this.rows + PAD) / PAD / 2
      ) * PAD;
    for (let row = 0; row < this.rows; row++) {
      const currentRow = [];

      for (let col = 0; col < this.cols; col++) {
        currentRow.push(null);
        this.elements.push({
          row,
          col,
          shape: Rectangle.widthForm(
            col * (CELL_WIDTH + PAD) + LEFT_PAD,
            row * (CELL_HEIGHT + PAD) + TOP_PAD,
            CELL_WIDTH,
            CELL_HEIGHT
          ),
          isHovered: false,
        });
      }

      this.state.push(currentRow);
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
    // Function with f(0) = 1, f(1) = 0, f"(1) = 0
    // Feel free to replace this with any other function moving those
    // parameters.
    const pos = Math.pow(1 - this.openCloseStatus, 2);

    const slideInOffset = new Vector(0, CANVAS_HEIGHT * pos);
    const puzzleScreenOffset = new Vector(
      (CANVAS_WIDTH - PUZZLE_WINDOW_WIDTH) / 2,
      (CANVAS_HEIGHT - PUZZLE_WINDOW_WIDTH) / 2
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

    canvas.setColor("#0096ffc8");
    canvas.fillRect(0, 0, PUZZLE_WINDOW_WIDTH, PUZZLE_WINDOW_WIDTH);

    // Draw outline
    canvas.setColor("#ffffff64");
    canvas.setLineWidth(PIXEL_WIDTH);

    canvas.strokeRect(
      0 + PIXEL_WIDTH / 2,
      0 + PIXEL_WIDTH / 2,
      PUZZLE_WINDOW_WIDTH - PIXEL_WIDTH,
      PUZZLE_WINDOW_WIDTH - PIXEL_WIDTH
    );

    for (const element of this.elements) {
      if (element.isHovered) {
        canvas.setColor("white");
      } else {
        canvas.setColor("#ffffff64");
      }
      canvas.setLineDash([]);
      canvas.strokeRect(
        element.shape.x1 + PIXEL_WIDTH / 2,
        element.shape.y1 + PIXEL_WIDTH / 2,
        element.shape.width - PIXEL_WIDTH,
        element.shape.height - PIXEL_WIDTH
      );

      const cellState = this.state[element.row][element.col];
      const mid = element.shape.midpoint;
      if (cellState) {
        canvas.setColor("white");
        canvas.fillEllipse(
          mid.x,
          mid.y,
          element.shape.width * PARTIAL_RADIUS,
          element.shape.width * PARTIAL_RADIUS
        );
      } else if (cellState === false) {
        // Might be null, so need exact check
        canvas.setColor("#ffffff64");
        canvas.setLineDash([PIXEL_WIDTH * 2, PIXEL_WIDTH * 2]);
        canvas.strokeEllipse(
          mid.x,
          mid.y,
          element.shape.width * PARTIAL_RADIUS,
          element.shape.width * PARTIAL_RADIUS
        );
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
          const currentState = this.state[element.row][element.col];

          let nextState = null;
          if (input.isRightClick()) {
            // Right click
            // Exact checking bool as currentState is bool or null
            if (currentState === false) {
              nextState = null;
            } else {
              nextState = false;
            }
          } else {
            // Left click
            // Exact checking bool as currentState is bool or null
            if (currentState === true) {
              nextState = null;
            } else {
              nextState = true;
            }
          }
          this.state[element.row][element.col] = nextState;
        }
      }
    }
  }
}
