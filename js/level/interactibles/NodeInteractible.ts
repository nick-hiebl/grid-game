import { Vector } from "../../math/Vector";
import { Puzzle } from "../../puzzle-manager/Puzzle";
import { PuzzleManager } from "../../puzzle-manager/PuzzleManager";
import { ScreenManager } from "../../ScreenManager";
import { Level } from "../Level";

import { OpenPuzzleEvent } from "../LevelEvent";
import { Player } from "../Player";

import { Interactible } from "./Interactible";

export class NodeInteractible extends Interactible {
  puzzleId: string;
  puzzle: Puzzle | undefined;

  constructor(
    id: string,
    position: Vector,
    prereqs: string[],
    puzzleId: string
  ) {
    super(id, position, undefined, prereqs);

    this.puzzleId = puzzleId;
  }

  onStart(level: Level) {
    super.onStart(level);
    if (this.puzzleId) {
      this.puzzle = PuzzleManager.getPuzzle(this.puzzleId);
    }
  }

  update(player: Player, deltaTime: number, level: Level): void {
    super.update(player, deltaTime, level);
    if (!this.isEnabled) {
      if (this.puzzle) {
        this.isEnabled = this.puzzle.hasBeenSolvedEver && this.prereqsActive;
      } else {
        this.isEnabled = this.prereqsActive;
      }
    }
  }

  draw(screenManager: ScreenManager) {
    super.draw(screenManager);
  }

  onInteract() {
    return new OpenPuzzleEvent(this.puzzleId);
  }
}
