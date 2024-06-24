import { Canvas } from "../Canvas";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { Puzzle } from "../puzzle-manager/Puzzle";

export function distributeRectangles(container: Rectangle, numPuzzles: number): Rectangle[] {
  const scale = Math.floor(Math.sqrt(numPuzzles));

  const rows = Math.ceil(numPuzzles / scale);
  const columns = scale;

  const spaceWidth = container.width;
  const spaceHeight = container.height;

  function spaceForN(n: number) {
    return 1.5 * n - 0.5;
  }

  function offsetForN(n: number) {
    return n * 1.5;
  }

  const boxSize = Math.min(spaceWidth / spaceForN(columns), spaceHeight / spaceForN(rows));

  const innerContainer = Rectangle.centerForm(
    container.midpoint.x,
    container.midpoint.y,
    (boxSize * spaceForN(columns)) / 2,
    (boxSize * spaceForN(rows)) / 2,
  );

  const shapes = [];

  for (let i = 0; i < numPuzzles; i++) {
    const row = Math.floor(i / columns);
    const column = i % columns;

    shapes.push(Rectangle.widthForm(
      boxSize * offsetForN(column) + innerContainer.x1,
      boxSize * offsetForN(row) + innerContainer.y1,
      boxSize,
      boxSize,
    ));
  }

  return shapes;
}

export function drawInnerPuzzle(canvas: Canvas, box: Rectangle, puzzle: Puzzle) {
  const SCREEN_W = box.width / 2;

  const offset = new Vector(
    box.midpoint.x - SCREEN_W,
    box.midpoint.y - SCREEN_W
  );

  canvas.translate(offset.x, offset.y);

  canvas.setColor("white");


  // Draw current selection
  const grid = puzzle.grid;
  const SCREEN_PIXEL =
    (SCREEN_W * 2) / (3 * Math.max(grid.length, grid[0].length) + 1);
  const SCR_WIDTH = SCREEN_PIXEL * (3 * grid[0].length + 1);
  const SCR_HEIGHT = SCREEN_PIXEL * (3 * grid.length + 1);

  const TOP_PAD = Math.max(0, (SCR_WIDTH - SCR_HEIGHT) / 2);
  const LEFT_PAD = Math.max(0, (SCR_HEIGHT - SCR_WIDTH) / 2);

  puzzle.miniElements.forEach(({ row, col, shape }) => {
    if (puzzle.values[grid[row][col].id]) {
      const x0 = LEFT_PAD + SCREEN_PIXEL * (3 * shape.x1 + 1);
      const y0 = TOP_PAD + SCREEN_PIXEL * (3 * shape.y1 + 1);
      const w = SCREEN_PIXEL * (3 * shape.width - 1);
      const h = SCREEN_PIXEL * (3 * shape.height - 1);
      canvas.fillRect(x0, y0, w, h);
    }
  });

  canvas.translate(-offset.x, -offset.y);
}
