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
import {
  CellValue,
  PositionGetter,
  PuzzleCellMap,
  PuzzleGrid,
  PuzzleValues,
} from "./types";

const PARTIAL_RADIUS = 0.4;

type DragState = "enabling" | "emptying" | "disabling" | undefined;
type DragKind = "left" | "right" | undefined;

interface Element {
  row: number;
  col: number;
  shape: Rectangle;
  isHovered: boolean;
}

type CellGroup = [number, number][];

export interface PuzzleConfig {
  combinedGroups?: CellGroup[];
}

const SPACE_DEBUG_DRAW = false;

export class Puzzle {
  // Basic info
  id: string;
  rows: number;
  cols: number;

  // Open state
  openCloseStatus: number;
  isOpen: boolean;

  // Puzzle display & state info
  grid: PuzzleGrid;
  values: PuzzleValues;
  cellMap: PuzzleCellMap;
  elements: Element[];
  positionGetter: PositionGetter;
  miniElements: Element[];

  // Validation & completion
  validator: PuzzleValidator;
  isSolved: boolean;
  hasBeenSolvedEver: boolean;

  // Interaction
  dragState: DragState;
  dragKind: DragKind;

  constructor(
    id: string,
    rows: number,
    columns: number,
    validator: PuzzleValidator,
    config: PuzzleConfig = {}
  ) {
    this.id = id;
    this.openCloseStatus = 0;
    this.isOpen = false;
    this.rows = rows;
    this.cols = columns;

    this.validator = validator;
    this.isSolved = false;
    this.hasBeenSolvedEver = false;

    let incId = 0;

    this.positionGetter = positionGetter(rows, columns, validator.validationItems.some((item) => item.drawnOnLeft));

    this.grid = [];

    // Initialise grid
    for (let row = 0; row < rows; row++) {
      const currentRow = [];

      for (let col = 0; col < columns; col++) {
        incId++;
        const cell = {
          row,
          column: col,
          id: incId,
        };
        currentRow.push(cell);
      }

      this.grid.push(currentRow);
    }

    // Combine provided groups with an id
    if (config.combinedGroups) {
      for (const group of config.combinedGroups) {
        incId++;
        const groupId = incId;
        group.forEach(([row, column]) => {
          this.grid[row][column].id = groupId;
        });
      }
    }

    this.values = {};
    this.cellMap = {};

    // Initialise values & cell map
    for (const cell of this.grid.flat()) {
      this.values[cell.id] = null;
      this.cellMap[cell.id] =
        cell.id in this.cellMap ? this.cellMap[cell.id].concat([cell]) : [cell];
    }

    this.elements = [];
    this.miniElements = [];

    // Construct elements
    for (const id in this.cellMap) {
      const cells = this.cellMap[id];

      this.elements.push({
        row: cells[0].row,
        col: cells[0].column,
        shape: Rectangle.merged(
          cells.map(({ row, column }) => this.positionGetter(row, column))
        ).inset(UI_PIXEL_WIDTH),
        isHovered: false,
      });
      this.miniElements.push({
        row: cells[0].row,
        col: cells[0].column,
        shape: Rectangle.merged(
          cells.map(({ row, column }) => Rectangle.widthForm(column, row, 1, 1))
        ),
        isHovered: false,
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

    if (SPACE_DEBUG_DRAW) {
      canvas.setColor('red');
      canvas.setLineDash([]);
      for (let i = -1; i <= this.rows; i++) {
        for (let j = -1; j <= this.cols; j++) {
          this.positionGetter(i, j).stroke(canvas);
        }
      }
    }

    // Draw squares
    for (const element of this.elements) {
      if (element.isHovered) {
        canvas.setColor("white");
      } else {
        canvas.setColor("#ffffff64");
      }
      canvas.setLineDash([]);
      element.shape.stroke(canvas, UI_PIXEL_WIDTH / 2);

      const cellState = this.getElementState(element);
      const mid = element.shape.midpoint;
      const radius =
        Math.min(element.shape.width, element.shape.height) * PARTIAL_RADIUS;
      if (cellState) {
        canvas.setColor("white");
        canvas.fillEllipse(mid.x, mid.y, radius, radius);
      } else if (cellState === false) {
        // Might be null, so need exact check
        canvas.setColor("#ffffff64");
        canvas.setLineDash([UI_PIXEL_WIDTH * 2, UI_PIXEL_WIDTH * 2]);
        canvas.strokeEllipse(mid.x, mid.y, radius, radius);
      }
    }

    this.validator.draw(canvas, this.positionGetter);

    canvas.translate(-offset.x, -offset.y);
  }

  getRowColState(row: number, column: number): CellValue {
    const cell = this.grid[row][column];
    return this.values[cell.id];
  }

  getElementState(element: Element): CellValue {
    return this.getRowColState(element.row, element.col);
  }

  setElementState(element: Element, value: CellValue) {
    const cell = this.grid[element.row][element.col];
    if (value !== this.values[cell.id]) {
      this.values[cell.id] = value;
      this.onStateChange();
    }
  }

  resolveClick(element: Element, left: boolean, right: boolean) {
    if (this.dragKind === undefined) {
      return;
    } else if (this.dragKind === "left" && !left) {
      this.dragKind = undefined;
      this.dragState = undefined;
    } else if (this.dragKind === "right" && !right) {
      this.dragKind = undefined;
      this.dragState = undefined;
    }

    if (this.dragKind === "left") {
      if (this.dragState === undefined) {
        const current = this.getElementState(element);
        if (current !== true) {
          this.dragState = "enabling";
        } else {
          this.dragState = "emptying";
        }
      }

      if (this.dragState === "enabling") {
        this.setElementState(element, true);
      } else if (this.dragState === "emptying") {
        this.setElementState(element, null);
      }
    } else if (this.dragKind === "right") {
      if (this.dragState === undefined) {
        const current = this.getElementState(element);
        if (current !== false) {
          this.dragState = "disabling";
        } else {
          this.dragState = "emptying";
        }
      }

      if (this.dragState === "disabling") {
        this.setElementState(element, false);
      } else if (this.dragState === "emptying") {
        this.setElementState(element, null);
      }
    }
  }

  findPositionElement(position: Vector): Element | undefined {
    let foundElement: Element | undefined = undefined;
    for (const element of this.elements) {
      element.isHovered = element.shape.intersectsPoint(position);
      if (element.isHovered) {
        foundElement = element;
      }
    }
    return foundElement;
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

      const foundElement = this.findPositionElement(position);

      if (foundElement) {
        this.resolveClick(
          foundElement,
          inputState.isLeftClicking(),
          inputState.isRightClicking()
        );
      }
    } else {
      this.dragState = undefined;
    }
  }

  onStateChange() {
    this.isSolved = this.validator.isValid(this.grid, this.values);
    if (this.isSolved) {
      this.hasBeenSolvedEver = true;
    }
  }

  onInput(input: InputEvent) {
    if (input.isClick()) {
      const click = input as ClickEvent;
      const clickPosition = Vector.diff(click.position, this.uiPosition());

      this.dragKind = click.isRightClick() ? "right" : "left";
      this.dragState = undefined;

      const foundElement = this.findPositionElement(clickPosition);

      if (foundElement) {
        this.resolveClick(
          foundElement,
          this.dragKind === "left",
          this.dragKind === "right"
        );
      }
    }
  }
}
