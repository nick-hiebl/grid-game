import { Canvas } from "../../Canvas";
import { EntityImage } from "../../constants/Image";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants";
import { clamp } from "../../math/Common";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { BlockEnum } from "../BlockTypes";
import { Level } from "../Level";
import { Player } from "../Player";

import { Interactible } from "./Interactible";

const OPEN_CLOSE_DURATION = 0.8;

export class DoorInteractible extends Interactible {
  headCollider: Rectangle;
  doorCollider: Rectangle;

  fullHeight: number;

  constructor(
    id: string,
    position: Vector,
    prerequisites: string[],
    height = 4
  ) {
    super(id, position, undefined, prerequisites);

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

  onStart(level: Level) {
    super.onStart(level);

    level.addWithoutDuplicate({
      type: BlockEnum.SOLID,
      rect: this.headCollider,
    });
    level.addWithoutDuplicate({
      type: BlockEnum.SOLID,
      rect: this.doorCollider,
    });
  }

  update(player: Player, deltaTime: number, level: Level) {
    super.update(player, deltaTime, level);

    const motion =
      ((this.fullHeight * deltaTime) / OPEN_CLOSE_DURATION) *
      (this.prereqsActive ? -1 : 1);

    this.doorCollider.y2 = clamp(
      this.doorCollider.y2 + motion,
      this.doorCollider.y1,
      this.doorCollider.y1 + this.fullHeight
    );
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);

    const canvas = screenManager.dynamicWorldCanvas;

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

  drawForMap(canvas: Canvas): void {
    canvas.setColor("black");

    this.doorCollider.draw(canvas);
  }
}
