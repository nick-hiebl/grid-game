import { Input } from "./constants/Keys";
import { IS_MOBILE } from "./constants/ScreenConstants";
import { MapMode } from "./game-modes/MapMode";
import { PlayMode } from "./game-modes/PlayMode";
import { InputEvent, InputState } from "./InputManager";
import { ScreenManager } from "./ScreenManager";
import { GameModeManagerEssentials, Mode } from "./types";

const ALL_SECTIONS = [
  "horizontal-movement",
  "vertical-movement",
  "map-c",
  "exit-c",
  "zoom-c",
];

export class GameModeManager implements GameModeManagerEssentials<ScreenManager> {
  playMode: PlayMode;
  mapMode: MapMode;

  currentMode: Mode<ScreenManager>;

  constructor() {
    this.playMode = new PlayMode(this);
    this.mapMode = new MapMode(this);

    // Probably needs to initially be a menu mode eventually, or some dev-mode tooling
    this.currentMode = this.playMode;
    this.playMode.onStart();
  }

  /**
   * Update the current gamemode.
   * @param {number} deltaTime The time that has elapsed since the last update.
   * @param {InputState} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.currentMode.update(deltaTime, inputState);
  }

  switchToMode(mode: Mode<ScreenManager>) {
    this.currentMode = mode;
    mode.onStart();
  }

  /**
   * Process an input event
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    let consumed = false;
    if (this.currentMode === this.playMode) {
      if (input.isForKey(Input.Map)) {
        consumed = true;
        this.switchToMode(this.mapMode);
      }
    } else if (this.currentMode === this.mapMode) {
      if (input.isForKey(Input.Escape) || input.isForKey(Input.Map)) {
        consumed = false;
        this.switchToMode(this.playMode);
      }
    }

    if (!consumed) {
      this.currentMode.onInput(input);
    }
  }

  /**
   * Draw the current gamemode.
   * @param {ScreenManager} screenManager The screenManager object.
   */
  draw(screenManager: ScreenManager) {
    this.currentMode.draw(screenManager);
  }

  enableSections(sectionIds: string[]) {
    if (!IS_MOBILE) {
      return;
    }

    for (const section of ALL_SECTIONS) {
      document.getElementById(section)?.classList.add("hidden");
    }

    for (const section of sectionIds) {
      document.getElementById(section)?.classList.remove("hidden");
    }
  }
}
