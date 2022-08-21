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
  update(playerPosition, deltaTime, level) {
    this.prereqsActive = this.findPrerequisites().every((i) => i.isEnabled);
    this.isAreaActive =
      this.prereqsActive && this.triggerArea.intersectsPoint(playerPosition);
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

    canvas.setLineWidth(0.2);
    for (const prereq of this.prereqEntities) {
      canvas.setColor(prereq.isEnabled ? "white" : "black");
      canvas.drawLine(
        prereq.position.x,
        prereq.position.y,
        this.position.x,
        this.position.y
      );
    }
  }

  onInteract() {
    // Maybe return an event
  }
}
