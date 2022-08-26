import { Rectangle } from "../math/Shapes";
import { PUZZLE_WINDOW_WIDTH } from "./constants.js";

const CACHE = {};

const cacheKey = (rows, cols) => `${rows}-${cols}`;

const produceObject = (rows, cols) => {
  const LARGER_DIR = Math.max(rows, cols);
  const WIDE_EDGE = 0.7;
  const NARROW_EDGE = 0.5;
  const CELL_SIZE = Math.floor(
    PUZZLE_WINDOW_WIDTH / (LARGER_DIR + WIDE_EDGE + NARROW_EDGE)
  );
  const NARROW_SIZE = Math.floor(CELL_SIZE * NARROW_EDGE);
  const WIDE_SIZE = PUZZLE_WINDOW_WIDTH - CELL_SIZE * LARGER_DIR - NARROW_SIZE;

  const FULL_HEIGHT = WIDE_SIZE + NARROW_SIZE + rows * CELL_SIZE;
  const FULL_WIDTH = WIDE_SIZE + NARROW_SIZE + cols * CELL_SIZE;

  const TOP_EDGE = Math.max((FULL_WIDTH - FULL_HEIGHT) / 2, 0);
  const LEFT_EDGE = Math.max((FULL_HEIGHT - FULL_WIDTH) / 2, 0);

  const xSpacing = [[LEFT_EDGE, LEFT_EDGE + NARROW_SIZE]];
  let lastX = LEFT_EDGE + NARROW_SIZE;

  for (let i = 0; i < cols; i++) {
    xSpacing.push([lastX, lastX + CELL_SIZE]);
    lastX += CELL_SIZE;
  }

  xSpacing.push([lastX, lastX + WIDE_SIZE]);

  const ySpacing = [[TOP_EDGE, TOP_EDGE + WIDE_SIZE]];
  let lastY = TOP_EDGE + WIDE_SIZE;

  for (let i = 0; i < rows; i++) {
    ySpacing.push([lastY, lastY + CELL_SIZE]);
    lastY += CELL_SIZE;
  }

  ySpacing.push([lastY, lastY + NARROW_SIZE]);

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

const getObject = (rows, cols) => {
  const key = cacheKey(rows, cols);
  if (!(key in CACHE)) {
    CACHE[key] = produceObject(rows, cols);
  }

  return CACHE[key];
};

export const positionGetter = (rows, cols) => {
  const matrix = getObject(rows, cols);

  // Indexed from [-1 to ROWS][-1 to COLS]
  return (row, col) => {
    return matrix[row === "end" ? rows + 1 : row + 1][
      col === "end" ? cols + 1 : col + 1
    ];
  };
};
