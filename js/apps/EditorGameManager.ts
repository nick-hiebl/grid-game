import { EditorMode } from "../game-modes/EditorMode";
import { InputEvent, InputState } from "../InputManager";
import { GameModeManagerEssentials, Mode } from "../types";
import { EditorScreen } from "./EditorScreen";

export class EditorGameManager implements GameModeManagerEssentials<EditorScreen> {
  editorMode: EditorMode;
  // mapMode: MapMode;

  currentMode: Mode<EditorScreen>;

  constructor() {
    this.editorMode = new EditorMode(this);

    // Probably needs to initially be a menu mode eventually, or some dev-mode tooling
    this.currentMode = this.editorMode;
    this.editorMode.onStart();
  }

  /**
   * Update the current gamemode.
   * @param {number} deltaTime The time that has elapsed since the last update.
   * @param {InputState} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.currentMode.update(deltaTime, inputState);
  }

  switchToMode(mode: Mode<EditorScreen>) {
    this.currentMode = mode;
    mode.onStart();
  }

  /**
   * Process an input event
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    let consumed = false;
    if (this.currentMode === this.editorMode) {
    }

    if (!consumed) {
      this.currentMode.onInput(input);
    }
  }

  /**
   * Draw the current gamemode.
   * @param {ScreenManager} screenManager The screenManager object.
   */
  draw(screenManager: EditorScreen) {
    this.currentMode.draw(screenManager);
  }
}
