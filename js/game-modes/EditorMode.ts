import { Canvas } from "../Canvas";
import { ClickEvent, InputEvent, InputState } from "../InputManager";

import { SQUARE_CANVAS_SIZE } from "../constants/ScreenConstants";
import { Circle, Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import {
  ICON_SHAPES,
  N_CIRCLE_LAYOUT,
  N_SQUARE_LAYOUT,
  SOLVED_BACKGROUND,
} from "../puzzle-manager/constants";
import { PuzzleManager } from "../puzzle-manager/PuzzleManager";
import { Puzzle } from "../puzzle-manager/Puzzle";
import { Mode } from "../types";

import { EditorScreen } from "../apps/EditorScreen";
import { EditorGameManager } from "../apps/EditorGameManager";
import { PuzzleRules } from "../puzzle-manager/PuzzleFactory";

import { distributeGrid, distributeShapesSquare } from "./utils";

function zip<A, B>(as: A[], bs: B[]): [A, B][] {
  return as.map((a, index) => [a, bs[index]]);
}

const PUZZLE_BOX = Rectangle.widthForm(SQUARE_CANVAS_SIZE, 0, SQUARE_CANVAS_SIZE, SQUARE_CANVAS_SIZE);
const EDITOR_BOX = Rectangle.widthForm(0, 0, SQUARE_CANVAS_SIZE, SQUARE_CANVAS_SIZE);

type Signal =
  | { type: "row", index: number; detail: Detail }
  | { type: "column"; index: number; detail: Detail }
  | { type: "width"; moveBy: number }
  | { type: "height"; moveBy: number }
  | { type: "forced-cell"; row: number; column: number; state: boolean | null };

interface BoxButton {
  box: Rectangle;
  simple: true;
}

interface ClickButton {
  box: Rectangle;
  onClick: () => Signal;
  display: string;
}

type Button = BoxButton | ClickButton;

function isClickable(b: Button): b is ClickButton {
  return !("simple" in b);
}

function detailToString(detail: Detail) {
  if (!detail) {
    return "";
  }
  if (detail.type === "circle") {
    return `circle-${detail.value}`;
  } else if (detail.type === "group") {
    return `square-${detail.value}`;
  } else if (detail.type === "blank-group") {
    return `blank-square-${detail.value}`;
  }
  return "";
}

function produceRowColumnOptions(box: Rectangle, index: number, isRow: boolean, details: Detail[]): Button[] {
  return zip(distributeShapesSquare(box, details.length, 0.2), details)
    .map(
      ([box, detail]) =>
        ({
          box,
          onClick: () => ({ type: isRow ? "row" : "column", index, detail }),
          display: detailToString(detail),
        }) as ClickButton,
    );
}

function generateButtons(rows: number, columns: number): Button[] {
  const grid = distributeGrid(EDITOR_BOX, rows + 2, columns + 2);

  const plusW = grid[grid.length - 1][grid[0].length - 1];
  const minusW = grid[grid.length - 1][1];
  const plusH = grid[0][0];
  const minusH = grid[grid.length - 2][0];

  const rowDetails: Detail[] = [null];
  for (let i = 0; i <= columns; i++) {
    rowDetails.push({ type: "circle", value: i });
  }
  for (let i = 1; i <= Math.ceil(columns / 2); i++) {
    rowDetails.push({ type: "group", value: i });
  }
  for (let i = 1; i <= Math.ceil(columns / 2); i++) {
    rowDetails.push({ type: "blank-group", value: i });
  }

  const columnDetails: Detail[] = [null];
  for (let i = 0; i <= rows; i++) {
    columnDetails.push({ type: "circle", value: i });
  }
  for (let i = 1; i <= Math.ceil(rows / 2); i++) {
    columnDetails.push({ type: "group", value: i });
  }
  for (let i = 1; i <= Math.ceil(rows / 2); i++) {
    columnDetails.push({ type: "blank-group", value: i });
  }

  const basics = grid.slice(1, grid.length - 1).map((row) => row.slice(1, row.length - 1));

  const basicButtons: BoxButton[] = basics.flat().map((cell) => ({ box: cell, simple: true }));
  const basicSmarts: ClickButton[] = basics.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      const [on, off, blank] = distributeGrid(cell, 2, 2, 0.2).flat();

      return [
        { box: on, onClick: () => ({ type: "forced-cell", row: rowIndex, column: columnIndex, state: true }), display: "circle-1" },
        { box: off, onClick: () => ({ type: "forced-cell", row: rowIndex, column: columnIndex, state: false }), display: "circle-0" },
        { box: blank, onClick: () => ({ type: "forced-cell", row: rowIndex, column: columnIndex, state: null }), display: "" },
      ] as ClickButton[];
    }).flat();
  }).flat();

  const columnCells = grid[0].slice(1, grid[0].length - 1);
  const rowCells = grid.slice(1, grid.length - 1).map((row) => row[row.length - 1]).flat();

  const actions: ClickButton[] = [
    { box: plusW, onClick: () => ({ type: "width", moveBy: 1 }), display: "plus" },
    { box: minusW, onClick: () => ({ type: "width", moveBy: -1 }), display: "minus" },
    { box: plusH, onClick: () => ({ type: "height", moveBy: 1 }), display: "plus" },
    { box: minusH, onClick: () => ({ type: "height", moveBy: -1 }), display: "minus" },
  ];

  return (actions as Button[])
    // .concat(basicButtons)
    .concat(columnCells.map((box, index) => produceRowColumnOptions(box, index, false, columnDetails)).flat())
    .concat(rowCells.map((box, index) => produceRowColumnOptions(box, index, true, rowDetails)).flat())
    .concat(basicSmarts);
}

