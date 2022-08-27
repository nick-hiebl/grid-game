import { Rectangle } from "../math/Shapes";

export type CellValue = boolean | null;

export interface Cell {
  row: number;
  column: number;
  // value: CellValue;
  id: number;
}

export type PuzzleGrid = Cell[][];
export type PuzzleValues = Record<number, CellValue>;
export type PuzzleCellMap = Record<number, Cell[]>;

export type PositionGetter = (
  row: number | "end",
  column: number | "end"
) => Rectangle;
