import { PIXELS_PER_TILE } from "../../constants/ScreenConstants.js";
import { Vector } from "../../math/Vector.js";
import {
  DEFAULT_BACKGROUND,
  SOLVED_BACKGROUND,
} from "../../puzzle-manager/constants.js";
import { PuzzleManager } from "../../puzzle-manager/PuzzleManager.js";

import { OpenPuzzleEvent } from "../LevelEvent.js";

import { Interactible } from "./Interactible.js";

export class PuzzleInteractible extends Interactible {
  /**
   * Construct a puzzle interactible entity for the level.
   * @param {Vector} position The position of the visual element
   * @param {Shape} area The area in which the puzzle is active
   */
  constructor(id, position, area, prereqs) {
    super(id, position, area, prereqs);

    this.puzzle = PuzzleManager.getPuzzle(this.id);
    this.connectionPoint = Vector.add(position, new Vector(0, 1.2));
  }

  /**
   * Draw the element on the canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas) {
    // Draw area boundary
    super.draw(canvas);

    const SCREEN_W = 1;
    const PIXEL_SCALE = 1 / PIXELS_PER_TILE;

    // Draw monitor leg
    canvas.setColorRGB(0, 0, 0);
    canvas.fillRect(
      this.position.x - SCREEN_W / 2,
      this.position.y + SCREEN_W,
      SCREEN_W,
      2
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

    canvas.fillRect(
      this.position.x + SCREEN_W - 3 * PIXEL_SCALE,
      this.position.y - SCREEN_W - 4 * PIXEL_SCALE,
      4 * PIXEL_SCALE,
      4 * PIXEL_SCALE
    );

    if (this.puzzle.hasBeenSolvedEver) {
      canvas.setColor("white");
      canvas.fillRect(
        this.position.x + SCREEN_W - 2 * PIXEL_SCALE,
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
    const PAD = PIXEL_SCALE;

    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < rows[row].length; col++) {
        if (rows[row][col]) {
          canvas.fillRect(
            PAD + (col * 2 * (SCREEN_W - PAD)) / rows[row].length,
            PAD + (row * 2 * (SCREEN_W - PAD)) / rows.length,
            PIXEL_SCALE * 2,
            PIXEL_SCALE * 2
          );
        }
      }
    }

    canvas.translate(-offset.x, -offset.y);
  }

  onInteract() {
    return new OpenPuzzleEvent(this.id);
  }
}
