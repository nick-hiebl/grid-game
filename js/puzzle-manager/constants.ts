import { UI_CANVAS_HEIGHT } from "../constants/ScreenConstants";
import { Circle, Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

export const OPEN_DURATION = 0.4;
export const CLOSE_DURATION = 0.25;

export const PUZZLE_WINDOW_WIDTH = (7 / 9) * UI_CANVAS_HEIGHT;

export const SOLVED_BACKGROUND = "#00ff62dd";
export const DEFAULT_BACKGROUND = "#0096ffdd";

export const N_CIRCLE_LAYOUT = [
  [new Circle(new Vector(0, 0), 0.33)],
  [new Circle(new Vector(0, 0), 0.33)],
  [new Circle(new Vector(0, 0.4), 0.33), new Circle(new Vector(0, -0.4), 0.33)],
  [
    new Circle(new Vector(-0.42, 0.4), 0.33),
    new Circle(new Vector(0.42, 0.4), 0.33),
    new Circle(new Vector(0, -0.4), 0.33),
  ],
  [
    new Circle(new Vector(0.4, 0.4), 0.33),
    new Circle(new Vector(0.4, -0.4), 0.33),
    new Circle(new Vector(-0.4, 0.4), 0.33),
    new Circle(new Vector(-0.4, -0.4), 0.33),
  ],
  [
    new Circle(new Vector(0, 0.3), 0.28),
    new Circle(new Vector(0.64, 0.3), 0.28),
    new Circle(new Vector(-0.64, 0.3), 0.28),
    new Circle(new Vector(-0.32, -0.3), 0.28),
    new Circle(new Vector(0.32, -0.3), 0.28),
  ],
  [
    new Circle(new Vector(0, 0.6), 0.28),
    new Circle(new Vector(0.64, 0.6), 0.28),
    new Circle(new Vector(-0.64, 0.6), 0.28),
    new Circle(new Vector(-0.32, 0), 0.28),
    new Circle(new Vector(0.32, 0), 0.28),
    new Circle(new Vector(0, -0.6), 0.28),
  ],
  [
    new Circle(new Vector(0, 0), 0.28),
    new Circle(new Vector(0.64, 0), 0.28),
    new Circle(new Vector(-0.64, 0), 0.28),
    new Circle(new Vector(-0.32, -0.6), 0.28),
    new Circle(new Vector(0.32, -0.6), 0.28),
    new Circle(new Vector(-0.32, 0.6), 0.28),
    new Circle(new Vector(0.32, 0.6), 0.28),
  ],
  [
    new Circle(new Vector(0, 0.6), 0.28),
    new Circle(new Vector(0.64, 0.6), 0.28),
    new Circle(new Vector(-0.64, 0.6), 0.28),
    new Circle(new Vector(-0.32, 0), 0.28),
    new Circle(new Vector(0.32, 0), 0.28),
    new Circle(new Vector(0, -0.6), 0.28),
    new Circle(new Vector(0.64, -0.6), 0.28),
    new Circle(new Vector(-0.64, -0.6), 0.28),
  ],
];

export const N_SQUARE_LAYOUT = [
  [Rectangle.centerForm(0, 0, 0.33, 0.33)],
  [Rectangle.centerForm(0, 0, 0.33, 0.33)],
  [
    Rectangle.centerForm(0, -0.4, 0.33, 0.33),
    Rectangle.centerForm(0, 0.4, 0.33, 0.33),
  ],
  [
    Rectangle.centerForm(0, -0.4, 0.33, 0.33),
    Rectangle.centerForm(-0.4, 0.4, 0.33, 0.33),
    Rectangle.centerForm(0.4, 0.4, 0.33, 0.33),
  ],
  [
    Rectangle.centerForm(-0.4, -0.4, 0.33, 0.33),
    Rectangle.centerForm(0.4, -0.4, 0.33, 0.33),
    Rectangle.centerForm(-0.4, 0.4, 0.33, 0.33),
    Rectangle.centerForm(0.4, 0.4, 0.33, 0.33),
  ],
];
