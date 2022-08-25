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

const OPEN_CLOSE_SPEED = 0.2;

export class DoorInteractible extends Interactible {
  constructor(id, position, prerequisites, height = 4) {
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
      height
    );

    this.fullHeight = height;
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

    player.collideWithBlock(BlockType.SOLID, this.headCollider, deltaTime);
    if (this.doorCollider.y2 > this.headCollider.y2) {
      player.collideWithBlock(BlockType.SOLID, this.doorCollider, deltaTime);
    }
  }

  draw(canvas, screenManager) {
    super.draw(canvas, screenManager);

    const h = this.doorCollider.height;
    if (h > 0) {
      canvas.setColor("black");
      canvas.fillRect(
        this.position.x - 0.5,
        this.position.y - 2,
        1,
        h
      );
      canvas.setColor("white");
      canvas.fillRect(
        this.position.x - 0.5,
        this.position.y - 2 + Math.max(0, h - 1 / PIXELS_PER_TILE),
        1,
        1 / PIXELS_PER_TILE
      );

      canvas.drawImage(
        EntityImage,
        120,
        Math.max(40 - 10 * h, 20),
        40,
        Math.min(10 * h, 20) - 0.1,
        this.position.x - 2,
        this.position.y - 2 + Math.max(h - 2, 0),
        4,
        Math.min(h, 2) - 0.01
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
