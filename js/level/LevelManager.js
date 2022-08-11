import { ExitTrigger, Level } from "./Level.js";
import { Player } from "./Player.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

const makeTestLevel = (i) => {
  return new Level(
    `${i}`,
    [
      new Rectangle(i, 0, i * 4 + 1, 1),
      new Rectangle(0, 17, 32, 18),
      new Rectangle(16, 16, 32, 18),
      new Rectangle(24, 15, 32, 18)
    ],
    new Player(new Vector(12, 6)),
    [
      new ExitTrigger(new Rectangle(-32, 0, 0, 18), `${i - 1}`),
      new ExitTrigger(new Rectangle(32, 0, 64, 18), `${i + 1}`)
    ]
  );
};

export class LevelManager {
  constructor() {
    this.currentLevel = makeTestLevel(1);
  }

  getInitialLevel() {
    return this.currentLevel;
  }

  getLevel(key, previousExit) {
    const nextLevel = makeTestLevel(parseInt(key, 10));
    nextLevel.feedPlayerInfo(this.currentLevel.player, previousExit);

    this.currentLevel = nextLevel;
    return nextLevel;
  }
}