type Detail = null | {
  type: "circle" | "group" | "blank-group";
  value: number;
};

const clampDimension = (num: number) => Math.min(Math.max(1, num), 8);

export class EditorMode implements Mode<EditorScreen> {
  gameModeManager: EditorGameManager;
  puzzleManager: typeof PuzzleManager;

  currentPuzzle: Puzzle;

  viewDirty: boolean = true;

  rows = 1;
  cols = 1;

  rowDetails: Detail[] = [null];
  columnDetails: Detail[] = [{ type: "circle", value: 1 }];
  forcedCells: { row: number; col: number; on: boolean }[] = [];

  buttons: Button[];

  constructor(gameModeManager: EditorGameManager) {
    this.gameModeManager = gameModeManager;

    this.puzzleManager = PuzzleManager;

    this.currentPuzzle = this.puzzleManager.instantiate(this.generateRulesFromState());
    this.currentPuzzle.open(1);
    
    this.buttons = generateButtons(this.rows, this.cols);
  }

  onStart() {
    // Do nothing
  }

  setPuzzle() {
    this.currentPuzzle = this.puzzleManager.instantiate(this.generateRulesFromState());
    this.currentPuzzle.open(1);

    this.buttons = generateButtons(this.rows, this.cols);
  }

  generateRulesFromState(): PuzzleRules {
    const rules = {
      rows: this.rows,
      cols: this.cols,
      columnCounts: this.columnDetails.map((detail) => detail && detail.type === "circle" ? detail.value : null),
      rowCounts: this.rowDetails.map((detail) => detail && detail.type === "circle" ? detail.value : null),
      columnGroups: this.columnDetails.map((detail) => detail && detail.type === "group" ? detail.value : null),
      rowGroups: this.rowDetails.map((detail) => detail && detail.type === "group" ? detail.value : null),
      columnBlankGroups: this.columnDetails.map((detail) => detail && detail.type === "blank-group" ? detail.value : null),
      rowBlankGroups: this.rowDetails.map((detail) => detail && detail.type === "blank-group" ? detail.value : null),
      forcedCells: this.forcedCells,
    };
    console.log("Made rules:", rules);
    return rules;
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.currentPuzzle.update(
      deltaTime,
      new InputState(
        inputState.keyMap,
        Vector.diff(inputState.mousePosition, new Vector(SQUARE_CANVAS_SIZE, 0)),
        inputState.leftClicking,
        inputState.rightClicking,
      ),
    );
  }

