import { Vector } from "../math/Vector.js";
import { Player } from "./Player.js";

// Levels should be in 32x18 scale

export class ExitTrigger {
  constructor(collider, key, nextLevelCollider) {
    this.collider = collider;
    this.key = key;
    this.nextLevelCollider = collider || nextLevelCollider;
  }

  hasEntered(player) {
    return this.collider.intersectsPoint(player.position);
  }

  translatePlayerToNext(player) {
    return Vector.diff(
      player.position,
      new Vector(this.nextLevelCollider.x1, this.nextLevelCollider.y1)
    );
  }
}

export class Level {
  constructor(key, objects, player, exitTriggers, interactibles) {
    this.key = key;
    this.objects = objects;
    this.player = player;
    this.exitTriggers = exitTriggers;
    this.interactibles = interactibles;

    this.width = 32;
    this.height = 18;
  }

  feedPlayerInfo(previousPlayer, previousExit) {
    if (previousExit.key !== this.key) {
      console.error("Exit key mis-match");
    }
    const position = previousExit.translatePlayerToNext(previousPlayer);

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
    this.interactibles.forEach(interactible => {
      interactible.update(this.player.position, deltaTime);
    });
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

    // Fill background
    canvas.setColorRGB(100, 0, 200);
    canvas.fillRect(0, 0, canvas.width, canvas.height);

    // Draw interactibles
    this.interactibles.forEach(interactible => {
      interactible.draw(canvas);
    });

    // Draw walls
    canvas.setColor("black");
    for (const object of this.objects) {
      object.draw(canvas);
    }

    // Draw player
    this.player.draw(canvas);
    canvas.restoreTransform();
  }
}

export class LevelFactory {
  constructor(key) {
    this.key = key;
    this.objects = [];
    this.player = new Player(new Vector(16, 9));
    this.exitTriggers = [];
    this.interactibles = [];
  }

  addObjects(objects) {
    this.objects = this.objects.concat(objects);
    return this;
  }

  addExits(exits) {
    this.exitTriggers = this.exitTriggers.concat(exits);
    return this;
  }

  addInteractibles(is) {
    this.interactibles = this.interactibles.concat(is);
    return this;
  }

  create() {
    return new Level(
      this.key,
      this.objects,
      this.player,
      this.exitTriggers,
      this.interactibles
    );
  }
}
