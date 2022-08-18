import { PIXEL_WIDTH } from "../constants/ScreenConstants.js";
import { Rectangle } from "../math/Shapes.js";
import { PUZZLE_WINDOW_WIDTH } from "./constants.js";

const CACHE = {};

const cacheKey = (rows, cols) => `${rows}-${cols}`;

const produceObject = (rows, cols) => {
  const LARGER_DIR = Math.max(rows, cols);
  // const SMALLER_DIR = Math.min(rows, cols);
  const CELL_SIZE = Math.ceil(PUZZLE_WINDOW_WIDTH / (LARGER_DIR + 1.2));

  const FULL_HEIGHT = Math.ceil(CELL_SIZE * (rows + 1.2));
  const FULL_WIDTH = Math.ceil(CELL_SIZE * (cols + 1.2));

  const TOP_EDGE = Math.max((FULL_WIDTH - FULL_HEIGHT) / 2, 0) + 2 * PIXEL_WIDTH;
  const LEFT_EDGE = Math.max((FULL_HEIGHT - FULL_WIDTH) / 2, 0) + 2 * PIXEL_WIDTH;

  const topStart = TOP_EDGE + Math.ceil(PUZZLE_WINDOW_WIDTH - CELL_SIZE * (LARGER_DIR + 1.5));
  const leftStart = LEFT_EDGE + Math.ceil(PUZZLE_WINDOW_WIDTH - CELL_SIZE * (LARGER_DIR + 1.7));

  const matrix = [];

  for (let row = 0; row <= rows + 1; row++) {
    const thisRow = [];
    for (let col = 0; col <= cols + 1; col++) {
      const left = leftStart + col * CELL_SIZE;
      const top = topStart + row * CELL_SIZE;
      thisRow.push(new Rectangle(
        Math.max(left, LEFT_EDGE),
        Math.max(top, TOP_EDGE),
        // Cell not rectangular if it starts left off-screen, this was an
        // intentional decision
        Math.min(left + CELL_SIZE, LEFT_EDGE + FULL_WIDTH - 2 * PIXEL_WIDTH),
        // Cell also not rectangular if it over-hangs the bottom.
        Math.min(top + CELL_SIZE, TOP_EDGE + FULL_HEIGHT - 2 * PIXEL_WIDTH)
      ));
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
    return matrix
      [row === "end" ? rows + 1 : row + 1]
      [col === "end" ? cols + 1 : col + 1];
  };
};
