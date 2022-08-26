import { DataLoader } from "./DataLoader";
import { ExitTrigger } from "./ExitTrigger";
import { Level } from "./Level";

/**
 * Responsible for finding and loading levels, not managing what level is
 * currently active.
 */
export class LevelManager {
  levelMap: Record<string, Level>;
  currentLevel: Level;

  constructor() {
    const key = "Level_0";
    this.levelMap = {};
    this.currentLevel = DataLoader.getLevel(key);
    this.levelMap[key] = this.currentLevel;
  }

  getInitialLevel() {
    return this.currentLevel;
  }

  getLevel(key: string, previousExit: ExitTrigger) {
    const nextLevel = this.levelMap[key] || DataLoader.getLevel(key);
    nextLevel.feedPlayerInfo(this.currentLevel.player, previousExit);

    this.currentLevel = nextLevel;
    this.levelMap[key] = nextLevel;
    return nextLevel;
  }
}
