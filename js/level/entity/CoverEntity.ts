import { clamp } from "../../math/Common";
import { Rectangle } from "../../math/Shapes";
import { ScreenManager } from "../../ScreenManager";
import { Level } from "../Level";

import { Entity } from "./Entity";

const UNCOVER_DURATION = 0.5;

interface Config {
  coverIsTrigger?: boolean;
  canReCover?: boolean;
}

export class CoverEntity extends Entity {
  coverArea: Rectangle;
  triggerArea: Rectangle;

  coverIsTrigger: boolean;
  canReCover: boolean;
  isUncovered: boolean;

  revealState: number;

  constructor(id: string, coverArea: Rectangle, triggerArea: Rectangle, config: Config = {}) {
    super(id);

    this.coverArea = coverArea;
    this.triggerArea = triggerArea;

    this.coverIsTrigger = !!config.coverIsTrigger;
    this.canReCover = !!config.canReCover;

    this.isUncovered = false;
    this.revealState = 0;
  }

  isPlayerTriggering(player: unknown) {
    return (
      this.triggerArea.intersectsPoint(player.position) ||
      (this.coverIsTrigger && this.coverArea.intersectsPoint(player.position))
    );
  }

  isOpen(player: unknown) {
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

  onStart(level: Level) {
    super.onStart(level);
  }

  update(player: unknown, deltaTime: number, level: Level) {
    super.update(player, deltaTime, level);

    const isOpen = this.isOpen(player);

    this.revealState = clamp(
      this.revealState + (isOpen ? 1 : -1) * (deltaTime / UNCOVER_DURATION),
      0,
      1
    );
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);

    if (this.revealState < 1) {
      const canvas = screenManager.dynamicWorldCanvas;

      canvas.setColorRGB(
        0,
        0,
        0,
        Math.floor(255 * (1 - this.revealState * this.revealState))
      );
      this.coverArea.draw(canvas);
    }
  }
}
