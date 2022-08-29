import { Rectangle } from "../math/Shapes";
import { PUZZLE_WINDOW_WIDTH } from "./constants";
import { PositionGetter } from "./types";

const CACHE: Record<string, Rectangle[][]> = {};

const cacheKey = (rows: number, cols: number, leftCol: boolean) => `${rows}-${cols}-${leftCol}`;

const produceObject = (rows: number, cols: number, leftCol: boolean): Rectangle[][] => {
  const WIDE_EDGE = 0.7;
  const BOTTOM_ROW = 0.5;
  const LEFT_COL = leftCol ? 1 : 0.5;
  const CELL_SIZE_FROM_COLS = Math.floor(
    PUZZLE_WINDOW_WIDTH / (cols + WIDE_EDGE + LEFT_COL)
  );
  const CELL_SIZE_FROM_ROWS = Math.floor(
    PUZZLE_WINDOW_WIDTH / (rows + WIDE_EDGE + BOTTOM_ROW)
  );
  const CELL_SIZE = Math.min(CELL_SIZE_FROM_COLS, CELL_SIZE_FROM_ROWS);
  const BOTTOM_SIZE = Math.floor(CELL_SIZE * BOTTOM_ROW);
  const LEFT_SIZE = Math.floor(CELL_SIZE * LEFT_COL);
  const WIDE_SIZE = Math.min(
    PUZZLE_WINDOW_WIDTH - CELL_SIZE * cols - LEFT_SIZE,
    PUZZLE_WINDOW_WIDTH - CELL_SIZE * rows - BOTTOM_SIZE
  );

  const FULL_HEIGHT = WIDE_SIZE + BOTTOM_SIZE + rows * CELL_SIZE;
  const FULL_WIDTH = WIDE_SIZE + LEFT_SIZE + cols * CELL_SIZE;

  const TOP_EDGE = Math.max((FULL_WIDTH - FULL_HEIGHT) / 2, 0);
  const LEFT_EDGE = Math.max((FULL_HEIGHT - FULL_WIDTH) / 2, 0);

  let lastX = LEFT_EDGE + LEFT_SIZE;
  const xSpacing = [[LEFT_EDGE, lastX]];

  for (let i = 0; i < cols; i++) {
    xSpacing.push([lastX, lastX + CELL_SIZE]);
    lastX += CELL_SIZE;
  }

  xSpacing.push([lastX, lastX + WIDE_SIZE]);

  let lastY = TOP_EDGE + WIDE_SIZE;
  const ySpacing = [[TOP_EDGE, lastY]];

  for (let i = 0; i < rows; i++) {
    ySpacing.push([lastY, lastY + CELL_SIZE]);
    lastY += CELL_SIZE;
  }

  ySpacing.push([lastY, lastY + BOTTOM_SIZE]);

  const matrix = [];

  for (const [y1, y2] of ySpacing) {
    const thisRow = [];
    for (const [x1, x2] of xSpacing) {
      thisRow.push(new Rectangle(x1, y1, x2, y2));
    }

    matrix.push(thisRow);
  }

  return matrix;
};

const getObject = (rows: number, cols: number, leftCol: boolean) => {
  const key = cacheKey(rows, cols, leftCol);
  if (!(key in CACHE)) {
    CACHE[key] = produceObject(rows, cols, leftCol);
  }

  return CACHE[key];
};

export const positionGetter = (rows: number, cols: number, leftCol?: boolean): PositionGetter => {
  const matrix = getObject(rows, cols, !!leftCol);

  // Indexed from [-1 to ROWS][-1 to COLS]
  return (row: number | "end", col: number | "end") => {
    return matrix[row === "end" ? rows + 1 : row + 1][
      col === "end" ? cols + 1 : col + 1
    ];
  };
};
