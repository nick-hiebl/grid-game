import { HORIZONTAL_TILES, VERTICAL_TILES } from "../constants/ScreenConstants.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

import { DataLoader } from "./DataLoader.js";
import { ExitTrigger } from "./ExitTrigger.js";
import { LevelFactory } from "./LevelFactory.js";
import { PuzzleInteractible } from "./PuzzleInteractible.js";

const EDGE_BUFFER = 8;

/**
 * Responsible for finding and loading levels, not managing what level is
 * currently active.
 */
export class LevelManager {
  constructor() {
    const key = "Level_0";
    this.levelMap = {};
    this.currentLevel = DataLoader.getLevel(key);
    this.levelMap[key] = this.currentLevel;
  }

  getInitialLevel() {
    return this.currentLevel;
  }

  getLevel(key, previousExit) {
    const nextLevel = this.levelMap[key] || DataLoader.getLevel(key);
    nextLevel.feedPlayerInfo(this.currentLevel.player, previousExit);

    this.currentLevel = nextLevel;
    this.levelMap[key] = nextLevel;
    return nextLevel;
  }
}
