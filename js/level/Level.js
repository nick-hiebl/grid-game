import { Input } from "../constants/Keys.js";
import {
  CANVAS_WIDTH,
  HORIZONTAL_TILES,
  VERTICAL_TILES,
} from "../constants/ScreenConstants.js";
import { InputState } from "../InputManager.js";
import { clamp } from "../math/Common.js";
import { Vector } from "../math/Vector.js";
import { ClosePuzzleEvent, ExitEvent, OpenPuzzleEvent } from "./LevelEvent.js";
import { Player } from "./Player.js";

const SCALE_FACTOR = CANVAS_WIDTH / HORIZONTAL_TILES;

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

    this.playModeManager = undefined;
  }

  start(playModeManager) {
    this.drawnStatic = false;
    this.interactingWith = undefined;
    this.playModeManager = playModeManager;
  }

  emitEvent(event) {
    // TODO: Either guarantee that this is available or create a queue to send
    // these events once it does become available.
    if (this.playModeManager) {
      this.playModeManager.onLevelEvent(event);
    }
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
    // Update player
    this.player.update(
      deltaTime,
      this.isPlayerActive() ? inputState : InputState.empty(),
      this
    );

    // Update interactibles
    this.interactibles.forEach((interactible) => {
      interactible.update(this.player.position, deltaTime);
    });
    if (!this.interactingWith?.isTriggered) {
      this.closeCurrentPuzzle();
      this.interactingWith = undefined;
    }

    this.updateCamera(deltaTime);

    this.updateExits();
  }

  isPlayerActive() {
    return !this.interactingWith;
  }

  closeCurrentPuzzle() {
    // Don't close unnecessarily
    if (this.interactingWith) {
      this.emitEvent(new ClosePuzzleEvent(this.interactingWith.id));
    }
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input) {
    if (this.isPlayerActive()) {
      this.player.onInput(input);
    }

    if (input.input === Input.Interact) {
      this.interactingWith = this.interactibles.find((i) => i.isTriggered);
      if (this.interactingWith) {
        this.emitEvent(new OpenPuzzleEvent(this.interactingWith.id));
      }
    } else if (input.input === Input.Escape) {
      this.closeCurrentPuzzle();

      this.interactingWith = undefined;
    }
  }

  /**
   * Check if the player should exit.
   * @returns The trigger key.
   */
  updateExits() {
    const triggeredExit = this.exitTriggers.find((trigger) =>
      trigger.hasEntered(this.player)
    );

    if (triggeredExit) {
      this.emitEvent(new ExitEvent(triggeredExit));
    }
  }

  getIdealCamera() {
    return new Vector(
      clamp(
        this.player.position.x - HORIZONTAL_TILES / 2,
        0,
        this.width - HORIZONTAL_TILES
      ),
      clamp(
        this.player.position.y - VERTICAL_TILES / 2,
        0,
        this.height - VERTICAL_TILES
      )
    );
  }

  updateCamera(deltaTime) {
    this.camera = Vector.lerp(
      this.camera,
      this.getIdealCamera(),
      Math.min(1, deltaTime * 10)
    );
  }

  withSetupCanvas(canvas, action) {
    canvas.saveTransform();
    canvas.scale(SCALE_FACTOR, SCALE_FACTOR);
    action(canvas);
    canvas.restoreTransform();
  }

  /**
   * Draw the current level.
   * @param {ScreenManager} screenManager The screen to draw on
   */
  draw(screenManager) {
    if (!this.drawnStatic) {
      this.withSetupCanvas(screenManager.staticWorldCanvas, (canvas) => {
        // Fill background
        canvas.setColor("#6400c8");
        canvas.fillRect(0, 0, canvas.width, canvas.height);

        // Draw walls
        canvas.setColor("black");
        for (const object of this.objects) {
          object.draw(canvas);
        }
      });

      this.drawnStatic = true;
    }

    this.withSetupCanvas(screenManager.dynamicWorldCanvas, (canvas) => {
      canvas.clear();

      // Draw interactibles
      this.interactibles.forEach((interactible) => {
        interactible.draw(canvas);
      });

      // Draw player
      this.player.draw(canvas);
    });

    screenManager.setCamera(Vector.scale(this.camera, SCALE_FACTOR));
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
