import {
  UI_PIXEL_WIDTH,
  UI_CANVAS_HEIGHT,
  UI_CANVAS_WIDTH,
} from "../constants/ScreenConstants";
import { ClickEvent, InputEvent, InputState } from "../InputManager";
import { clamp } from "../math/Common";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";

import {
  CLOSE_DURATION,
  DEFAULT_BACKGROUND,
  OPEN_DURATION,
  PUZZLE_WINDOW_WIDTH,
  SOLVED_BACKGROUND,
} from "./constants";
import { positionGetter } from "./PuzzleSpaceManager";
import { PuzzleValidator } from "./PuzzleValidation";
import { PositionGetter, PuzzleState } from "./types";

const PARTIAL_RADIUS = 0.4;

export class Puzzle {
  id: string;
  openCloseStatus: number;
  isOpen: boolean;
  rows: number;
  cols: number;

  state: PuzzleState;
  elements: {
    row: number;
    col: number;
    shape: Rectangle;
    isHovered: boolean;
  }[];
  positionGetter: PositionGetter;

  validator: PuzzleValidator;
  isSolved: boolean;
  hasBeenSolvedEver: boolean;

  constructor(
    id: string,
    rows: number,
    columns: number,
    validator: PuzzleValidator
  ) {
    this.id = id;
    this.openCloseStatus = 0;
    this.isOpen = false;
    this.rows = rows;
    this.cols = columns;

    this.state = [];
    this.elements = [];

    this.validator = validator;
    this.isSolved = false;
    this.hasBeenSolvedEver = false;

    this.positionGetter = positionGetter(rows, columns);
    for (let row = 0; row < rows; row++) {
      const currentRow = [];

      for (let col = 0; col < columns; col++) {
        currentRow.push(null);

        this.elements.push({
          row,
          col,
          shape: this.positionGetter(row, col).inset(UI_PIXEL_WIDTH),
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

    const slideInOffset = new Vector(0, UI_CANVAS_HEIGHT * pos);
    const puzzleScreenOffset = new Vector(
      (UI_CANVAS_WIDTH - PUZZLE_WINDOW_WIDTH) / 2,
      (UI_CANVAS_HEIGHT - PUZZLE_WINDOW_WIDTH) / 2
    );
    return Vector.add(slideInOffset, puzzleScreenOffset);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: ScreenManager) {
    const canvas = screenManager.uiCanvas;

    canvas.clear();

    if (this.openCloseStatus === 0) {
      return;
    }

    const offset = this.uiPosition();

    canvas.translate(offset.x, offset.y);

    // Draw screen background
    canvas.setColor(this.isSolved ? SOLVED_BACKGROUND : DEFAULT_BACKGROUND);
    canvas.fillRect(0, 0, PUZZLE_WINDOW_WIDTH, PUZZLE_WINDOW_WIDTH);

    // Draw monitor leg
    canvas.setColor("#222222");
    canvas.fillRect(
      PUZZLE_WINDOW_WIDTH / 4,
      PUZZLE_WINDOW_WIDTH,
      PUZZLE_WINDOW_WIDTH / 2,
      PUZZLE_WINDOW_WIDTH
    );

    // Draw monitor outline
    canvas.setLineWidth(UI_PIXEL_WIDTH * 8);
    canvas.setLineDash([]);
    canvas.strokeRectInset(
      0,
      0,
      PUZZLE_WINDOW_WIDTH,
      PUZZLE_WINDOW_WIDTH,
      -UI_PIXEL_WIDTH * 4
    );

    // Draw screen outline
    canvas.setColor("#ffffff64");
    canvas.setLineWidth(UI_PIXEL_WIDTH);

    canvas.strokeRectInset(
      0,
      0,
      PUZZLE_WINDOW_WIDTH,
      PUZZLE_WINDOW_WIDTH,
      UI_PIXEL_WIDTH / 2
    );

    // Draw squares
    for (const element of this.elements) {
      if (element.isHovered) {
        canvas.setColor("white");
      } else {
        canvas.setColor("#ffffff64");
      }
      canvas.setLineDash([]);
      element.shape.stroke(canvas, UI_PIXEL_WIDTH / 2);

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
        canvas.setLineDash([UI_PIXEL_WIDTH * 2, UI_PIXEL_WIDTH * 2]);
        canvas.strokeEllipse(
          mid.x,
          mid.y,
          element.shape.width * PARTIAL_RADIUS,
          element.shape.width * PARTIAL_RADIUS
        );
      }
    }

    this.validator.draw(canvas, this.positionGetter);

    canvas.translate(-offset.x, -offset.y);
  }

  update(deltaTime: number, inputState: InputState) {
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

  onStateChange() {
    this.isSolved = this.validator.isValid(this.state);
    if (this.isSolved) {
      this.hasBeenSolvedEver = true;
    }
  }

  onInput(input: InputEvent) {
    let anyChange = false;
    if (input.isClick()) {
      const click = input as ClickEvent;
      const clickPosition = Vector.diff(click.position, this.uiPosition());
      for (const element of this.elements) {
        element.isHovered = element.shape.intersectsPoint(clickPosition);

        if (element.isHovered) {
          const currentState = this.state[element.row][element.col];

          anyChange = true;

          let nextState = null;
          if (click.isRightClick()) {
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

    if (anyChange) {
      this.onStateChange();
    }
  }
}