import { PIXELS_PER_TILE, PIXEL_WIDTH } from "../constants/ScreenConstants.js";
import { Vector } from "../math/Vector.js";
import {
  DEFAULT_BACKGROUND,
  SOLVED_BACKGROUND,
} from "../puzzle-manager/constants.js";
import { PuzzleManager } from "../puzzle-manager/PuzzleManager.js";

export class PuzzleInteractible {
  /**
   * Construct a puzzle interactible entity for the level.
   * @param {Vector} position The position of the visual element
   * @param {Shape} area The area in which the puzzle is active
   */
  constructor(id, position, area) {
    this.id = id;
    this.position = position;
    this.area = area;
    this.isTriggered = false;
    this.puzzle = PuzzleManager.getPuzzle(this.id);
  }

  /**
   * Update the state of the entity.
   * @param {Vector} playerPosition The position of the player in this update
   * @param {number} deltaTime The timestep since the last update
   */
  update(playerPosition, deltaTime) {
    this.isTriggered = this.area.intersectsPoint(playerPosition);
  }

  /**
   * Draw the element on the canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas) {
    // Draw area boundary
    if (false) {
      canvas.setColorRGB(255, 255, 255);
      canvas.setLineWidth(0.1);
      canvas.setLineDash([0.2, 0.2]);
      canvas.strokeRect(
        this.area.x1,
        this.area.y1,
        this.area.width,
        this.area.height
      );
    }

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
    if (this.isTriggered) {
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

    if (this.puzzle.isSolved) {
      canvas.setColor("white");
      canvas.fillRect(
        this.position.x + SCREEN_W - 6 * PIXEL_SCALE,
        this.position.y - SCREEN_W - 1 * PIXEL_SCALE,
        PIXEL_SCALE * 2,
        PIXEL_SCALE * 1
      );
    }

    if (this.puzzle.hasBeenSolvedEver) {
      canvas.setColor("yellow");
      canvas.fillRect(
        this.position.x + SCREEN_W - 3 * PIXEL_SCALE,
        this.position.y - SCREEN_W - 1 * PIXEL_SCALE,
        PIXEL_SCALE * 2,
        PIXEL_SCALE * 1
      );
    }

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
}
