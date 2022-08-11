import { Canvas } from "./Canvas.js";

class ScreenManager {
  constructor() {
    const canvas = Canvas.fromId("canvas");

    if (!(canvas instanceof Canvas)) {
      throw Error("No canvas found!");
    }

    this.canvas = canvas;
    this.canvas.scale(30, 30);
  }

  test() {
    this.canvas.setColor("red");
    this.canvas.fillRect(200, 100, 400, 300);
  }
}

export { ScreenManager };