  killOverflow() {
    this.columnDetails = this.columnDetails.slice(0, this.cols);
    this.rowDetails = this.rowDetails.slice(0, this.rows);
    this.forcedCells = this.forcedCells.filter(({ row, col }) => row < this.rows && col < this.cols);
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    if (input.isClick()) {
      const click = input as ClickEvent;

      if (PUZZLE_BOX.intersectsPoint(click.position)) {
        // clicked puzzle
        this.currentPuzzle.onInput(
          new ClickEvent(
            Vector.diff(click.position, new Vector(SQUARE_CANVAS_SIZE, 0)),
            click.isRight,
          ),
        );
      } else if (EDITOR_BOX.intersectsPoint(click.position)) {
        // clicked editor
        const clickableButtons = this.buttons.filter(isClickable);
        const clickedButton = clickableButtons.find((button) => button.box.intersectsPoint(click.position));

        if (clickedButton) {
          const signal = clickedButton.onClick();
          switch (signal.type) {
            case "width":
              this.cols = clampDimension(this.cols + signal.moveBy);
              this.killOverflow();
              break;
            case "height":
              this.rows = clampDimension(this.rows + signal.moveBy);
              this.killOverflow();
              break;
            case "column":
              this.columnDetails[signal.index] = signal.detail;
              break;
            case "row":
              this.rowDetails[signal.index] = signal.detail;
              break;
            case "forced-cell":
              this.forcedCells = this.forcedCells
                .filter((c) => c.row !== signal.row || c.col !== signal.column);
              
              if (signal.state !== null) {
                this.forcedCells.push({ row: signal.row, col: signal.column, on: signal.state });
              }
          }
          this.setPuzzle();
        }
      }
    }
  }

  drawDisplayOption(uiCanvas: Canvas, box: Rectangle, display: string): boolean {
    if (display in ICON_SHAPES) {
      const shapes = ICON_SHAPES[display];

      uiCanvas.setColor("white");
      for (const shape of shapes) {
        if (shape instanceof Circle) {
          const pos = Vector.add(
            box.midpoint,
            Vector.scale(shape.position, box.width / 2),
          );
          const newCircle = new Circle(pos, shape.radius * box.width / 2);
          newCircle.draw(uiCanvas);
        } else if (shape instanceof Rectangle) {
          const pos = Vector.add(
            box.midpoint,
            Vector.scale(shape.midpoint, box.width / 2),
          );
          const newSquare = Rectangle.centerForm(pos.x, pos.y, shape.width * box.width / 4, shape.height * box.width / 4);

          newSquare.draw(uiCanvas);
        }
      }

      return true;
    }
    if (display.match(/circle\-\d+/)) {
      const n = parseInt(display.slice(7), 10);

      if (0 <= n && n <= 8) {
        uiCanvas.setColor("white");
        for (const circle of N_CIRCLE_LAYOUT[n]) {
          const pos = Vector.add(
            box.midpoint,
            Vector.scale(circle.position, box.width / 2),
          );
          const newCircle = new Circle(pos, circle.radius * box.width / 2);
          if (n === 0) {
            uiCanvas.setLineWidth(circle.radius * box.width / 2);
            uiCanvas.strokeEllipse(
              box.midpoint.x,
              box.midpoint.y,
              circle.radius * box.width * 0.75,
              circle.radius * box.width * 0.75
            );
          } else {
            newCircle.draw(uiCanvas);
          }
        }
        return true;
      }
    } else if (display.match(/square\-\d+/) || display.match(/blank\-square\-\d+/)) {
      const isBlankSquare = display.match(/blank\-square\-\d+/);
      const n = parseInt(display.slice(isBlankSquare ? 13 : 7), 10);

      if (0 <= n && n <= 8) {
        uiCanvas.setColor("white");
        for (const square of N_SQUARE_LAYOUT[n]) {
          const pos = Vector.add(
            box.midpoint,
            Vector.scale(square.midpoint, box.width / 2),
          );
          const newSquare = Rectangle.centerForm(pos.x, pos.y, square.width * box.width / 4, square.width * box.width / 4);

          if (isBlankSquare) {
            uiCanvas.setLineDash([]);
            uiCanvas.setLineWidth(newSquare.width / 4);
            newSquare.stroke(uiCanvas);
          } else {
            newSquare.draw(uiCanvas);
          }
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: EditorScreen) {
    // Draw background
    screenManager.background.setColor("black");
    screenManager.background.fillRect(
      0,
      0,
      screenManager.background.width,
      screenManager.background.height,
    );

    // Draw puzzle if there is one
    this.currentPuzzle.draw(screenManager, true);
    
    const uiCanvas = screenManager.editorCanvas;
    uiCanvas.clear();

    for (const button of this.buttons) {      
      if (isClickable(button)) {
        uiCanvas.setColor(SOLVED_BACKGROUND);
        button.box.draw(uiCanvas);

        this.drawDisplayOption(uiCanvas, button.box, button.display);
      } else {
        uiCanvas.setColor("white");
        button.box.stroke(uiCanvas);
      }
    }

    this.viewDirty = false;
  }
}
