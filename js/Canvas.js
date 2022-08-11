import { toHex } from "./utils/Color.js";

const CTX = Symbol("ctx");
const CANVAS = Symbol("canvas");

export class Canvas {
  constructor(canvas) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw Error("Invalid canvas provided!");
    }

    this[CANVAS] = canvas;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw Error("Unable to get 2d context");
    }

    this[CTX] = ctx;

    this[CTX].fillStyle = "black";
    this[CTX].strokeStyle = "black";
    this.color = "black";

    this.width = this[CANVAS].width;
    this.height = this[CANVAS].height;
  }

  /**
   * Fill a rectangle on the canvas.
   * @param {number} x The horizontal position of the top-left corner.
   * @param {number} y The vertical position of the top-left corner.
   * @param {number} width The width of the rectangle.
   * @param {number} height The height of the rectangle.
   */
  fillRect(x, y, width, height) {
    this[CTX].fillRect(x, y, width, height);
  }

  /**
   * Fill an ellipse on the canvas.
   * @param {number} x The horizontal position of the ellipse center.
   * @param {number} y The vertical position of the ellipse center.
   * @param {number} width The horizontal radius of the ellipse.
   * @param {number} height The vertical radius of the ellipse.
   */
  fillEllipse(x, y, width, height) {
    this[CTX].beginPath();
    this[CTX].ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    this[CTX].fill();
  }

  /**
   * Draw a line on the canvas.
   * @param {number} x0 The start x position
   * @param {number} y0 The start y position
   * @param {number} x1 The end x position
   * @param {number} y1 The start y position
   */
  drawLine(x0, y0, x1, y1) {
    this[CTX].beginPath();
    this[CTX].moveTo(x0, y0);
    this[CTX].lineTo(x1, y1);
    this[CTX].stroke();
  }

  /**
   * Set the colour to be used for drawing on the canvas.
   * @param {string} colorString The name of the color to be used
   */
  setColor(colorString) {
    if (colorString === this.color) {
      return;
    }

    this.color = colorString;
    this[CTX].fillStyle = colorString;
    this[CTX].strokeStyle = colorString;
  }

  /**
   * Set the current color via RGB.
   * @param {number} red Red value from 0-255
   * @param {number} green Green value from 0-255
   * @param {number} blue Blue value from 0-255
   * @param {number | undefined} alpha Alpha value from 0-255
   */
  setColorRGB(red, green, blue, alpha = 255) {
    const colorString = `#${toHex(red, 2)}${toHex(green, 2)}${toHex(
      blue,
      2
    )}${toHex(alpha, 2)}`;

    this.setColor(colorString);
  }

  /**
   * Set the current color with hue, saturation, lightness and alpha.
   * @param {number} hue Hue value from 0-359
   * @param {number} saturation Saturation value from 0-1
   * @param {number} lightness Lightness value from 0-1
   * @param {number | undefined} alpha Alpha value from 0-1
   */
  setColorHSLA(hue, saturation, lightness, alpha = 1) {
    const colorString = `hsla(${hue},${Math.floor(
      saturation * 100
    )}%,${Math.floor(lightness * 100)}%,${alpha})`;

    this.setColor(colorString);
  }

  /**
   * Create a Canvas from an id.
   * @param {string} id The id attribute of the HTMLCanvasElement
   */
  static fromId(id) {
    const canvas = document.getElementById(id);

    return new Canvas(canvas);
  }

  /**
   * Create a new HTMLCanvasElement and use that as the basis for a Canvas.
   */
  static fromScratch() {
    const canvas = document.createElement(canvas);

    return new Canvas(canvas);
  }
}
