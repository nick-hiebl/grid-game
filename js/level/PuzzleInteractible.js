import { Vector } from "../math/Vector.js";

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

    canvas.setColorRGB(0, 0, 0);
    canvas.fillRect(this.position.x - SCREEN_W / 2, this.position.y, SCREEN_W, 2);

    // Draw outline
    if (this.isTriggered) {
      canvas.setColorRGB(255, 255, 255, 128);
      canvas.fillRect(
        this.position.x - SCREEN_W - 0.1,
        this.position.y - SCREEN_W - 0.1,
        SCREEN_W * 2 + 0.2,
        SCREEN_W * 2 + 0.2
      );
    }

    // Draw screen
    canvas.setColorRGB(0, 0, 0);
    canvas.fillRect(this.position.x - SCREEN_W, this.position.y - SCREEN_W, SCREEN_W * 2, SCREEN_W * 2);
  }
}
