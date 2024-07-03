import { SQUARE_CANVAS_SIZE } from "../constants/ScreenConstants";

import { Canvas } from "../Canvas";

const REAL_CANVAS = Symbol("real-canvas");

const WIDTH = SQUARE_CANVAS_SIZE * 2;
const HEIGHT = SQUARE_CANVAS_SIZE;

function getRawCanvas(): HTMLCanvasElement {
  const rawCanvas = document.getElementById("canvas");

  if (!(rawCanvas instanceof HTMLCanvasElement)) {
    throw new Error("Could not find canvas");
  }

  rawCanvas.width = WIDTH;
  rawCanvas.height = HEIGHT;

  return rawCanvas;
}

export class EditorScreen {
  [REAL_CANVAS]: Canvas;
  background: Canvas;
  uiCanvas: Canvas;
  editorCanvas: Canvas;

  constructor() {
    const screenCanvas = new Canvas(getRawCanvas());

    if (!(screenCanvas instanceof Canvas)) {
      throw Error("No canvas found!");
    }

    this[REAL_CANVAS] = screenCanvas;

    this.background = Canvas.fromScratch(WIDTH, HEIGHT);
    this.uiCanvas = Canvas.fromScratch(HEIGHT, HEIGHT);
    this.editorCanvas = Canvas.fromScratch(HEIGHT, HEIGHT);
  }

  drawCanvas(
    canvas: Canvas,
    xOff = 0,
  ) {
    this[REAL_CANVAS].drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      xOff,
      0,
      this[REAL_CANVAS].height,
      this[REAL_CANVAS].height
    );
  }

  drawToScreen() {
    this.drawCanvas(this.background);
    this.drawCanvas(this.editorCanvas, 0);
    this.drawCanvas(this.uiCanvas, HEIGHT);
  }

  static instance = null;
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    return new EditorScreen();
  }
}
