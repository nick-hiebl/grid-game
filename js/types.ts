import { InputEvent, InputState } from "./InputManager";
import { Puzzle } from "./puzzle-manager/Puzzle";

export interface GameModeManagerEssentials<Screen extends ScreenManagerEssentials> {
  onInput(input: InputEvent): void;
  update(deltaTime: number, inputState: InputState): void;
  draw(screenManager: Screen): void;
}

export interface ScreenManagerEssentials {
  drawToScreen(): void;
}

export interface Mode<Screen extends ScreenManagerEssentials> {
  update(deltaTime: number, inputState: InputState): void;
  onInput(inputEvent: InputEvent): void;
  draw(screenManager: Screen): void;
  onStart(): void;
}

export interface Grouping {
  children?: Grouping[];
  puzzle?: Puzzle;
  isLeaf: boolean;
  isAllSolved: boolean;
}
