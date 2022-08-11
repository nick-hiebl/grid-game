// Levels should be in 32x18 scale

export class Level {
  constructor(objects, player) {
    this.objects = objects;
    this.player = player;
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime, inputState) {
    this.player.update(deltaTime, inputState, this);
  }

  /**
   * Draw the current level.
   * @param {Canvas} canvas The canvas to draw on
   */
  draw(canvas) {
    canvas.setColorRGB(100, 0, 200);
    canvas.fillRect(0, 0, canvas.width, canvas.height);
    canvas.setColor('black');
    for (const object of this.objects) {
      object.draw(canvas);
    }

    this.player.draw(canvas);
  }
}
