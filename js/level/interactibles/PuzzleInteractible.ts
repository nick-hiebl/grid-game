import { Canvas } from "../../Canvas";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import {
  DEFAULT_BACKGROUND,
  SOLVED_BACKGROUND,
} from "../../puzzle-manager/constants";
import { Puzzle } from "../../puzzle-manager/Puzzle";
import { PuzzleManager } from "../../puzzle-manager/PuzzleManager";
import { ScreenManager } from "../../ScreenManager";

import { OpenPuzzleEvent } from "../LevelEvent";

import { Interactible } from "./Interactible";

interface Config {
  isFlipped?: boolean;
}

const SCREEN_W = 1;

const DRAW_CIRCLES = false;

export class PuzzleInteractible extends Interactible {
  puzzleId: string;
  puzzle: Puzzle;
  config: Config;

  constructor(
    id: string,
    position: Vector,
    area: Rectangle,
    prereqs: string[],
    puzzleId: string,
    config: Config
  ) {
    super(id, position, area, prereqs);

    this.puzzleId = puzzleId;
    this.puzzle = PuzzleManager.getPuzzle(puzzleId);
    this.connectionPoint = Vector.add(position, new Vector(0, 1.2));
    this.outputPoint = Vector.add(
      position,
      new Vector(config.isFlipped ? -1 : 1, -1.15)
    );
    this.config = config;
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);

    const canvas = screenManager.dynamicWorldCanvas;

    const PIXEL_SCALE = 1 / PIXELS_PER_TILE;

    // Draw monitor leg
    canvas.setColorRGB(0, 0, 0);
    canvas.fillRect(
      this.position.x - SCREEN_W / 2,
      this.position.y + SCREEN_W,
      SCREEN_W,
      1
    );

    canvas.setLineWidth(PIXEL_SCALE);

    // Draw hover outline
    if (this.isAreaActive) {
      canvas.setColorRGB(255, 255, 255, 128);
      canvas.strokeRectInset(
        this.position.x,
        this.position.y,
        0,
        0,
        -SCREEN_W - PIXEL_SCALE * 1.5
      );
    }

    // Draw monitor outline
    canvas.setColorRGB(0, 0, 0);
    canvas.strokeRectInset(
      this.position.x,
      this.position.y,
      0,
      0,
      -SCREEN_W - PIXEL_SCALE / 2
    );

    // Draw light area
    const isFlippedMul = this.config.isFlipped ? -1 : 1;
    canvas.fillRect(
      this.position.x +
        isFlippedMul * (SCREEN_W - PIXEL_SCALE) -
        2 * PIXEL_SCALE,
      this.position.y - SCREEN_W - 4 * PIXEL_SCALE,
      4 * PIXEL_SCALE,
      4 * PIXEL_SCALE
    );

    if (this.puzzle.hasBeenSolvedEver) {
      this.isEnabled = true;
      canvas.setColor("white");
      canvas.fillRect(
        this.position.x + isFlippedMul * (SCREEN_W - PIXEL_SCALE) - PIXEL_SCALE,
        this.position.y - SCREEN_W - 3 * PIXEL_SCALE,
        PIXEL_SCALE * 2,
        PIXEL_SCALE * 2
      );
    }

    if (this.prereqsActive) {
      // Draw screen
      canvas.setColor(
        this.puzzle.isSolved ? SOLVED_BACKGROUND : DEFAULT_BACKGROUND
      );
      canvas.fillRect(
        this.position.x - SCREEN_W,
        this.position.y - SCREEN_W,
        SCREEN_W * 2,
        SCREEN_W * 2
      );
    }

    this.drawGrid(canvas);
  }

  drawGrid(canvas: Canvas) {
    const offset = new Vector(
      this.position.x - SCREEN_W,
      this.position.y - SCREEN_W
    );

    canvas.translate(offset.x, offset.y);

    canvas.setColor("white");

    // Draw current selection
    const grid = this.puzzle.grid;
    const SCREEN_PIXEL =
      (SCREEN_W * 2) / (3 * Math.max(grid.length, grid[0].length) + 1);
    const SCR_WIDTH = SCREEN_PIXEL * (3 * grid[0].length + 1);
    const SCR_HEIGHT = SCREEN_PIXEL * (3 * grid.length + 1);

    const TOP_PAD = Math.max(0, (SCR_WIDTH - SCR_HEIGHT) / 2);
    const LEFT_PAD = Math.max(0, (SCR_HEIGHT - SCR_WIDTH) / 2);

    this.puzzle.miniElements.forEach(({ row, col, shape }) => {
      if (this.puzzle.values[grid[row][col].id]) {
        const x0 = LEFT_PAD + SCREEN_PIXEL * (3 * shape.x1 + 1);
        const y0 = TOP_PAD + SCREEN_PIXEL * (3 * shape.y1 + 1);
        const w = SCREEN_PIXEL * (3 * shape.width - 1);
        const h = SCREEN_PIXEL * (3 * shape.height - 1);
        if (DRAW_CIRCLES) {
          canvas.fillEllipse(
            x0 + w / 2,
            y0 + h / 2,
            w / 2,
            h / 2
          );
        } else {
          canvas.fillRect(x0, y0, w, h);
        }
      }
    });

    canvas.translate(-offset.x, -offset.y);
  }

  onInteract() {
    return new OpenPuzzleEvent(this.puzzleId);
  }
}
