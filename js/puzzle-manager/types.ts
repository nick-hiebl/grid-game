import { Rectangle } from "../math/Shapes";

export type CellValue = boolean | null;

export type PuzzleState = CellValue[][];

export type PositionGetter = (
  row: number | "end",
  column: number | "end"
) => Rectangle;
