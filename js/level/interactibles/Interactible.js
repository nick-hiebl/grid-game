const AREA_DEBUG = false;

export class Interactible {
  constructor(id, position, triggerArea, prerequisites = []) {
    this.id = id;
    this.position = position;
    this.triggerArea = triggerArea;

    this.prerequisites = prerequisites;

    this.isEnabled = false;

    this.isAreaActive = false;
  }

  /**
   * Update the state of the entity.
   * @param {Vector} playerPosition The position of the player in this update
   */
  update(playerPosition) {
    this.isAreaActive = this.triggerArea.intersectsPoint(playerPosition);
  }

  /**
   * Draw the element on the canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas) {
    if (AREA_DEBUG) {
      canvas.setColorRGB(255, 255, 255);
      canvas.setLineWidth(0.1);
      canvas.setLineDash([0.2, 0.2]);
      this.triggerArea.stroke(canvas);
    }
  }

  onInteract() {
    // Maybe return an event
  }
}
