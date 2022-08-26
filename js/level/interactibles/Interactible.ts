import { Canvas } from "../../Canvas";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { Entity } from "../entity/Entity";
import { Level } from "../Level";
import { LevelEvent } from "../LevelEvent";

const AREA_DEBUG = false;

export class Interactible extends Entity {
  position: Vector;
  triggerArea: Rectangle | undefined;

  prerequisites: string[];
  prereqsActive: boolean;
  prereqEntities: Interactible[];

  isEnabled: boolean;
  isAreaActive: boolean;
  
  connectionPoint: Vector;
  outputPoint: Vector;

  constructor(id: string, position: Vector, triggerArea: Rectangle | undefined, prerequisites: string[] = []) {
    super(id);

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

  onStart(level: Level) {
    this.findPrerequisites(level);
  }

  findPrerequisites(level?: Level): Interactible[] {
    if (this.prereqEntities.length === this.prerequisites.length) {
      return this.prereqEntities;
    }

    this.prereqEntities = level.interactibles.filter((i) =>
      this.prerequisites.includes(i.id)
    );

    return this.prereqEntities;
  }

  update(player: unknown, _deltaTime: number, level: Level) {
    this.prereqsActive = this.findPrerequisites().every((i) => i.isEnabled);
    this.isAreaActive =
      this.prereqsActive && this.triggerArea?.intersectsPoint(player.position);
  }

  /**
   * Draw the element on the canvas.
   * @param {Canvas} canvas The canvas to draw on.
   */
  draw(screenManager: ScreenManager) {
    const canvas = screenManager.dynamicWorldCanvas;

    if (AREA_DEBUG) {
      canvas.setColorRGB(255, 255, 255);
      canvas.setLineWidth(0.1);
      canvas.setLineDash([0.2, 0.2]);
      this.triggerArea?.stroke(canvas);
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
      const mid = Vector.lerp(prereq.outputPoint, this.connectionPoint, 0.5);
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

  onInteract(): LevelEvent | undefined | void {
    // Maybe return an event
  }
}
