import { clamp } from "../../math/Common";

import { Entity } from "./Entity";

const UNCOVER_DURATION = 0.5;

export class CoverEntity extends Entity {
  constructor(id, coverArea, triggerArea, config = {}) {
    super(id);

    this.coverArea = coverArea;
    this.triggerArea = triggerArea;

    this.coverIsTrigger = !!config.coverIsTrigger;
    this.canReCover = !!config.canReCover;

    this.isUncovered = false;
    this.revealState = 0;
  }

  isPlayerTriggering(player) {
    return this.triggerArea.intersectsPoint(player.position)
      || (this.coverIsTrigger && this.coverArea.intersectsPoint(player.position));
  }

  isOpen(player) {
    if (!this.canReCover) {
      if (this.isUncovered) {
        return true;
      } else {
        this.isUncovered = this.isPlayerTriggering(player);
        return this.isUncovered;
      }
    } else {
      return this.isPlayerTriggering(player);
    }
  }

  onStart(level) {
    super.onStart(level);
  }

  update(player, deltaTime, level) {
    super.update(player, deltaTime, level);

    const isOpen = this.isOpen(player);

    this.revealState = clamp(
      this.revealState + (isOpen ? 1 : -1) * deltaTime / UNCOVER_DURATION,
      0,
      1
    );
  }

  draw(screenManager, c2) {
    super.draw(screenManager);

    
    if (this.revealState < 1) {
      const canvas = screenManager.dynamicWorldCanvas;

      canvas.setColorRGB(0, 0, 0, Math.floor(255 * (1 - Math.pow(this.revealState, 2))));
      this.coverArea.draw(canvas);
    }
  }
}
