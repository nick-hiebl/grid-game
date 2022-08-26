import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  ON_SCREEN_CANVAS_HEIGHT,
  ON_SCREEN_CANVAS_WIDTH,
  UI_CANVAS_HEIGHT,
  UI_CANVAS_WIDTH,
} from "./constants/ScreenConstants";
import { Vector } from "./math/Vector";

import { Canvas } from "./Canvas";

const REAL_CANVAS = Symbol("real-canvas");

function getRawCanvas(): HTMLCanvasElement {
  const rawCanvas = document.getElementById("canvas");

  if (!(rawCanvas instanceof HTMLCanvasElement)) {
    throw new Error("Could not find canvas");
  }

  rawCanvas.width = ON_SCREEN_CANVAS_WIDTH;
  rawCanvas.height = ON_SCREEN_CANVAS_HEIGHT;

  return rawCanvas;
}

export class ScreenManager {
  [REAL_CANVAS]: Canvas;
  background: Canvas;
  behindGroundCanvas: Canvas;
  staticWorldCanvas: Canvas;
  dynamicWorldCanvas: Canvas;
  uiCanvas: Canvas;
  camera: Vector;

  constructor() {
    const screenCanvas = new Canvas(getRawCanvas());

    if (!(screenCanvas instanceof Canvas)) {
      throw Error("No canvas found!");
    }

    this[REAL_CANVAS] = screenCanvas;

    this.background = Canvas.fromScratch(CANVAS_WIDTH * 3, CANVAS_HEIGHT * 3);
    this.behindGroundCanvas = Canvas.fromScratch(
      CANVAS_WIDTH * 3,
      CANVAS_HEIGHT * 3
    );
    this.staticWorldCanvas = Canvas.fromScratch(
      CANVAS_WIDTH * 3,
      CANVAS_HEIGHT * 3
    );
    this.dynamicWorldCanvas = Canvas.fromScratch(
      CANVAS_WIDTH * 3,
      CANVAS_HEIGHT * 3
    );
    this.uiCanvas = Canvas.fromScratch(
      ON_SCREEN_CANVAS_WIDTH,
      ON_SCREEN_CANVAS_HEIGHT
    );

    // Stores the top-left position of the camera
    this.camera = new Vector(0, 0);
  }

  setCamera(cameraPosition: Vector) {
    this.camera = cameraPosition;
  }

  drawToScreen() {
    this[REAL_CANVAS].drawImage(
      this.background,
      this.camera.x,
      this.camera.y,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
    this[REAL_CANVAS].drawImage(
      this.behindGroundCanvas,
      this.camera.x,
      this.camera.y,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
    this[REAL_CANVAS].drawImage(
      this.staticWorldCanvas,
      this.camera.x,
      this.camera.y,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
    this[REAL_CANVAS].drawImage(
      this.dynamicWorldCanvas,
      this.camera.x,
      this.camera.y,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
    this[REAL_CANVAS].drawImage(
      this.uiCanvas,
      0,
      0,
      UI_CANVAS_WIDTH,
      UI_CANVAS_HEIGHT,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
  }

  static instance = null;
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    return new ScreenManager();
  }
}