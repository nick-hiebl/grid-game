import { Rectangle } from "../math/Shapes.js";
import { PUZZLE_WINDOW_WIDTH } from "./constants.js";

const CACHE = {};

const cacheKey = (rows, cols) => `${rows}-${cols}`;

const produceObject = (rows, cols) => {
  const LARGER_DIR = Math.max(rows, cols);
  // const SMALLER_DIR = Math.min(rows, cols);
  const CELL_SIZE = Math.ceil(PUZZLE_WINDOW_WIDTH / (LARGER_DIR + 1.2));

  const topStart = Math.ceil(PUZZLE_WINDOW_WIDTH - CELL_SIZE * (LARGER_DIR + 1.5));
  const leftStart = Math.ceil(PUZZLE_WINDOW_WIDTH - CELL_SIZE * (LARGER_DIR + 1.7));

  const matrix = [];

  for (let row = 0; row <= rows + 1; row++) {
    const thisRow = [];
    for (let col = 0; col <= cols + 1; col++) {
      const left = leftStart + col * CELL_SIZE;
      const top = topStart + row * CELL_SIZE;
      thisRow.push(new Rectangle(
        Math.max(left, 0),
        Math.max(top, 0),
        // Cell not rectangular if it starts left off-screen, this was an
        // intentional decision
        Math.min(left + CELL_SIZE, PUZZLE_WINDOW_WIDTH),
        // Cell also not rectangular if it over-hangs the bottom.
        Math.min(top + CELL_SIZE, PUZZLE_WINDOW_WIDTH)
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
    return matrix[row + 1][col + 1];
  };
};
