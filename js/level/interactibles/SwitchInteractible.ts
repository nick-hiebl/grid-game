import { EntityImage } from "../../constants/Image";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { Level } from "../Level";

import { Interactible } from "./Interactible";

export class SwitchInteractible extends Interactible {
  constructor(id: string, position: Vector, area: Rectangle, prerequisites: string[]) {
    super(id, position, area, prerequisites);
  }

  update(player: unknown, deltaTime: number, level: Level) {
    if (this.isEnabled) {
      this.isAreaActive = false;
    } else {
      super.update(player, deltaTime, level);
    }
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);

    const canvas = screenManager.dynamicWorldCanvas;

    const PIXEL_SCALE = 1 / PIXELS_PER_TILE;

    // Draw hover outline
    if (this.isAreaActive) {
      canvas.setColorRGB(255, 255, 255, 128);
      canvas.setLineWidth(PIXEL_SCALE);
      canvas.setLineDash([]);
      canvas.strokeRectInset(
        this.position.x - PIXEL_SCALE * 3,
        this.position.y - PIXEL_SCALE * 4,
        PIXEL_SCALE * 6,
        PIXEL_SCALE * 8,
        -PIXEL_SCALE * 1.5
      );
    }

    canvas.drawImage(
      EntityImage,
      this.isEnabled ? 80 : 40,
      0,
      PIXELS_PER_TILE * 4,
      PIXELS_PER_TILE * 4,
      this.position.x - 2,
      this.position.y - 2,
      4,
      4
    );
  }

  onInteract() {
    this.isEnabled = true;
  }
}
