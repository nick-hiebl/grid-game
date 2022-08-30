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
    let initialLevel = "Level_0";

    if (location.href.includes("localhost")) {
      (window as any).setStartLevel = (levelName: string) => {
        localStorage.setItem('start_level', levelName);
      }

      const curr = localStorage.getItem('start_level');
      if (curr) {
        initialLevel = curr;
      }
    }

    this.levelMap = {};
    this.currentLevel = DataLoader.getLevel(initialLevel);
    this.levelMap[initialLevel] = this.currentLevel;
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
