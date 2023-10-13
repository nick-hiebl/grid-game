import { Canvas } from "../Canvas";
import { GameModeManager } from "../GameModeManager";
import {
  ClickEvent,
  InputEvent,
  InputState,
  ScrollEvent,
} from "../InputManager";
import { DataLoader } from "../level/DataLoader";
import { Interactible } from "../level/interactibles/Interactible";
import { PortalInteractible } from "../level/interactibles/PortalInteractible";
import { Level } from "../level/Level";
import { clamp } from "../math/Common";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";
import { PlayMode } from "./PlayMode";

const DEBUG_SHOW_ALL_LEVELS = document.location.toString().includes("localhost");

const MAX_ZOOM = 20;
const MIN_ZOOM = 0.5;
const ZOOM_SPEED = 0.01;

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20];
const ZOOMS_REVERSED = ZOOM_LEVELS.slice();
ZOOMS_REVERSED.reverse();

const MAP_PLAYER_SCALE = 15;

interface MapInteractible {
  level: Level;
  interactible: Interactible;
  isHovered: boolean;
  position: Vector;
}

export class MapMode {
  gameModeManager: GameModeManager;
  playMode: PlayMode;
  cameraPosition: Vector;
  zoom: number;

  mousePosition: Vector;
  isClicked: boolean;

  canvasW: number;
  canvasH: number;

  levelCanvasMap: Map<string, Canvas>;
  drawIcons: MapInteractible[];

  constructor(gameModeManager: GameModeManager) {
    this.gameModeManager = gameModeManager;
    this.playMode = gameModeManager.playMode;
    this.cameraPosition = new Vector(0, 0);
    this.setCameraPos();
    this.zoom = 2;

    this.mousePosition = new Vector(0, 0);
    this.isClicked = false;

    this.canvasW = 0;
    this.canvasH = 0;

    this.levelCanvasMap = new Map<string, Canvas>();
    this.drawIcons = [];
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
    this.drawIcons = this.getIconsToShow();
    this.gameModeManager.enableSections([
      "map-c",
      "zoom-c",
    ]);
  }

  getIconsToShow(): MapInteractible[] {
    const icons: MapInteractible[] = [];
    for (const level of Object.values(DataLoader.levelMap)) {
      for (const interactible of level.interactibles) {
        if (interactible.showAsMapIcon) {
          icons.push({
            level,
            interactible,
            position: Vector.add(level.worldPosition, interactible.position),
            isHovered: false,
          });
        }
      }
    }

    return icons;
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
    const currentWorldPos = this.toWorldPosition(inputState.mousePosition);

    let found: MapInteractible | undefined = undefined;
    for (const icon of this.drawIcons) {
      // Only allow one icon to be hovered
      if (found) {
        icon.isHovered = false;
        continue;
      }

      if (Vector.sqrDist(icon.position, currentWorldPos) < 32) {
        icon.isHovered = true;
        found = icon;
      } else {
        icon.isHovered = false;
      }
    }

    if (inputState.isLeftClicking() && this.isClicked) {
      this.cameraPosition.subtract(
        Vector.diff(currentWorldPos, this.mousePosition)
      );
    } else {
      this.isClicked = false;
    }
  }

  onInput(inputEvent: InputEvent) {
    // Do nothing
    if (inputEvent.isClick()) {
      const hoveredIcon = this.drawIcons.find((icon) => icon.isHovered);

      const isAPortalActive = this.playMode.currentLevel.interactingWith instanceof PortalInteractible;

      if (hoveredIcon && isAPortalActive) {
        const event = hoveredIcon.interactible.clickedOnMap();

        if (event) {
          event.process(this.playMode);
          this.gameModeManager.switchToMode(this.playMode);
        }
      }

      const event = inputEvent as ClickEvent;
      if (!event.isRightClick()) {
        this.mousePosition = this.toWorldPosition(event.position);
        this.isClicked = true;
      }
    } else if (inputEvent.isScroll()) {
      const scroll = inputEvent as ScrollEvent;
      if (scroll.discrete) {
        if (scroll.delta > 0) {
          this.zoom = ZOOM_LEVELS.find(x => x > this.zoom) || MAX_ZOOM;
        } else {
          this.zoom = ZOOMS_REVERSED.find(x => x < this.zoom) || MIN_ZOOM;
        }
      } else {
        this.zoom = clamp(this.zoom + scroll.delta * -ZOOM_SPEED, MIN_ZOOM, MAX_ZOOM);
      }
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

    const currentPlayer = currentLevel.player;

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

    const zoom = this.zoom / 2;

    for (const { level, interactible, isHovered } of this.drawIcons) {
      const offset = Vector.add(level.worldPosition, interactible.position);
      canvas.translate(offset.x, offset.y);
      const innerZoom = isHovered ? zoom * 0.8 : zoom;
      canvas.scale(1 / innerZoom, 1 / innerZoom);

      interactible.drawAsMapIcon(canvas, level);

      canvas.scale(innerZoom, innerZoom);
      canvas.translate(-offset.x, -offset.y);
    }

    canvas.restoreTransform();
  }
}
