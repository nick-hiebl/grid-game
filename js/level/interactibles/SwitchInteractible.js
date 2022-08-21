import { EntityImage } from "../../constants/Image.js";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants.js";

import { Interactible } from "./Interactible.js";

export class SwitchInteractible extends Interactible {
  constructor(id, position, area, prerequisites) {
    super(id, position, area, prerequisites);
  }

  update(...args) {
    if (this.isEnabled) {
      this.isAreaActive = false;
    } else {
      super.update(...args);
    }
  }

  draw(canvas, screenManager) {
    super.draw(canvas, screenManager);

    const PIXEL_SCALE = 1 / PIXELS_PER_TILE;

    // Draw hover outline
    if (this.isAreaActive) {
      canvas.setColorRGB(255, 255, 255, 128);
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
