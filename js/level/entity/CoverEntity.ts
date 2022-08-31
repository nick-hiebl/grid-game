import { Canvas } from "../../Canvas";
import { clamp } from "../../math/Common";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { rgbaColor } from "../../utils/Color";
import { Level } from "../Level";
import { Player } from "../Player";

import { Entity } from "./Entity";

const UNCOVER_DURATION = 1;

interface Config {
  coverIsTrigger?: boolean;
  canReCover?: boolean;
}

export class CoverEntity extends Entity {
  coverArea: Rectangle;
  extraCovers: Rectangle[];
  triggerArea: Rectangle;

  coverIsTrigger: boolean;
  canReCover: boolean;
  isUncovered: boolean;

  revealState: number;

  lastPlayerPos: Vector | undefined;

  constructor(
    id: string,
    coverArea: Rectangle,
    extraCovers: Rectangle[],
    triggerArea: Rectangle,
    config: Config = {}
  ) {
    super(id);

    this.coverArea = coverArea;
    this.extraCovers = extraCovers;
    this.triggerArea = triggerArea;

    this.coverIsTrigger = !!config.coverIsTrigger;
    this.canReCover = !!config.canReCover;

    this.isUncovered = false;
    this.revealState = 0;
  }

  playerCollidesCover(player: Player) {
    return (
      this.coverArea.intersectsPoint(player.position) ||
      this.extraCovers.some((cover) => cover.intersectsPoint(player.position))
    );
  }

  isPlayerTriggering(player: Player) {
    return (
      this.triggerArea.intersectsPoint(player.position) ||
      (this.coverIsTrigger && this.playerCollidesCover(player))
    );
  }

  isOpen(player: Player) {
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

  update(player: Player, deltaTime: number, level: Level) {
    super.update(player, deltaTime, level);

    const isOpen = this.isOpen(player);

    this.revealState = clamp(
      this.revealState + (isOpen ? 1 : -1) * (deltaTime / UNCOVER_DURATION),
      0,
      1
    );

    this.lastPlayerPos = player.position;
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);

    // Nothing to draw if fully revealed
    if (this.revealState === 1) {
      return;
    }

    const canvas = screenManager.dynamicWorldCanvas;

    if (this.revealState === 0) {
      canvas.setColor("black");
    } else {
      const size = this.coverArea.width + this.coverArea.height;

      const fadeRange = size * 0.2;
      const pos = this.lastPlayerPos
        ? Vector.lerp(
            this.lastPlayerPos,
            this.coverArea.midpoint,
            this.revealState
          )
        : this.coverArea.midpoint;

      const rOut = (size + fadeRange) * this.revealState;
      const gradient = canvas.createRadialGradient(
        pos.x,
        pos.y,
        Math.max(0, rOut - fadeRange / 2),
        pos.x,
        pos.y,
        rOut + fadeRange / 2
      );
      gradient.addColorStop(0, rgbaColor(0, 0, 0, 0));
      gradient.addColorStop(1, rgbaColor(0, 0, 0, 255));

      canvas.setColor(gradient);
    }

    this.coverArea.draw(canvas);
    this.extraCovers.forEach((cover) => cover.draw(canvas));
  }

  drawForMap(canvas: Canvas) {
    if (this.revealState !== 1) {
      canvas.setColor("black");
      for (const rect of this.extraCovers.concat(this.coverArea)) {
        rect.draw(canvas);
      }
    }
  }
}
