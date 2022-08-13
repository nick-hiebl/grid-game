import { ExitTrigger, Level, LevelFactory } from "./Level.js";
import { Player } from "./Player.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";
import { PuzzleInteractible } from "./PuzzleInteractible.js";

const makeTestLevel = i => {
  const x = Math.floor(Math.random() * 30) + 1;
  const f = new LevelFactory(`${i}`)
    .addObjects([
      new Rectangle(i, 0, i * 4 + 1, 1),
      new Rectangle(0, 17, 32, 18),
      new Rectangle(14, 16, 28, 18),
      new Rectangle(24, 15, 28, 18),
      new Rectangle(x, 2, x + 1, 3)
    ])
    .addExits([
      new ExitTrigger(new Rectangle(-32, 0, 0, 18), `${i - 1}`),
      new ExitTrigger(new Rectangle(32, 0, 64, 18), `${i + 1}`)
    ]);
  if (i === 0) {
    f.addObjects([new Rectangle(0, 0, 1, 18)]);
  } else if (i === 1) {
    f.addInteractibles([new PuzzleInteractible(new Vector(5, 15), new Rectangle(3, 13, 7, 17))]);
  } else if (i === 3) {
    f.addInteractibles([new PuzzleInteractible(new Vector(26, 13), new Rectangle(24, 11, 28, 15))]);
  } else if (i === 5) {
    f.addObjects([new Rectangle(31, 0, 32, 18)]);
  }
  return f.create();
};

export class LevelManager {
  constructor() {
    const key = 1;
    this.levelMap = {};
    this.currentLevel = makeTestLevel(key);
    this.levelMap[key] = this.currentLevel;
  }

  getInitialLevel() {
    return this.currentLevel;
  }

  getLevel(key, previousExit) {
    const nextLevel = this.levelMap[key] || makeTestLevel(parseInt(key, 10));
    nextLevel.feedPlayerInfo(this.currentLevel.player, previousExit);

    this.currentLevel = nextLevel;
    this.levelMap[key] = nextLevel;
    return nextLevel;
  }
}
