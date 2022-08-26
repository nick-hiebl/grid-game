import { TileImage } from "../constants/Image.js";
import { Input } from "../constants/Keys.js";
import {
  CANVAS_WIDTH,
  HORIZONTAL_TILES,
  PIXELS_PER_TILE,
  VERTICAL_TILES,
} from "../constants/ScreenConstants.js";
import { InputState } from "../InputManager.js";
import { clamp } from "../math/Common";
import { Vector } from "../math/Vector";

import { ClosePuzzleEvent, ExitEvent, OpenPuzzleEvent } from "./LevelEvent.js";

const SCALE_FACTOR = CANVAS_WIDTH / HORIZONTAL_TILES;

export class Level {
  constructor(
    key,
    width,
    height,
    levelGrid,
    objects,
    player,
    exitTriggers,
    interactibles,
    entities
  ) {
    this.key = key;
    this.levelGrid = levelGrid;
    this.objects = objects;
    this.player = player;
    this.exitTriggers = exitTriggers;
    this.interactibles = interactibles;
    this.entities = entities;

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
    this.interactibles.forEach((i) => i.onStart(this));
    this.entities.forEach((e) => e.onStart(this));
  }

  addWithoutDuplicate(object) {
    if (!this.objects.find(({ rect }) => rect === object.rect)) {
      this.objects.push(object);
    }
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
      interactible.update(this.player, deltaTime, this);
    });
    if (!this.interactingWith?.isAreaActive) {
      this.closeCurrentPuzzle();
      this.interactingWith = undefined;
    }

    // Update entities
    this.entities.forEach((entity) => {
      entity.update(this.player, deltaTime, this);
    });

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
      const relevant = this.interactibles.find((i) => i.isAreaActive);
      if (relevant) {
        const event = relevant.onInteract();

        if (event && event instanceof OpenPuzzleEvent) {
          this.interactingWith = relevant;
          this.emitEvent(event);
        }
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

  clampCamera(camera) {
    const clampedToPlayer = new Vector(
      clamp(
        camera.x,
        this.player.position.x - HORIZONTAL_TILES + 1,
        this.player.position.x - 1
      ),
      clamp(
        camera.y,
        this.player.position.y - VERTICAL_TILES + 1,
        this.player.position.y - 1
      )
    );
    const clampedToLevel = new Vector(
      clamp(clampedToPlayer.x, 0, this.width - HORIZONTAL_TILES),
      clamp(clampedToPlayer.y, 0, this.height - VERTICAL_TILES)
    );

    return clampedToLevel;
  }

  getNaiveCamera(position = this.player.position) {
    return new Vector(
      position.x - HORIZONTAL_TILES / 2,
      position.y - VERTICAL_TILES / 2
    );
  }

  getIdealCamera(position = this.player.position) {
    return this.clampCamera(this.getNaiveCamera(position));
  }

  updateCamera(deltaTime) {
    this.camera = this.clampCamera(
      Vector.lerp(
        this.camera,
        this.getNaiveCamera(
          Vector.add(
            this.player.position,
            new Vector(this.player.velocity.x * 0.3, 0)
          )
        ),
        deltaTime * 2
      )
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
      // Draw background
      screenManager.background.setColor("#6400c8");
      screenManager.background.fillRect(
        0,
        0,
        screenManager.background.width,
        screenManager.background.height
      );

      this.withSetupCanvas(screenManager.staticWorldCanvas, (canvas) => {
        canvas.clear();

        canvas.setColor("black");
        for (let row = 0; row < this.height; row++) {
          for (let col = 0; col < this.width; col++) {
            const blockType = this.levelGrid[row][col];

            if (blockType) {
              canvas.drawImage(
                TileImage,
                (blockType - 1) * PIXELS_PER_TILE,
                0,
                PIXELS_PER_TILE,
                PIXELS_PER_TILE,
                col,
                row,
                1,
                1
              );
            }
          }
        }
      });

      this.drawnStatic = true;
    }

    this.withSetupCanvas(screenManager.dynamicWorldCanvas, (canvas) => {
      canvas.clear();

      this.withSetupCanvas(screenManager.behindGroundCanvas, () => {
        screenManager.behindGroundCanvas.clear();

        // Draw interactibles
        this.interactibles.forEach((interactible) => {
          interactible.draw(canvas, screenManager);
        });

        // Draw entities
        this.entities.forEach((entity) => {
          entity.draw(screenManager, screenManager.dynamicWorldCanvas);
        });
      });

      // Draw player
      this.player.draw(canvas);
    });

    screenManager.setCamera(
      new Vector(
        Math.floor(this.camera.x * SCALE_FACTOR),
        Math.floor(this.camera.y * SCALE_FACTOR)
      )
    );
  }
}
