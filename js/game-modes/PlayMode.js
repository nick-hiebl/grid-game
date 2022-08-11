import { Level } from "../level/Level.js";
import { Player } from "../level/Player.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

const makeTestLevel = () => {
  return new Level(
    [new Rectangle(0, 17, 32, 18), new Rectangle(16, 16, 32, 18), new Rectangle(24, 15, 32, 18)],
    new Player(new Vector(12, 6)),
  );
};

export class PlayMode {
  constructor() {
    this.level = makeTestLevel();
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime, inputState) {
    this.level.update(deltaTime, inputState);
  }

  /**
   * Draw.
   * @param {Canvas} canvas The canvas to draw upon.
   */
  draw(canvas) {
    this.level.draw(canvas);
  }
}
