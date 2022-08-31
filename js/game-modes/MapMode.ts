import {
  ClickEvent,
  InputEvent,
  InputState,
  ScrollEvent,
} from "../InputManager";
import { DataLoader } from "../level/DataLoader";
import { clamp } from "../math/Common";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";
import { PlayMode } from "./PlayMode";

export class MapMode {
  playMode: PlayMode;
  cameraPosition: Vector;
  zoom: number;

  mousePosition: Vector;
  isClicked: boolean;

  canvasW: number;
  canvasH: number;

  constructor(playMode: PlayMode) {
    this.playMode = playMode;
    this.cameraPosition = new Vector(0, 0);
    this.setCameraPos();
    this.zoom = 2;

    this.mousePosition = new Vector(0, 0);
    this.isClicked = false;

    this.canvasW = 0;
    this.canvasH = 0;
  }

  setCameraPos() {
    this.cameraPosition = Vector.add(
      this.playMode.currentLevel.worldPosition,
      this.playMode.currentLevel.player.position
    );
  }

  onStart() {
    this.setCameraPos();
    this.mousePosition = new Vector(0, 0);
    this.isClicked = false;
  }

  toWorldPosition(position: Vector) {
    return Vector.add(
      Vector.scale(
        Vector.diff(position, new Vector(this.canvasW / 2, this.canvasH / 2)),
        1 / this.zoom
      ),
      this.cameraPosition
    );
  }

  update(_deltaTime: number, inputState: InputState) {
    // Do this on start
    if (inputState.isLeftClicking() && this.isClicked) {
      const currentWorldPos = this.toWorldPosition(inputState.mousePosition);
      this.cameraPosition.subtract(
        Vector.diff(currentWorldPos, this.mousePosition)
      );
      // this.mousePosition = currentWorldPos;
    } else {
      this.isClicked = false;
    }
  }

  onInput(inputEvent: InputEvent) {
    // Do nothing
    if (inputEvent.isClick()) {
      const event = inputEvent as ClickEvent;
      if (!event.isRightClick()) {
        this.mousePosition = this.toWorldPosition(event.position);
        this.isClicked = true;
      }
    } else if (inputEvent.isScroll()) {
      const scroll = inputEvent as ScrollEvent;
      this.zoom = clamp(this.zoom + scroll.delta * -0.01, 0.5, 20);
    }
  }

  draw(screenManager: ScreenManager) {
    const currentLevel = this.playMode.currentLevel;

    const canvas = screenManager.uiCanvas;
    this.canvasW = canvas.width;
    this.canvasH = canvas.height;

    canvas.setColor("#223366");
    canvas.fillRect(0, 0, canvas.width, canvas.height);

    canvas.saveTransform();
    canvas.translate(canvas.width / 2, canvas.height / 2);

    canvas.scale(this.zoom, this.zoom);

    canvas.translate(-this.cameraPosition.x, -this.cameraPosition.y);

    for (const level of Object.values(DataLoader.levelMap)) {
      if (!level.visited) {
        continue;
      }

      canvas.setColor("white");
      canvas.fillRect(
        level.worldPosition.x,
        level.worldPosition.y,
        level.width,
        level.height
      );
      canvas.translate(level.worldPosition.x, level.worldPosition.y);

      level.drawForMap(canvas);

      if (currentLevel === level) {
        canvas.setColor("#EF9606");
        canvas.fillEllipse(
          level.player.position.x,
          level.player.position.y,
          3,
          3
        );
        canvas.setColor("black");
        canvas.setLineWidth(1);
        canvas.setLineDash([]);
        canvas.strokeEllipse(
          level.player.position.x,
          level.player.position.y,
          3,
          3
        );
      }

      canvas.translate(-level.worldPosition.x, -level.worldPosition.y);
    }

    for (const level of Object.values(DataLoader.levelMap)) {
      if (level !== currentLevel) {
        continue;
      }

      canvas.translate(level.worldPosition.x, level.worldPosition.y);

      canvas.setColor("#EF9606");
      canvas.fillEllipse(
        level.player.position.x,
        level.player.position.y,
        3,
        3
      );
      canvas.setColor("black");
      canvas.setLineWidth(1);
      canvas.setLineDash([]);
      canvas.strokeEllipse(
        level.player.position.x,
        level.player.position.y,
        3,
        3
      );

      canvas.translate(-level.worldPosition.x, -level.worldPosition.y);
    }

    canvas.restoreTransform();
  }
}
