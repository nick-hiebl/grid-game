import { EntityImage } from "../../constants/Image.js";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants.js";
import { clamp } from "../../math/Common.js";
import { Rectangle } from "../../math/Shapes.js";
import { Vector } from "../../math/Vector.js";

import { Interactible } from "./Interactible.js";

const mockTrigger = {
  intersectsPoint: () => false,
  stroke: () => null,
};

const OPEN_CLOSE_SPEED = 1;

export class DoorInteractible extends Interactible {
  constructor(id, position, prerequisites) {
    super(id, position, mockTrigger, prerequisites);

    console.log("I have prereqs", prerequisites);

    // 1 = fully closed, 0 = fully open
    this.closedness = prerequisites.length === 0 ? 0 : 1;

    this.connectionPoint = Vector.add(position, new Vector(0, -1.5));

    this.headCollider = Rectangle.centerForm(
      this.position.x,
      this.position.y - 1.8,
      0.6,
      0.4
    );
    this.doorCollider = Rectangle.widthForm(
      this.position.x - 0.5,
      this.position.y - 2,
      1,
      4
    );
  }

  onStart(level) {
    super.onStart(level);

    if (!level.objects.includes(this.doorCollider)) {
      level.objects.push(this.doorCollider);
    }

    if (!level.objects.includes(this.headCollider)) {
      level.objects.push(this.headCollider);
    }
  }

  update(playerPosition, deltaTime, level) {
    super.update(...arguments);

    const motion =
      (deltaTime / OPEN_CLOSE_SPEED) * (this.prereqsActive ? -1 : 1);

    this.doorCollider.y2 = clamp(
      this.doorCollider.y2 + motion,
      this.doorCollider.y1,
      this.doorCollider.y1 + 4
    );
  }

  draw(canvas, screenManager) {
    super.draw(canvas, screenManager);

    canvas.drawImage(
      EntityImage,
      this.isEnabled ? 160 : 120,
      0,
      PIXELS_PER_TILE * 4,
      PIXELS_PER_TILE * 4,
      this.position.x - 2,
      this.position.y - 2,
      4,
      4
    );
  }
}
