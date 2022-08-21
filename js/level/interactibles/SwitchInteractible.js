import { EntityImage } from "../../constants/Image.js";
import { PIXELS_PER_TILE } from "../../constants/ScreenConstants.js";

import { Interactible } from "./Interactible.js";

export class SwitchInteractible extends Interactible {
  constructor(id, position, area) {
    super(id, position, area);
  }

  draw(canvas) {
    super.draw(canvas);

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
    this.isEnabled = !this.isEnabled;
  }
}
