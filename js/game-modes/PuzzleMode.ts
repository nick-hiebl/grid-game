import { PuzzleManager } from "../puzzle-manager/PuzzleManager";
import { Puzzle } from "../puzzle-manager/Puzzle";
import { ClickEvent, InputEvent, InputState } from "../InputManager";
import { SimpleGameManager } from "../apps/SimpleGameManager";
import { SimpleScreen } from "../apps/SimpleScreen";
import { Mode } from "../types";
import { DataLoader } from "../level/DataLoader";
import { Rectangle } from "../math/Shapes";
import { DEFAULT_BACKGROUND, PUZZLE_WINDOW_WIDTH, SOLVED_BACKGROUND } from "../puzzle-manager/constants";
import { PIXEL_WIDTH, SQUARE_CANVAS_SIZE, UI_PIXEL_WIDTH } from "../constants/ScreenConstants";
import { Canvas } from "../Canvas";
import { Vector } from "../math/Vector";

interface PuzzleOption {
  puzzle: Puzzle;
  box: Rectangle;
  isHovered: boolean;
}

const ON_SCREEN_RECTANGLE = Rectangle.centerForm(
  SQUARE_CANVAS_SIZE / 2,
  SQUARE_CANVAS_SIZE / 2,
  PUZZLE_WINDOW_WIDTH / 2 + UI_PIXEL_WIDTH * 8,
  PUZZLE_WINDOW_WIDTH / 2 + UI_PIXEL_WIDTH * 8
);

function distributeRectangles(container: Rectangle, numPuzzles: number): Rectangle[] {
  const scale = Math.floor(Math.sqrt(numPuzzles));

  const rows = Math.ceil(numPuzzles / scale);
  const columns = scale;

  const spaceWidth = container.width;
  const spaceHeight = container.height;

  function spaceForN(n: number) {
    return 1.5 * n - 0.5;
  }

  function offsetForN(n: number) {
    return n * 1.5;
  }

  const boxSize = Math.min(spaceWidth / spaceForN(columns), spaceHeight / spaceForN(rows));

  const innerContainer = Rectangle.centerForm(
    container.midpoint.x,
    container.midpoint.y,
    (boxSize * spaceForN(columns)) / 2,
    (boxSize * spaceForN(rows)) / 2,
  );

  const shapes = [];

  for (let i = 0; i < numPuzzles; i++) {
    const row = Math.floor(i / columns);
    const column = i % columns;

    shapes.push(Rectangle.widthForm(
      boxSize * offsetForN(column) + innerContainer.x1,
      boxSize * offsetForN(row) + innerContainer.y1,
      boxSize,
      boxSize,
    ));
  }

  return shapes;
}

function drawInnerPuzzle(canvas: Canvas, box: Rectangle, puzzle: Puzzle) {
  const SCREEN_W = box.width / 2;

  const offset = new Vector(
    box.midpoint.x - SCREEN_W,
    box.midpoint.y - SCREEN_W
  );

  canvas.translate(offset.x, offset.y);

  canvas.setColor("white");


  // Draw current selection
  const grid = puzzle.grid;
  const SCREEN_PIXEL =
    (SCREEN_W * 2) / (3 * Math.max(grid.length, grid[0].length) + 1);
  const SCR_WIDTH = SCREEN_PIXEL * (3 * grid[0].length + 1);
  const SCR_HEIGHT = SCREEN_PIXEL * (3 * grid.length + 1);

  const TOP_PAD = Math.max(0, (SCR_WIDTH - SCR_HEIGHT) / 2);
  const LEFT_PAD = Math.max(0, (SCR_HEIGHT - SCR_WIDTH) / 2);

  puzzle.miniElements.forEach(({ row, col, shape }) => {
    if (puzzle.values[grid[row][col].id]) {
      const x0 = LEFT_PAD + SCREEN_PIXEL * (3 * shape.x1 + 1);
      const y0 = TOP_PAD + SCREEN_PIXEL * (3 * shape.y1 + 1);
      const w = SCREEN_PIXEL * (3 * shape.width - 1);
      const h = SCREEN_PIXEL * (3 * shape.height - 1);
      canvas.fillRect(x0, y0, w, h);
    }
  });

  canvas.translate(-offset.x, -offset.y);
}

export class PuzzleMode implements Mode<SimpleScreen> {
  gameModeManager: SimpleGameManager;
  puzzleManager: typeof PuzzleManager;

  currentPuzzle: Puzzle | undefined;

  shapes: PuzzleOption[];

  viewDirty: boolean = true;

  constructor(gameModeManager: SimpleGameManager) {
    this.gameModeManager = gameModeManager;

    this.puzzleManager = PuzzleManager;

    const puzzles = DataLoader.puzzles;

    const puzzleKeys = Object.keys(puzzles);
    const numPuzzles = puzzleKeys.length;

    this.shapes = [];

    const rects = distributeRectangles(ON_SCREEN_RECTANGLE, numPuzzles);

    let i = 0;
    for (const key of puzzleKeys) {
      this.shapes.push({
        puzzle: PuzzleManager.getPuzzle(key),
        // box: Rectangle.widthForm(column * 20, row * 20, 10, 10),
        box: rects[i],
        isHovered: false,
      });
      i++;
    }
    

    // this.currentPuzzle = this.puzzleManager.getPuzzle("intro-1");
  }

  onStart() {
    // Do nothing
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    if (this.currentPuzzle) {
      this.currentPuzzle.update(deltaTime, inputState);
    } else {
      for (const shape of this.shapes) {
        const isHovered = shape.box.intersectsPoint(inputState.mousePosition);
        if (isHovered !== shape.isHovered) {
          this.viewDirty = true;
          shape.isHovered = isHovered;
        }
      }
    }
  }

  dismissCurrentPuzzle() {
    if (!this.currentPuzzle) {
      return;
    }

    this.viewDirty = true;

    this.currentPuzzle = undefined;
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    if (this.currentPuzzle) {
      if (input.isClick()) {
        const click = input as ClickEvent;
        if (!ON_SCREEN_RECTANGLE.intersectsPoint(click.position)) {
          this.dismissCurrentPuzzle();
          return;
        }
      }
      this.currentPuzzle.onInput(input);
    } else {
      if (input.isClick()) {
        const click = input as ClickEvent;
        for (const shape of this.shapes) {
          if (shape.box.intersectsPoint(click.position)) {
            this.currentPuzzle = shape.puzzle;
            this.currentPuzzle.open(1);
            break;
          }
        }
      }
    }
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: SimpleScreen) {
    // Draw background
    screenManager.background.setColor("black");
    screenManager.background.fillRect(
      0,
      0,
      screenManager.background.width,
      screenManager.background.height,
    );

    // Draw puzzle if there is one
    if (this.currentPuzzle) {
      this.currentPuzzle.draw(screenManager);
    } else {
      if (!this.viewDirty) {
        return;
      }

      const uiCanvas = screenManager.uiCanvas;
      uiCanvas.clear();

      for (const { box, isHovered, puzzle } of this.shapes) {
        uiCanvas.setColor(puzzle.isSolved ? SOLVED_BACKGROUND : DEFAULT_BACKGROUND);
        box.draw(uiCanvas);

        if (isHovered) {
          uiCanvas.setColor("white");
          const outset = box;
          uiCanvas.strokeRect(outset.x1, outset.y1, outset.width, outset.height);
        }

        drawInnerPuzzle(uiCanvas, box, puzzle);
      }

      this.viewDirty = false;
    }
  }
}
