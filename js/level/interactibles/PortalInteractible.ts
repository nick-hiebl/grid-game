import { Canvas } from "../../Canvas";
import { EntityImage } from "../../constants/Image";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { Level } from "../Level";
import { LevelEvent, OpenMapEvent, ToPortalEvent } from "../LevelEvent";
import { Player } from "../Player";
import { Interactible } from "./Interactible";


export class PortalInteractible extends Interactible {
  level: Level | undefined;

  constructor(id: string, position: Vector) {
    super(
      id,
      position,
      Rectangle.centerForm(position.x, position.y, 4, 4),
      []
    );

    this.showAsMapIcon = false;
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);

    const canvas = screenManager.dynamicWorldCanvas;

    canvas.drawImage(
      EntityImage,
      this.prereqsActive ? 80 : 0,
      40,
      80,
      80,
      this.position.x - 4,
      this.position.y - 4,
      8,
      8
    );
  }

  update(player: Player, deltaTime: number, level: Level) {
    if (!this.level) {
      this.level = level;
    }

    if (this.prereqsActive) {
      this.showAsMapIcon = true;
    }

    super.update(player, deltaTime, level);
  }

  drawAsMapIcon(canvas: Canvas, level: Level) {
    const primaryColor = level.interactingWith === this ? "#08f" : "red";

    canvas.setColor("black");
    canvas.fillDiamond(0, 0, 7.5, 10.5);
    canvas.setColor(primaryColor);
    canvas.fillDiamond(0, 0, 6, 9);
  }

  onInteract(): void | LevelEvent | undefined {
    if (this.level) {
      return new OpenMapEvent(this, this.level);
    }
  }

  clickedOnMap(): void | LevelEvent | undefined {
    if (this.level) {
      return new ToPortalEvent(this, this.level);
    }
  }
}
