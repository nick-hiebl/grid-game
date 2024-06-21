import { SQUARE_CANVAS_SIZE } from "../constants/ScreenConstants";
import { Vector } from "../math/Vector";

import { Canvas } from "../Canvas";

const REAL_CANVAS = Symbol("real-canvas");

function getRawCanvas(): HTMLCanvasElement {
  const rawCanvas = document.getElementById("canvas");

  if (!(rawCanvas instanceof HTMLCanvasElement)) {
    throw new Error("Could not find canvas");
  }

  rawCanvas.width = SQUARE_CANVAS_SIZE;
  rawCanvas.height = SQUARE_CANVAS_SIZE;

  return rawCanvas;
}

export class SimpleScreen {
  [REAL_CANVAS]: Canvas;
  background: Canvas;
  uiCanvas: Canvas;

  constructor() {
    const screenCanvas = new Canvas(getRawCanvas());

    if (!(screenCanvas instanceof Canvas)) {
      throw Error("No canvas found!");
    }

    this[REAL_CANVAS] = screenCanvas;

    this.background = Canvas.fromScratch(SQUARE_CANVAS_SIZE, SQUARE_CANVAS_SIZE);
    this.uiCanvas = Canvas.fromScratch(
      SQUARE_CANVAS_SIZE,
      SQUARE_CANVAS_SIZE
    );
  }

  drawCanvas(
    canvas: Canvas,
    width = SQUARE_CANVAS_SIZE,
    height = SQUARE_CANVAS_SIZE
  ) {
    this[REAL_CANVAS].drawImage(
      canvas,
      0,
      0,
      width,
      height,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
  }

  drawToScreen() {
    this.drawCanvas(this.background);
    this.drawCanvas(this.uiCanvas);
  }

  static instance = null;
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    return new SimpleScreen();
  }
}
