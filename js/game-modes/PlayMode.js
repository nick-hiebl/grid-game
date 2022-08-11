import { Level } from "../level/Level.js";
import { Player } from "../level/Player.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

const makeTestLevel = () => {
  return new Level(
    [new Rectangle(0, 500, 960, 540), new Rectangle(400, 450, 960, 540), new Rectangle(800, 400, 960, 540)],
    new Player(new Vector(200, 350)),
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
