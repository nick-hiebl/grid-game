import { Canvas } from "../../Canvas";
import {
  HORIZONTAL_TILES,
  PIXELS_PER_TILE,
  PIXEL_WIDTH,
  VERTICAL_TILES,
} from "../../constants/ScreenConstants";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { ScreenManager } from "../../ScreenManager";
import { hslaColor } from "../../utils/Color";

type DrawAction = (canvas: Canvas, width: number, height: number) => void;

export class BackgroundArtist {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  lerpFactor(index: number, screenManager: ScreenManager) {
    return (index + 1) / screenManager.parallax.length;
  }

  *iterateArea(
    width: number,
    height: number,
    xStep: number,
    yStep: number
  ): Generator<[number, number, Rectangle]> {
    let col = 0;
    for (let x = 0; x < width; x += xStep) {
      let row = 0;
      for (let y = 0; y < height; y += yStep) {
        yield [row, col, Rectangle.widthForm(x, y, xStep, yStep)];
        row++;
      }
      col++;
    }
  }

  prepareCanvas(
    screenManager: ScreenManager,
    index: number,
    hue: number,
    backColor: Vector,
    foreColor: Vector,
    action: DrawAction
  ) {
    const factor = this.lerpFactor(index, screenManager);
    const scale = PIXELS_PER_TILE * PIXEL_WIDTH;
    const minSize = new Vector(
      HORIZONTAL_TILES * scale,
      VERTICAL_TILES * scale
    );
    const fullSize = new Vector(this.width * scale, this.height * scale);

    const size = Vector.lerp(minSize, fullSize, factor);
    const canvas = screenManager.parallax[index];

    const color = Vector.lerp(backColor, foreColor, factor);

    canvas.setColor(hslaColor(hue, color.x, color.y));

    action(canvas, size.x, size.y);
  }

  draw(screenManager: ScreenManager) {
    const hue = 40;
    const backgroundColor = new Vector(0.28, 0.55);
    const foregroundColor = new Vector(0.7, 0.3);

    screenManager.background.setColor(
      hslaColor(hue, backgroundColor.x, backgroundColor.y)
    );
    screenManager.background.fillRect(
      0,
      0,
      screenManager.background.width,
      screenManager.background.height
    );

    // Narrow vertical pipes
    this.prepareCanvas(
      screenManager,
      0,
      hue,
      backgroundColor,
      foregroundColor,
      (canvas, width, height) => {
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          30,
          height
        )) {
          if (Math.random() > 0.86) {
            rect.draw(canvas);
          }
        }
      }
    );

    this.prepareCanvas(
      screenManager,
      1,
      hue,
      backgroundColor,
      foregroundColor,
      (canvas, width, height) => {
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          70,
          height
        )) {
          if (Math.random() > 0.95) {
            rect.draw(canvas);
          }
        }
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          width,
          70
        )) {
          if (Math.random() > 0.95) {
            rect.draw(canvas);
          }
        }
      }
    );

    // Boxes
    this.prepareCanvas(
      screenManager,
      2,
      hue,
      backgroundColor,
      foregroundColor,
      (canvas, width, height) => {
        const xs = [
          Math.random() * width,
          Math.random() * width,
          Math.random() * width,
        ];
        const ys = [
          Math.random() * height,
          Math.random() * height,
          Math.random() * height,
        ];
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          50,
          50
        )) {
          if (
            xs.some((x) => rect.xInRange(x)) ||
            ys.some((y) => rect.yInRange(y))
          ) {
            canvas.setLineWidth(12);
            rect.stroke(canvas);
            canvas.setLineWidth(6);
            if (Math.random() > 0.2) {
              canvas.drawLine(rect.x1, rect.y1, rect.x2, rect.y2);
            }
            if (Math.random() > 0.2) {
              canvas.drawLine(rect.x2, rect.y1, rect.x1, rect.y2);
            }
          }
        }
      }
    );

    // Thick horizontal and vertical pipes
    this.prepareCanvas(
      screenManager,
      3,
      hue,
      backgroundColor,
      foregroundColor,
      (canvas, width, height) => {
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          90,
          height
        )) {
          if (Math.random() > 0.95) {
            rect.draw(canvas);
          }
        }
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          width,
          90
        )) {
          if (Math.random() > 0.95) {
            rect.draw(canvas);
          }
        }
      }
    );
  }

  updateCameras(screenManager: ScreenManager) {
    const back = new Vector(0, 0);
    const front = screenManager.camera;
    screenManager.parallax.forEach((_, index) => {
      screenManager.parallaxCameras[index] = Vector.lerp(
        back,
        front,
        this.lerpFactor(index, screenManager)
      );
    });
  }
}
