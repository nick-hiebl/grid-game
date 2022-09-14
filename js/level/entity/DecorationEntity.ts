import { DecorationImage } from "../../constants/Image";
import { IS_MOBILE, PIXELS_PER_TILE } from "../../constants/ScreenConstants";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { Entity } from "./Entity";

export class DecorationEntity extends Entity {
  position: Vector;
  width: number;
  height: number;
  tilesetPosition: Vector;
  tilesetWidth: number;
  tilesetHeight: number;
  scaling: boolean;
  hasMobileAlt: boolean;

  constructor(
    id: string,
    position: Vector,
    width: number,
    height: number,
    tilesetPosition: Vector,
    tilesetWidth: number,
    tilesetHeight: number,
    tags: string[]
  ) {
    super(id);
    this.position = position;
    this.width = width;
    this.height = height;
    this.tilesetPosition = tilesetPosition;
    this.tilesetWidth = tilesetWidth;
    this.tilesetHeight = tilesetHeight;
    this.scaling = tags.includes("Scaling");
    this.hasMobileAlt = tags.includes("Mobile_alt");
  }

  draw(screenManager: ScreenManager) {
    const canvas = screenManager.behindGroundCanvas;

    if (this.scaling) {
      // Scale Y only for now

      // Draw top
      canvas.drawImage(
        DecorationImage,
        this.tilesetPosition.x,
        this.tilesetPosition.y,
        this.tilesetWidth,
        PIXELS_PER_TILE, // this.tilesetHeight,
        this.position.x,
        this.position.y,
        this.width,
        1 // this.height
      );
      // Draw bottom
      canvas.drawImage(
        DecorationImage,
        this.tilesetPosition.x,
        this.tilesetPosition.y + this.tilesetHeight - PIXELS_PER_TILE,
        this.tilesetWidth,
        PIXELS_PER_TILE, // this.tilesetHeight,
        this.position.x,
        this.position.y + this.height - 1,
        this.width,
        1 // this.height
      );
      const bottom = this.position.y + this.height - 1;
      const repeatingYSpace = this.tilesetHeight / PIXELS_PER_TILE - 2;
      for (let y = this.position.y + 1; y < this.position.y + this.height - 1; y += repeatingYSpace) {
        const h = Math.min(bottom - y, repeatingYSpace);
        canvas.drawImage(
          DecorationImage,
          this.tilesetPosition.x,
          this.tilesetPosition.y + PIXELS_PER_TILE,
          this.tilesetWidth,
          h * PIXELS_PER_TILE,
          this.position.x,
          y,
          this.width,
          h
        );
      }
      // // Draw stretched middle
      // canvas.drawImage(
      //   DecorationImage,
      //   this.tilesetPosition.x,
      //   this.tilesetPosition.y + PIXELS_PER_TILE,
      //   this.tilesetWidth,
      //   this.tilesetHeight - 2 * PIXELS_PER_TILE,
      //   this.position.x,
      //   this.position.y + 1,
      //   this.width,
      //   this.height - 2
      // );
    } else {
      canvas.drawImage(
        DecorationImage,
        this.tilesetPosition.x,
        this.tilesetPosition.y + (this.hasMobileAlt && IS_MOBILE ? this.tilesetHeight : 0),
        this.tilesetWidth,
        this.tilesetHeight,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }
}
