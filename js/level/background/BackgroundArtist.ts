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
import { hexToHue, hslaColor } from "../../utils/Color";

type DrawAction = (canvas: Canvas, width: number, height: number) => void;

export class BackgroundArtist {
  width: number;
  height: number;

  hue: number;

  constructor(width: number, height: number, bgColor: string) {
    this.width = width;
    this.height = height;

    this.hue = hexToHue(bgColor);
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

    canvas.setColor(hslaColor(this.hue, color.x, color.y));

    action(canvas, size.x, size.y);
  }

  getBackgroundHSL(): [number, Vector] {
    return [this.hue, new Vector(0.14, 0.64)];
  }

  getBackgroundColor() {
    const [hue, { x: saturation, y: lightness }] = this.getBackgroundHSL();

    return hslaColor(hue, saturation, lightness);
  }

  draw(screenManager: ScreenManager) {
    const backgroundColor = new Vector(0.14, 0.64);
    const foregroundColor = new Vector(0.3, 0.24);

    screenManager.background.setColor(
      hslaColor(this.hue, backgroundColor.x, backgroundColor.y)
    );
    screenManager.background.fillRect(
      0,
      0,
      screenManager.background.width,
      screenManager.background.height
    );

    for (const canvas of screenManager.parallax) {
      canvas.clear();
    }

    // Thick horizontal and vertical beams
    this.prepareCanvas(
      screenManager,
      0,
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

    // Structural vertical beams
    this.prepareCanvas(
      screenManager,
      1,
      backgroundColor,
      foregroundColor,
      (canvas, width, height) => {
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          120,
          height
        )) {
          if (Math.random() > 0.9) {
            const thickWidth = 20;
            canvas.setLineWidth(thickWidth * 2);
            canvas.drawLine(rect.x1, rect.y1, rect.x1, rect.y2);
            canvas.drawLine(rect.x2, rect.y1, rect.x2, rect.y2);

            const beamWidth = 10;
            canvas.setLineWidth(beamWidth * 2);
            const yOffset = Math.floor(Math.random() * 240);
            for (const [_row2, _col2, rect2] of this.iterateArea(
              1,
              height,
              1,
              240
            )) {
              const y = rect2.y1 + yOffset;
              canvas.drawLine(rect.x1, y, rect.x2, y);
              const radius = 20;
              canvas.outerCircleCorner(
                rect.x2 - thickWidth - radius,
                y - beamWidth - radius,
                20,
                0
              );
              canvas.outerCircleCorner(
                rect.x1 + thickWidth + radius,
                y - beamWidth - radius,
                20,
                Math.PI / 2
              );
              canvas.outerCircleCorner(
                rect.x1 + thickWidth + radius,
                y + beamWidth + radius,
                20,
                Math.PI
              );
              canvas.outerCircleCorner(
                rect.x2 - thickWidth - radius,
                y + beamWidth + radius,
                20,
                (Math.PI * 3) / 2
              );
            }
          }
        }
      }
    );

    // Boxes
    this.prepareCanvas(
      screenManager,
      2,
      backgroundColor,
      foregroundColor,
      (canvas, width, height) => {
        const xs = [],
          ys = [];
        for (let i = 0; i < width; i += 800) {
          xs.push(Math.random() * width);
        }
        for (let i = 0; i < height; i += 600) {
          ys.push(Math.random() * height);
        }

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

    // Lots of narrow pipes
    this.prepareCanvas(
      screenManager,
      3,
      backgroundColor,
      foregroundColor,
      (canvas, width, height) => {
        for (const [_row, _col, rect] of this.iterateArea(
          width,
          height,
          30,
          height
        )) {
          if (Math.random() > 0.92) {
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
