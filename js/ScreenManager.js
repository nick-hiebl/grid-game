import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/ScreenConstants.js";
import { Vector } from "./math/Vector.js";

import { Canvas } from "./Canvas.js";

const REAL_CANVAS = Symbol("real-canvas");

function getRawCanvas() {
  const rawCanvas = document.getElementById("canvas");
  rawCanvas.setAttribute("width", CANVAS_WIDTH);
  rawCanvas.setAttribute("height", CANVAS_HEIGHT);
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
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    this[REAL_CANVAS].drawImageFromCanvas(
      this.dynamicWorldCanvas,
      this.camera.x,
      this.camera.y,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    this[REAL_CANVAS].drawImageFromCanvas(
      this.uiCanvas,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
  }
}

export { ScreenManager };
