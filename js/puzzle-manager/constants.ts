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

type ShapeList = (Rectangle | Circle)[];

type ShapeData = { inverted: boolean, shapes: ShapeList };

const inverted = (shapes: ShapeList): ShapeData => ({ inverted: true, shapes });
const regular = (shapes: ShapeList): ShapeData => ({ inverted: false, shapes });

export const ICON_SHAPES: Record<string, ShapeData> = {
  calendar: regular([
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
  ]),
  plus: regular([
    Rectangle.centerForm(0, 0, 0.1, 0.8),
    Rectangle.centerForm(0, 0, 0.8, 0.1),
  ]),
  minus: regular([
    Rectangle.centerForm(0, 0, 0.8, 0.1),
  ]),
  "circle-0": inverted(N_CIRCLE_LAYOUT[0]),
  "circle-1": regular(N_CIRCLE_LAYOUT[1]),
  "circle-2": regular(N_CIRCLE_LAYOUT[2]),
  "circle-3": regular(N_CIRCLE_LAYOUT[3]),
  "circle-4": regular(N_CIRCLE_LAYOUT[4]),
  "circle-5": regular(N_CIRCLE_LAYOUT[5]),
  "circle-6": regular(N_CIRCLE_LAYOUT[6]),
  "circle-7": regular(N_CIRCLE_LAYOUT[7]),
  "circle-8": regular(N_CIRCLE_LAYOUT[8]),
  "square-1": regular(N_SQUARE_LAYOUT[1]),
  "square-2": regular(N_SQUARE_LAYOUT[2]),
  "square-3": regular(N_SQUARE_LAYOUT[3]),
  "square-4": regular(N_SQUARE_LAYOUT[4]),
  "blank-square-1": inverted(N_SQUARE_LAYOUT[1].map(s => s.inset(0.1))),
  "blank-square-2": inverted(N_SQUARE_LAYOUT[2].map(s => s.inset(0.1))),
  "blank-square-3": inverted(N_SQUARE_LAYOUT[3].map(s => s.inset(0.05))),
  "blank-square-4": inverted(N_SQUARE_LAYOUT[4].map(s => s.inset(0.1))),
};
