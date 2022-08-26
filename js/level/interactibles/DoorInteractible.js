import { EntityImage } from "../../constants/Image";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants";
import { clamp } from "../../math/Common";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { BlockType } from "../BlockTypes.js";

import { Interactible } from "./Interactible.js";

const mockTrigger = {
  intersectsPoint: () => false,
  stroke: () => null,
};

const OPEN_CLOSE_SPEED = 0.2;

export class DoorInteractible extends Interactible {
  constructor(id, position, prerequisites, height = 4) {
    super(id, position, mockTrigger, prerequisites);

    this.connectionPoint = Vector.add(position, new Vector(0, -1.8));

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
      height
    );

    this.fullHeight = height;
  }

  onStart(level) {
    super.onStart(level);

    level.addWithoutDuplicate({
      type: BlockType.SOLID,
      rect: this.headCollider,
    });
    level.addWithoutDuplicate({
      type: BlockType.SOLID,
      rect: this.doorCollider,
    });
  }

  update(player, deltaTime, level) {
    super.update(...arguments);

    const motion =
      (deltaTime / OPEN_CLOSE_SPEED) * (this.prereqsActive ? -1 : 1);

    this.doorCollider.y2 = clamp(
      this.doorCollider.y2 + motion,
      this.doorCollider.y1,
      this.doorCollider.y1 + this.fullHeight
    );
  }

  draw(canvas, screenManager) {
    super.draw(canvas, screenManager);

    const h = this.doorCollider.height;
    if (h > 0) {
      canvas.setColor("black");
      canvas.fillRect(this.position.x - 0.5, this.position.y - 2, 1, h);

      canvas.drawImage(
        EntityImage,
        120,
        Math.max(40 - 10 * h, 20) - 10,
        40,
        Math.min(10 * h, 20),
        this.position.x - 2,
        this.position.y - 2 + Math.max(h - 2, 0),
        4,
        Math.min(h, 2)
      );
    }

    canvas.drawImage(
      EntityImage,
      this.prereqsActive ? 140 : 128,
      0,
      12,
      6,
      this.position.x - 6 / PIXELS_PER_TILE,
      this.position.y - 2,
      12 / PIXELS_PER_TILE,
      6 / PIXELS_PER_TILE
    );
  }
}
