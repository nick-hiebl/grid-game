import { Vector } from "../math/Vector.js";

// Levels should be in 32x18 scale

export class ExitTrigger {
  constructor(collider, key) {
    this.collider = collider;
    this.key = key;
  }

  hasEntered(player) {
    return this.collider.intersectsPoint(player.position);
  }
}

export class Level {
  constructor(key, objects, player, exitTriggers) {
    this.key = key;
    this.objects = objects;
    this.player = player;
    this.exitTriggers = exitTriggers;

    this.width = 32;
    this.height = 18;
  }

  feedPlayerInfo(previousPlayer, previousExit) {
    if (previousExit.key !== this.key) {
      console.error("Exit key mis-match");
    }
    const position = Vector.diff(
      previousPlayer.position,
      new Vector(previousExit.collider.x1, previousExit.collider.y1)
    );

    this.player.position.x = position.x;
    this.player.position.y = position.y;

    this.player.velocity = previousPlayer.velocity.copy();
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
   * Check if the player should exit.
   * @returns The trigger key.
   */
  shouldExit() {
    const triggeredExit = this.exitTriggers.find(trigger =>
      trigger.hasEntered(this.player)
    );

    if (triggeredExit) {
      return triggeredExit;
    }
  }

  /**
   * Draw the current level.
   * @param {Canvas} canvas The canvas to draw on
   */
  draw(canvas) {
    canvas.saveTransform();
    canvas.scale(60, 60);
    canvas.setColorRGB(100, 0, 200);
    canvas.fillRect(0, 0, canvas.width, canvas.height);
    canvas.setColor("black");
    for (const object of this.objects) {
      object.draw(canvas);
    }

    this.player.draw(canvas);
    canvas.restoreTransform();
  }
}
