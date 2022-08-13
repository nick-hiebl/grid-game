import { ExitTrigger, Level, LevelFactory } from "./Level.js";
import { Player } from "./Player.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";
import { PuzzleInteractible } from "./PuzzleInteractible.js";

const makeTestLevel = i => {
  const x = Math.floor(Math.random() * 30) + 1;
  const width = 32;
  const height = i === 1 ? 36 : 18;
  const baseY = height - 18;
  const f = new LevelFactory(`${i}`, width, height)
    .setPlayerPos(new Vector(16, /*baseY +*/ 9))
    .addObjects([
      Rectangle.widthForm(i, baseY + 0, 1, 1),
      Rectangle.widthForm(0, baseY + 17, 32, 1),
      Rectangle.widthForm(14, baseY + 16, 14, 2),
      Rectangle.widthForm(24, baseY + 15, 4, 3),
      Rectangle.widthForm(x, baseY + 2, 1, 1)
    ])
    .addExits([
      new ExitTrigger(Rectangle.widthForm(-32, baseY, 32, 18), `${i - 1}`),
      new ExitTrigger(Rectangle.widthForm(32, baseY, 32, 18), `${i + 1}`)
    ]);
  if (i === 0) {
    f.addObjects([Rectangle.widthForm(0, baseY, 1, 18)]);
  } else if (i === 1) {
    f.addInteractibles([
      new PuzzleInteractible(new Vector(5, baseY + 15), Rectangle.widthForm(3, baseY + 13, 4, 4))
    ]);
    f.addObjects([
      Rectangle.widthForm(20, baseY + 11, 3, 1),
      Rectangle.widthForm(16, baseY + 7, 3, 1),
    ]);
  } else if (i === 3) {
    f.addInteractibles([
      new PuzzleInteractible(new Vector(26, baseY + 13), Rectangle.widthForm(24, baseY + 11, 4, 4))
    ]);
  } else if (i === 5) {
    f.addObjects([Rectangle.widthForm(31, baseY, 18, 18)]);
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
