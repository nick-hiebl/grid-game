import { Canvas } from "../Canvas";
import { Circle, Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { Puzzle } from "../puzzle-manager/Puzzle";
import { ICON_SHAPES } from "../puzzle-manager/constants";

export function distributeGrid(container: Rectangle, rows: number, columns: number, margin = 0.2): Rectangle[][] {
  const spaceWidth = container.width;
  const spaceHeight = container.height;

  function spaceForN(n: number) {
    return (1 + margin) * n - margin;
  }

  function offsetForN(n: number) {
    return n * (1 + margin);
  }

  const boxSize = Math.min(spaceWidth / spaceForN(columns), spaceHeight / spaceForN(rows));

  const innerContainer = Rectangle.centerForm(
    container.midpoint.x,
    container.midpoint.y,
    (boxSize * spaceForN(columns)) / 2,
    (boxSize * spaceForN(rows)) / 2,
  );

  const grid = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(Rectangle.widthForm(
        boxSize * offsetForN(j) + innerContainer.x1,
        boxSize * offsetForN(i) + innerContainer.y1,
        boxSize,
        boxSize,
      ));
    }
    grid.push(row);
  }

  return grid;
}

export function distributeShapesSquare(container: Rectangle, numPuzzles: number, margin: number): Rectangle[] {
  const cols = Math.ceil(Math.sqrt(numPuzzles));
  const rows = Math.ceil(numPuzzles / cols);

  return distributeGrid(container, rows, cols, margin).flat().slice(0, numPuzzles);
}

export function distributeRectangles(container: Rectangle, numPuzzles: number, margin = 0.5): Rectangle[] {
  const scale = Math.floor(Math.sqrt(numPuzzles));

  const rows = Math.ceil(numPuzzles / scale);
  const columns = scale;

  const spaceWidth = container.width;
  const spaceHeight = container.height;

  function spaceForN(n: number) {
    return (1 + margin) * n - margin;
  }

  function offsetForN(n: number) {
    return n * (1 + margin);
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

export const drawIconShapes = (uiCanvas: Canvas, box: Rectangle, display: string): boolean => {
  if (display in ICON_SHAPES) {
    const { shapes, inverted } = ICON_SHAPES[display];

    uiCanvas.setColor("white");
    for (const shape of shapes) {
      if (shape instanceof Circle) {
        const pos = Vector.add(
          box.midpoint,
          Vector.scale(shape.position, box.width / 2),
        );
        const newCircle = new Circle(pos, shape.radius * box.width / 2);
        if (inverted) {
          uiCanvas.setLineWidth(box.width / 10);
          newCircle.stroke(uiCanvas);
        } else {
          newCircle.draw(uiCanvas);
        }
      } else if (shape instanceof Rectangle) {
        const pos = Vector.add(
          box.midpoint,
          Vector.scale(shape.midpoint, box.width / 2),
        );
        const newSquare = Rectangle.centerForm(pos.x, pos.y, shape.width * box.width / 4, shape.height * box.width / 4);

        if (inverted) {
          uiCanvas.setLineWidth(box.width / 10);
          newSquare.stroke(uiCanvas);
        } else {
          newSquare.draw(uiCanvas);
        }
      }
    }

    return true;
  }

  return false;
};
