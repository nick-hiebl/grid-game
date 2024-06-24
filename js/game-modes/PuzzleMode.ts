import { PuzzleManager } from "../puzzle-manager/PuzzleManager";
import { Puzzle } from "../puzzle-manager/Puzzle";
import { ClickEvent, InputEvent, InputState } from "../InputManager";
import { SimpleGameManager } from "../apps/SimpleGameManager";
import { SimpleScreen } from "../apps/SimpleScreen";
import { Grouping, Mode } from "../types";
import { DataLoader } from "../level/DataLoader";
import { Rectangle } from "../math/Shapes";
import { DEFAULT_BACKGROUND, PUZZLE_WINDOW_WIDTH, SOLVED_BACKGROUND } from "../puzzle-manager/constants";
import { SQUARE_CANVAS_SIZE } from "../constants/ScreenConstants";
import { distributeRectangles, drawInnerPuzzle } from "./utils";

interface OptionCore {
  isHovered: boolean;
  box: Rectangle;
}

interface LeafOption extends OptionCore {
  puzzle: Puzzle;
}

interface BackOption extends OptionCore {
  action: "back";
}

interface SubgroupOption extends OptionCore {
  action: "subgroup";
  innerGrouping: Grouping;
  childRects: Rectangle[];
}

type PuzzleOption = LeafOption | BackOption | SubgroupOption;

function isLeaf(option: PuzzleOption): option is LeafOption {
  return "puzzle" in option;
}

function isBack(option: PuzzleOption): option is BackOption {
  return "action" in option && option.action === "back";
}

function isSubgroup(option: PuzzleOption): option is SubgroupOption {
  return "action" in option && option.action === "subgroup";
}

const ON_SCREEN_RECTANGLE = Rectangle.centerForm(
  SQUARE_CANVAS_SIZE / 2,
  SQUARE_CANVAS_SIZE / 2,
  PUZZLE_WINDOW_WIDTH / 2,
  PUZZLE_WINDOW_WIDTH / 2,
);

function placeGrouping(grouping: Grouping, hasBackOption: boolean): PuzzleOption[] {
  if (!grouping.children?.length || grouping.isLeaf) {
    throw Error("Drawing leaf to the screen");
  }

  const rectangles = distributeRectangles(ON_SCREEN_RECTANGLE, grouping.children.length);

  const options: PuzzleOption[] = [];

  for (let i = 0; i < grouping.children.length; i++) {
    const child = grouping.children[i];
    const rect = rectangles[i];

    if (child.isLeaf) {
      options.push({
        box: rect,
        isHovered: false,
        puzzle: PuzzleManager.getPuzzle(child.level!),
      });
    } else {
      options.push({
        box: rect,
        isHovered: false,
        action: 'subgroup',
        innerGrouping: child,
        childRects: distributeRectangles(rect.inset(rect.width / 10), child.children?.length ?? 0),
      });
    }
  }

  if (hasBackOption) {
    options.push({
      box: new Rectangle(
        0,
        0,
        (SQUARE_CANVAS_SIZE - PUZZLE_WINDOW_WIDTH) / 2,
        (SQUARE_CANVAS_SIZE - PUZZLE_WINDOW_WIDTH) / 2,
      ),
      isHovered: false,
      action: 'back',
    });
  }

  return options;
}

export class PuzzleMode implements Mode<SimpleScreen> {
  gameModeManager: SimpleGameManager;
  puzzleManager: typeof PuzzleManager;

  currentPuzzle: Puzzle | undefined;

  shapes: PuzzleOption[];

  viewDirty: boolean = true;

  overallGrouping: Grouping;
  groupStack: Grouping[];

  constructor(gameModeManager: SimpleGameManager) {
    this.gameModeManager = gameModeManager;

    this.puzzleManager = PuzzleManager;

    this.overallGrouping = DataLoader.keyGrouping;

    this.groupStack = [this.overallGrouping];

    this.shapes = placeGrouping(this.overallGrouping, false);
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

    for (const stackLevel of this.groupStack.slice().reverse()) {
      let allGood = true;
      for (const child of stackLevel.children ?? []) {
        if (child.isAllSolved || (child.level && this.puzzleManager.getPuzzle(child.level).isSolved)) {
          //
        } else {
          allGood = false;
        }
      }
      if (allGood) {
        stackLevel.isAllSolved = true;
      } else {
        break;
      }
    }

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
            if (isBack(shape) && this.groupStack.length > 1) {
              this.groupStack.splice(this.groupStack.length - 1, 1);
              this.shapes = placeGrouping(this.groupStack[this.groupStack.length - 1], this.groupStack.length > 1);
              this.viewDirty = true;
              break;
            } else if (isSubgroup(shape)) {
              this.groupStack.push(shape.innerGrouping);
              this.shapes = placeGrouping(shape.innerGrouping, true);
              this.viewDirty = true;
              break;
            } else if (isLeaf(shape)) {
              this.currentPuzzle = shape.puzzle;
              this.currentPuzzle.open(1);
              break;
            }
            // this.currentPuzzle = shape.puzzle;
            // this.currentPuzzle.open(1);
            // break;
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

      for (const shape of this.shapes) {
        if (isLeaf(shape)) {
          uiCanvas.setColor(shape.puzzle.isSolved ? SOLVED_BACKGROUND : DEFAULT_BACKGROUND);

          shape.box.draw(uiCanvas);
          drawInnerPuzzle(uiCanvas, shape.box, shape.puzzle);
        } else if (isBack(shape)) {
          uiCanvas.setColor("white");

          shape.box.draw(uiCanvas);
        } else if (isSubgroup(shape)) {
          uiCanvas.setColor(shape.innerGrouping.isAllSolved ? "#ff00ff" : "yellow");

          shape.box.draw(uiCanvas);
        }

        if (shape.isHovered) {
          uiCanvas.setColor("white");
          const outset = shape.box;
          uiCanvas.strokeRect(outset.x1, outset.y1, outset.width, outset.height);
        }

      }

      this.viewDirty = false;
    }
  }
}
