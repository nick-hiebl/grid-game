import { Canvas } from "../../Canvas";
import { EntityImage, TileImage } from "../../constants/Image";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants";
import { clamp } from "../../math/Common";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { BlockEnum } from "../BlockTypes";
import { Level } from "../Level";
import { Player } from "../Player";

import { Interactible } from "./Interactible";

const mockTrigger = {
  intersectsPoint: () => false,
  stroke: () => null,
};

const OPEN_CLOSE_DUR = 0.3;

interface Config {
  isFlipped?: boolean;
  hasLedge?: boolean;
  isSingle?: boolean;
}

export class TrapdoorInteractible extends Interactible {
  hasLeft: boolean;
  hasRight: boolean;
  hasLedge: boolean;

  leftHead: Rectangle;
  rightHead: Rectangle;
  leftDoor: Rectangle;
  rightDoor: Rectangle;

  ledge: Rectangle;

  fullWidth: number;
  doorWidth: number;

  constructor(
    id: string,
    position: Vector,
    prerequisites: string[],
    width = 4,
    config: Config = {}
  ) {
    super(id, position, undefined, prerequisites);

    this.connectionPoint = Vector.add(
      position,
      new Vector((config.isFlipped ? 1 : -1) * (width / 2 - 0.9), 0.3)
    );

    const isDouble = !config.isSingle;

    this.hasLeft = isDouble || !config.isFlipped;
    this.hasRight = isDouble || !!config.isFlipped;

    this.hasLedge = !!config.hasLedge;

    this.leftHead = Rectangle.widthForm(
      this.position.x - width / 2,
      this.position.y,
      1.2,
      0.8
    );
    this.rightHead = Rectangle.widthForm(
      this.position.x + width / 2 - 1.2,
      this.position.y,
      1.2,
      0.8
    );
    this.leftDoor = Rectangle.widthForm(
      this.position.x - width / 2,
      this.position.y,
      this.hasRight ? width / 2 : width,
      0.6
    );
    this.rightDoor = Rectangle.widthForm(
      this.position.x - (this.hasLeft ? 0 : width / 2),
      this.position.y,
      this.hasLeft ? width / 2 : width,
      0.6
    );

    this.ledge = Rectangle.widthForm(
      this.position.x - width / 2,
      this.position.y,
      width,
      0.2
    );

    this.fullWidth = width / 2;
    this.doorWidth = this.hasLeft && this.hasRight ? width / 2 : width;
  }

  onStart(level: Level) {
    super.onStart(level);

    if (this.hasLeft) {
      level.addWithoutDuplicate({
        type: BlockEnum.SOLID,
        rect: this.leftHead,
      });
      level.addWithoutDuplicate({
        type: BlockEnum.SOLID,
        rect: this.leftDoor,
      });
    }
    if (this.hasRight) {
      level.addWithoutDuplicate({
        type: BlockEnum.SOLID,
        rect: this.rightHead,
      });
      level.addWithoutDuplicate({
        type: BlockEnum.SOLID,
        rect: this.rightDoor,
      });
    }

    if (this.hasLedge) {
      level.addWithoutDuplicate({
        type: BlockEnum.LEDGE,
        rect: this.ledge,
      });
    }
  }

  update(player: Player, deltaTime: number, level: Level) {
    super.update(player, deltaTime, level);

    const motion = (deltaTime / OPEN_CLOSE_DUR) * (this.prereqsActive ? -1 : 1);

    this.leftDoor.x2 = clamp(
      this.leftDoor.x2 + motion,
      this.leftDoor.x1,
      this.leftDoor.x1 + this.doorWidth
    );

    this.rightDoor.x1 = clamp(
      this.rightDoor.x1 - motion,
      this.rightDoor.x2 - this.doorWidth,
      this.rightDoor.x2
    );
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);

    const canvas = screenManager.dynamicWorldCanvas;

    if (this.hasLedge) {
      for (let x = this.ledge.x1; x < this.ledge.x2; x++) {
        canvas.drawImage(
          TileImage,
          PIXELS_PER_TILE,
          0,
          PIXELS_PER_TILE,
          PIXELS_PER_TILE,
          x,
          this.ledge.y1,
          1,
          1
        );
      }
    }

    if (this.hasLeft) {
      const w = this.leftDoor.width;
      if (w > 0) {
        canvas.setColor("black");
        this.leftDoor.draw(canvas);
        canvas.drawImage(
          EntityImage,
          160 + Math.max(40 - 10 * w, 20) - 10,
          10,
          Math.min(10 * w, 20),
          10,
          Math.max(this.leftDoor.x1, this.leftDoor.x2 - 2),
          this.position.y,
          Math.min(w, 2),
          1
        );
      }

      canvas.drawImage(
        EntityImage,
        this.prereqsActive ? 180 : 160,
        0,
        12,
        8,
        this.leftHead.x1,
        this.leftHead.y1,
        this.leftHead.width,
        this.leftHead.height
      );
    }
    if (this.hasRight) {
      const w = this.rightDoor.width;
      if (w > 0) {
        canvas.setColor("black");
        this.rightDoor.draw(canvas);
        canvas.drawImage(
          EntityImage,
          170,
          30,
          Math.min(10 * w, 20),
          10,
          this.rightDoor.x1,
          this.position.y,
          Math.min(w, 2),
          1
        );
      }

      canvas.drawImage(
        EntityImage,
        this.prereqsActive ? 188 : 168,
        20,
        12,
        8,
        this.rightHead.x1,
        this.rightHead.y1,
        this.rightHead.width,
        this.rightHead.height
      );
    }
  }

  drawForMap(canvas: Canvas): void {
    canvas.setColor("black");

    if (this.hasLeft) {
      this.leftDoor.draw(canvas);
    }
    if (this.hasRight) {
      this.rightDoor.draw(canvas);
    }
  }
}
