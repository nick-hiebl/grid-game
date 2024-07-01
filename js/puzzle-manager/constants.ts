import { UI_CANVAS_HEIGHT } from "../constants/ScreenConstants";
import { Circle, Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

export const OPEN_DURATION = 0.4;
export const CLOSE_DURATION = 0.25;

export const PUZZLE_WINDOW_WIDTH = (7 / 9) * UI_CANVAS_HEIGHT;

export const SOLVED_BACKGROUND = "#00ff62dd";
export const DEFAULT_BACKGROUND = "#0096ffdd";

export const GROUP_SOLVED_BACKGROUND = "#00cc22";
export const GROUP_DEFAULT_BACKGROUND = "#0060dd";

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

const k = 0.12;
const s = (1.6 - 4*k) / 5;
const t0 = s/2 + k/2;
const t1 = 3 * t0;

export const ICON_SHAPES: Record<string, (Rectangle | Circle)[]> = {
  calendar: [
    // new Rectangle(-0.8, -0.5, 0.8, 0.5),
    // top seg
    Rectangle.widthForm(-0.8, -0.55, 1.6, 0.2),
    Rectangle.widthForm(-0.8, -0.3, 1.6, 0.2),
    // bottom seg
    Rectangle.widthForm(-0.8, 0.2, 1.6, 0.5),
    // vert segs
    Rectangle.widthForm(-0.8, -0.3, 0.2, 1),
    Rectangle.widthForm(-0.3, -0.3, 0.15, 1),
    Rectangle.widthForm(0.15, -0.3, 0.15, 1),
    Rectangle.widthForm(0.6, -0.3, 0.2, 1),
    // ring clips
    Rectangle.centerForm(-t1, -0.6, k/2, 0.1),
    Rectangle.centerForm(-t0, -0.6, k/2, 0.1),
    Rectangle.centerForm(t0, -0.6, k/2, 0.1),
    Rectangle.centerForm(t1, -0.6, k/2, 0.1),
  ],
};
