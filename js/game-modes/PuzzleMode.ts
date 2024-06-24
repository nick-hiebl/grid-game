import { PuzzleManager } from "../puzzle-manager/PuzzleManager";
import { Puzzle } from "../puzzle-manager/Puzzle";
import { ClickEvent, InputEvent, InputState } from "../InputManager";
import { SimpleGameManager } from "../apps/SimpleGameManager";
import { SimpleScreen } from "../apps/SimpleScreen";
import { Grouping, Mode } from "../types";
import { DataLoader } from "../level/DataLoader";
import { Rectangle } from "../math/Shapes";
import { DEFAULT_BACKGROUND, PUZZLE_WINDOW_WIDTH, SOLVED_BACKGROUND } from "../puzzle-manager/constants";
import { SQUARE_CANVAS_SIZE, UI_PIXEL_WIDTH } from "../constants/ScreenConstants";
import { Canvas } from "../Canvas";
import { Vector } from "../math/Vector";
import { distributeRectangles, drawInnerPuzzle } from "./utils";

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

export class PuzzleMode implements Mode<SimpleScreen> {
  gameModeManager: SimpleGameManager;
  puzzleManager: typeof PuzzleManager;

  currentPuzzle: Puzzle | undefined;

  shapes: PuzzleOption[];

  viewDirty: boolean = true;

  overallGrouping: Grouping;

  constructor(gameModeManager: SimpleGameManager) {
    this.gameModeManager = gameModeManager;

    this.puzzleManager = PuzzleManager;

    const puzzles = DataLoader.puzzles;
    this.overallGrouping = DataLoader.keyGrouping;

    console.log(this.overallGrouping)

    const puzzleKeys = Object.keys(puzzles);
    console.log(puzzleKeys);
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
