import { CANVAS_HEIGHT, CANVAS_WIDTH, UI_CANVAS_HEIGHT, UI_CANVAS_WIDTH } from "./constants/ScreenConstants.js";
import { Vector } from "./math/Vector.js";

import { Canvas } from "./Canvas.js";

const REAL_CANVAS = Symbol("real-canvas");

function getRawCanvas() {
  const rawCanvas = document.getElementById("canvas");
  rawCanvas.setAttribute("width", UI_CANVAS_WIDTH);
  rawCanvas.setAttribute("height", UI_CANVAS_HEIGHT);
  return rawCanvas;
}

class ScreenManager {
  constructor() {
    const screenCanvas = new Canvas(getRawCanvas());

    if (!(screenCanvas instanceof Canvas)) {
      throw Error("No canvas found!");
    }

    this[REAL_CANVAS] = screenCanvas;

    this.staticWorldCanvas = Canvas.fromScratch(CANVAS_WIDTH * 2, CANVAS_HEIGHT * 2);
    this.dynamicWorldCanvas = Canvas.fromScratch(CANVAS_WIDTH * 2, CANVAS_HEIGHT * 2);
    this.uiCanvas = Canvas.fromScratch(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Stores the top-left position of the camera
    this.camera = new Vector(0, 0);
  }

  setCamera(cameraPosition) {
    this.camera = cameraPosition;
  }

  drawToScreen() {
    this[REAL_CANVAS].drawImageFromCanvas(
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
    this[REAL_CANVAS].drawImageFromCanvas(
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
    this[REAL_CANVAS].drawImageFromCanvas(
      this.uiCanvas,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
  }
}

export { ScreenManager };
