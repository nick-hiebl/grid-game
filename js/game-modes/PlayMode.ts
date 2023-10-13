import { LevelManager } from "../level/LevelManager";
import { PuzzleManager } from "../puzzle-manager/PuzzleManager";
import { Puzzle } from "../puzzle-manager/Puzzle";
import { Level } from "../level/Level";
import { ExitEvent, LevelEvent, OpenPuzzleEvent } from "../level/LevelEvent";
import { InputEvent, InputState } from "../InputManager";
import { ScreenManager } from "../ScreenManager";
import { GameModeManager } from "../GameModeManager";
import { Interactible } from "../level/interactibles/Interactible";
import { Vector } from "../math/Vector";

export class PlayMode {
  gameModeManager: GameModeManager;
  levelManager: LevelManager;
  puzzleManager: typeof PuzzleManager;

  currentPuzzle: Puzzle | undefined;
  currentLevel: Level;

  constructor(gameModeManager: GameModeManager) {
    this.gameModeManager = gameModeManager;
    this.levelManager = new LevelManager();

    this.currentLevel = this.levelManager.getInitialLevel();
    this.startLevel(this.currentLevel);

    this.puzzleManager = PuzzleManager;

    this.currentPuzzle = undefined;
  }

  goToPortal(level: Level, interactible: Interactible) {
    // Reset player
    level.player.position.setFrom(interactible.position);
    level.player.velocity = new Vector(0, 0);

    this.startLevel(level);
  }

  startLevel(level: Level) {
    this.currentLevel = level;
    level.start(this);
  }

  onStart() {
    this.currentLevel.onAwaken();
    this.gameModeManager.enableSections([
      "horizontal-movement",
      "vertical-movement",
      "map-c",
    ]);
  }

  onLevelEvent(event: LevelEvent) {
    if (event.isExitEvent()) {
      const exitTrigger = (event as ExitEvent).exitTrigger;
      this.startLevel(this.levelManager.getLevel(exitTrigger.key, exitTrigger));
    } else if (event.isOpenPuzzleEvent()) {
      this.currentPuzzle = this.puzzleManager.getPuzzle(
        (event as OpenPuzzleEvent).puzzleId
      );
      this.gameModeManager.enableSections([
        "exit-c",
      ]);
      this.currentPuzzle.open();
    } else if (event.isClosePuzzleEvent()) {
      this.currentPuzzle?.close();
      this.gameModeManager.enableSections([
        "horizontal-movement",
        "vertical-movement",
        "map-c",
      ]);
    } else if (event.isOpenMapEvent()) {
      this.gameModeManager.switchToMode(this.gameModeManager.mapMode);
    }
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.currentLevel?.update(deltaTime, inputState);
    this.currentPuzzle?.update(deltaTime, inputState);
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.currentLevel?.onInput(input);
    this.currentPuzzle?.onInput(input);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: ScreenManager) {
    this.currentLevel?.draw(screenManager);
    this.currentPuzzle?.draw(screenManager);
  }
}
