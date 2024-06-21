import { InputEvent, InputState } from "./InputManager";

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
