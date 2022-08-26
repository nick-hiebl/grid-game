import { PIXELS_PER_TILE } from "../../constants/ScreenConstants";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import {
  DEFAULT_BACKGROUND,
  SOLVED_BACKGROUND,
} from "../../puzzle-manager/constants";
import { PuzzleManager } from "../../puzzle-manager/PuzzleManager.js";
import { ScreenManager } from "../../ScreenManager";

import { OpenPuzzleEvent } from "../LevelEvent";

import { Interactible } from "./Interactible";

interface Config {
  isFlipped?: boolean;
}

export class PuzzleInteractible extends Interactible {
  puzzleId: string;
  puzzle: unknown;
  config: Config;

  constructor(id: string, position: Vector, area: Rectangle, prereqs: string[], puzzleId: string, config: Config) {
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

    const SCREEN_W = 1;
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

    const offset = new Vector(
      this.position.x - SCREEN_W,
      this.position.y - SCREEN_W
    );

    canvas.translate(offset.x, offset.y);

    canvas.setColor("white");

    // Draw current selection
    const rows = this.puzzle.state;
    const SCREEN_PIXEL =
      (SCREEN_W * 2) / (3 * Math.max(rows.length, rows[0].length) + 1);
    const SCR_WIDTH = SCREEN_PIXEL * (3 * rows[0].length + 1);
    const SCR_HEIGHT = SCREEN_PIXEL * (3 * rows.length + 1);

    const TOP_PAD = Math.max(0, (SCR_WIDTH - SCR_HEIGHT) / 2);
    const LEFT_PAD = Math.max(0, (SCR_HEIGHT - SCR_WIDTH) / 2);

    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < rows[row].length; col++) {
        if (rows[row][col]) {
          canvas.fillRect(
            LEFT_PAD + SCREEN_PIXEL * (3 * col + 1),
            TOP_PAD + SCREEN_PIXEL * (3 * row + 1),
            SCREEN_PIXEL * 2,
            SCREEN_PIXEL * 2
          );
        }
      }
    }

    canvas.translate(-offset.x, -offset.y);
  }

  onInteract() {
    return new OpenPuzzleEvent(this.puzzleId);
  }
}
