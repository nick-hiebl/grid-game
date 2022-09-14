import { Canvas } from "../Canvas";
import {
  ClickEvent,
  InputEvent,
  InputState,
  ScrollEvent,
} from "../InputManager";
import { DataLoader } from "../level/DataLoader";
import { Player } from "../level/Player";
import { clamp } from "../math/Common";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";
import { PlayMode } from "./PlayMode";

const DEBUG_SHOW_ALL_LEVELS = document.location.toString().includes('localhost');

const MAX_ZOOM = 20;
const MIN_ZOOM = 0.5;
const ZOOM_SPEED = 0.01;

const MAP_PLAYER_SCALE = 15;

export class MapMode {
  playMode: PlayMode;
  cameraPosition: Vector;
  zoom: number;

  mousePosition: Vector;
  isClicked: boolean;

  canvasW: number;
  canvasH: number;

  levelCanvasMap: Map<string, Canvas>;

  constructor(playMode: PlayMode) {
    this.playMode = playMode;
    this.cameraPosition = new Vector(0, 0);
    this.setCameraPos();
    this.zoom = 2;

    this.mousePosition = new Vector(0, 0);
    this.isClicked = false;

    this.canvasW = 0;
    this.canvasH = 0;

    this.levelCanvasMap = new Map<string, Canvas>();
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
    this.predrawLevels();
  }

  predrawLevels() {
    for (const level of Object.values(DataLoader.levelMap)) {
      if (!DEBUG_SHOW_ALL_LEVELS && !level.visited) {
        continue;
      }

      const canvas = this.levelCanvasMap.get(level.key)
        || Canvas.fromScratch(level.width * MAX_ZOOM, level.height * MAX_ZOOM);

      canvas.saveTransform();
      canvas.scale(MAX_ZOOM, MAX_ZOOM);
      level.drawForMap(canvas);
      canvas.restoreTransform();

      this.levelCanvasMap.set(level.key, canvas);
    }
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
      this.zoom = clamp(this.zoom + scroll.delta * -ZOOM_SPEED, MIN_ZOOM, MAX_ZOOM);
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

    let currentPlayer: Player | undefined;

    for (const level of Object.values(DataLoader.levelMap)) {
      const levelCanvas = this.levelCanvasMap.get(level.key);
      if ((!DEBUG_SHOW_ALL_LEVELS && !level.visited) || !levelCanvas) {
        continue;
      }

      canvas.drawImage(
        levelCanvas,
        0,
        0,
        levelCanvas.width,
        levelCanvas.height,
        level.worldPosition.x,
        level.worldPosition.y,
        level.width,
        level.height
      );

      if (currentLevel === level) {
        currentPlayer = level.player;
      }
    }

    if (currentPlayer) {
      const offset = Vector.add(currentLevel.worldPosition, currentPlayer.position);
      canvas.translate(offset.x, offset.y);

      canvas.setLineWidth(2);
      canvas.setLineDash([]);

      canvas.scale(1 / this.zoom, 1 / this.zoom);

      canvas.setColor("white");
      canvas.fillEllipse(0, 0, MAP_PLAYER_SCALE, MAP_PLAYER_SCALE);
      canvas.setColor("black");
      canvas.strokeEllipse(0, 0, MAP_PLAYER_SCALE, MAP_PLAYER_SCALE);

      canvas.scale(this.zoom, this.zoom);

      canvas.translate(-offset.x, -offset.y);
    }

    canvas.restoreTransform();
  }
}
