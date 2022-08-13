import { Input } from "../constants/Keys.js";
import { InputState } from "../InputManager.js";
import { clamp } from "../math/Common.js";
import { Vector } from "../math/Vector.js";
import { Player } from "./Player.js";

// Levels should be in 32x18 scale
const SCREEN_WIDTH = 32;
const SCREEN_HEIGHT = 18;

export class ExitTrigger {
  constructor(collider, key, nextLevelCollider) {
    this.collider = collider;
    this.key = key;
    this.nextLevelCollider = nextLevelCollider || collider;
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
  constructor(
    key,
    width,
    height,
    objects,
    player,
    exitTriggers,
    interactibles
  ) {
    this.key = key;
    this.objects = objects;
    this.player = player;
    this.exitTriggers = exitTriggers;
    this.interactibles = interactibles;

    this.width = width;
    this.height = height;

    this.camera = this.getIdealCamera();
    this.interactingWith = undefined;

    this.drawnStatic = false;
  }

  start() {
    this.drawnStatic = false;
    this.interactingWith = undefined;
  }

  feedPlayerInfo(previousPlayer, previousExit) {
    if (previousExit.key !== this.key) {
      console.error("Exit key mis-match");
    }
    const position = previousExit.translatePlayerToNext(previousPlayer);

    this.player.position.x = position.x;
    this.player.position.y = position.y;

    this.player.velocity = previousPlayer.velocity.copy();

    this.camera = this.getIdealCamera();
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {InputState} inputState The current state of inputs.
   */
  update(deltaTime, inputState) {
    this.player.update(
      deltaTime,
      this.isPlayerActive() ? inputState : InputState.empty(),
      this
    );
    this.interactibles.forEach(interactible => {
      interactible.update(this.player.position, deltaTime);
    });
    if (!this.interactingWith?.isTriggered) {
      this.interactingWith = undefined;
    }

    this.camera = Vector.lerp(
      this.camera,
      this.getIdealCamera(),
      Math.min(1, deltaTime * 10)
    );
  }

  isPlayerActive() {
    return !this.interactingWith;
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input) {
    if (this.isPlayerActive()) {
      this.player.onInput(input);
    }
    // Do something?
    if (input.input === Input.Interact) {
      this.interactingWith = this.interactibles.find(i => i.isTriggered);
    } else if (input.input === Input.Escape) {
      this.interactingWith = undefined;
    }
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

  getIdealCamera() {
    return new Vector(
      clamp(
        this.player.position.x - SCREEN_WIDTH / 2,
        0,
        this.width - SCREEN_WIDTH
      ),
      clamp(
        this.player.position.y - SCREEN_HEIGHT / 2,
        0,
        this.height - SCREEN_HEIGHT
      )
    );
  }

  withSetupCanvas(canvas, action) {
    canvas.saveTransform();
    canvas.scale(60, 60);
    action(canvas);
    canvas.restoreTransform();
  }

  /**
   * Draw the current level.
   * @param {ScreenManager} screenManager The screen to draw on
   */
  draw(screenManager) {
    if (!this.drawnStatic) {
      this.withSetupCanvas(screenManager.staticWorldCanvas, canvas => {
        // Fill background
        canvas.setColorRGB(100, 0, 200);
        canvas.fillRect(0, 0, canvas.width, canvas.height);

        // Draw walls
        canvas.setColor("black");
        for (const object of this.objects) {
          object.draw(canvas);
        }
      });

      this.drawnStatic = true;
    }

    this.withSetupCanvas(screenManager.dynamicWorldCanvas, canvas => {
      canvas.clear();

      // Draw interactibles
      this.interactibles.forEach(interactible => {
        interactible.draw(canvas);
      });

      // Draw player
      this.player.draw(canvas);
    });

    this.withSetupCanvas(screenManager.uiCanvas, canvas => {
      canvas.clear();

      if (this.isPlayerActive()) {
        canvas.setColor("red");
        canvas.fillEllipse(0.4, 0.4, 0.2, 0.2);
      }
    });

    screenManager.setCamera(Vector.scale(this.camera, 60));
  }
}

export class LevelFactory {
  constructor(key, width, height) {
    this.key = key;
    this.width = width;
    this.height = height;
    this.objects = [];
    this.playerPosition = new Vector(16, 9);
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

  setPlayerPos(pos) {
    this.playerPosition = pos;
    return this;
  }

  create() {
    return new Level(
      this.key,
      this.width,
      this.height,
      this.objects,
      new Player(this.playerPosition),
      this.exitTriggers,
      this.interactibles
    );
  }
}
