import { Vector } from "../../math/Vector";

const AREA_DEBUG = false;

export class Interactible {
  constructor(id, position, triggerArea, prerequisites = []) {
    this.id = id;
    this.position = position;
    this.triggerArea = triggerArea;

    this.prerequisites = prerequisites;
    this.prereqsActive = prerequisites.length === 0;
    this.prereqEntities = [];

    this.isEnabled = false;

    this.isAreaActive = false;

    this.connectionPoint = this.position;
    this.outputPoint = this.position;
  }

  onStart(level) {
    this.findPrerequisites(level);
  }

  findPrerequisites(level) {
    if (this.prereqEntities.length === this.prerequisites.length) {
      return this.prereqEntities;
    }

    this.prereqEntities = level.interactibles.filter((i) =>
      this.prerequisites.includes(i.id)
    );

    return this.prereqEntities;
  }

  /**
   * Update the state of the entity.
   * @param {Vector} playerPosition The position of the player in this update
   */
  update(player, deltaTime, level) {
    this.prereqsActive = this.findPrerequisites().every((i) => i.isEnabled);
    this.isAreaActive =
      this.prereqsActive && this.triggerArea.intersectsPoint(player.position);
  }

  /**
   * Draw the element on the canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(canvas, screenManager) {
    if (AREA_DEBUG) {
      canvas.setColorRGB(255, 255, 255);
      canvas.setLineWidth(0.1);
      canvas.setLineDash([0.2, 0.2]);
      this.triggerArea.stroke(canvas);
    }

    screenManager.behindGroundCanvas.setLineWidth(0.2);
    for (const prereq of this.prereqEntities) {
      screenManager.behindGroundCanvas.setColor(
        prereq.isEnabled ? "white" : "black"
      );
      const xDiff = Vector.manhattanDist(
        prereq.outputPoint,
        this.connectionPoint
      );
      const mid = Vector.lerp(
        prereq.outputPoint,
        this.connectionPoint,
        0.5
      );
      const control = Vector.add(mid, new Vector(0, xDiff * 0.3));
      screenManager.behindGroundCanvas.drawQuadratic(
        prereq.outputPoint.x,
        prereq.outputPoint.y,
        this.connectionPoint.x,
        this.connectionPoint.y,
        control.x,
        control.y
      );
    }
  }

  onInteract() {
    // Maybe return an event
  }
}
