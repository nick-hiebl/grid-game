import { EntityImage } from "../../constants/Image.js";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants.js";
import { clamp } from "../../math/Common.js";
import { Rectangle } from "../../math/Shapes.js";
import { Vector } from "../../math/Vector.js";
import { BlockType } from "../BlockTypes.js";

import { Interactible } from "./Interactible.js";

const mockTrigger = {
  intersectsPoint: () => false,
  stroke: () => null,
};

const OPEN_CLOSE_SPEED = 0.4;

export class DoorInteractible extends Interactible {
  constructor(id, position, prerequisites) {
    super(id, position, mockTrigger, prerequisites);

    // 1 = fully closed, 0 = fully open
    this.closedness = prerequisites.length === 0 ? 0 : 1;

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
      4
    );
  }

  update(player, deltaTime, level) {
    super.update(...arguments);

    const motion =
      (deltaTime / OPEN_CLOSE_SPEED) * (this.prereqsActive ? -1 : 1);

    this.doorCollider.y2 = clamp(
      this.doorCollider.y2 + motion,
      this.doorCollider.y1,
      this.doorCollider.y1 + 4
    );

    player.collideWithBlock(BlockType.SOLID, this.headCollider, deltaTime);
    player.collideWithBlock(BlockType.SOLID, this.doorCollider, deltaTime);
  }

  draw(canvas, screenManager) {
    super.draw(canvas, screenManager);

    const h = this.doorCollider.height;
    if (h > 0) {
      const pixH = Math.floor(PIXELS_PER_TILE * h);
      const intH = +(pixH / PIXELS_PER_TILE).toFixed(1);
      const rem = h - intH;
      canvas.drawImage(
        EntityImage,
        0,
        40 + (40 - pixH),
        PIXELS_PER_TILE * 4,
        pixH,
        this.position.x - 2,
        this.position.y - 2 + rem,
        4,
        intH
      );
    }

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
