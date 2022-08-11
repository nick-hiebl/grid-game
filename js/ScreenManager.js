import { Canvas } from "./Canvas.js";
import { Vector } from "./math/Vector.js";

const REAL_CANVAS = Symbol("real-canvas");

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

class ScreenManager {
  constructor() {
    const screenCanvas = Canvas.fromId("canvas");

    if (!(screenCanvas instanceof Canvas)) {
      throw Error("No canvas found!");
    }

    this[REAL_CANVAS] = screenCanvas;
    // this.canvas.scale(60, 60);

    this.canvas = Canvas.fromScratch(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Stores the top-left position of the camera
    this.camera = new Vector(0, 0);
  }

  setCamera(cameraPosition) {
    this.camera = cameraPosition;
  }

  drawToScreen() {
    this[REAL_CANVAS].drawImageFromCanvas(
      this.canvas,
      this.camera.x,
      this.camera.y,
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
