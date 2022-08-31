import { Canvas } from "../Canvas";
import { TileImage } from "../constants/Image";
import { Input } from "../constants/Keys";
import {
  CANVAS_WIDTH,
  HORIZONTAL_TILES,
  PIXELS_PER_TILE,
  VERTICAL_TILES,
} from "../constants/ScreenConstants";
import { InputEvent, InputState } from "../InputManager";
import { clamp } from "../math/Common";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";

import { Entity } from "./entity/Entity";

import { BlockEnum } from "./BlockTypes";
import { ExitTrigger } from "./ExitTrigger";
import {
  ClosePuzzleEvent,
  ExitEvent,
  LevelEvent,
  OpenPuzzleEvent,
} from "./LevelEvent";
import { Interactible } from "./interactibles/Interactible";
import { Player } from "./Player";
import { PlayMode } from "../game-modes/PlayMode";
import { BackgroundArtist } from "./background/BackgroundArtist";

const SCALE_FACTOR = CANVAS_WIDTH / HORIZONTAL_TILES;

export interface Object {
  type: BlockEnum;
  rect: Rectangle;
}

export class Level {
  key: string;
  levelGrid: BlockEnum[][];
  width: number;
  height: number;

  player: Player;

  objects: Object[];
  exitTriggers: ExitTrigger[];
  interactibles: Interactible[];
  entities: Entity[];

  camera: Vector;
  interactingWith: Interactible | undefined;

  backgroundArtist: BackgroundArtist;
  drawnStatic: boolean;
  playModeManager: PlayMode | undefined;

  worldPosition: Vector;

  visited: boolean;

  constructor(
    key: string,
    width: number,
    height: number,
    levelGrid: BlockEnum[][],
    objects: Object[],
    player: Player,
    exitTriggers: ExitTrigger[],
    interactibles: Interactible[],
    entities: Entity[],
    worldPosition: Vector
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

    this.backgroundArtist = new BackgroundArtist(width, height);
    this.drawnStatic = false;
    this.playModeManager = undefined;

    this.worldPosition = worldPosition;

    this.visited = false;
  }

  start(playModeManager: PlayMode) {
    this.onAwaken();

    this.interactingWith = undefined;
    this.playModeManager = playModeManager;
    this.interactibles.forEach((i) => i.onStart(this));
    this.entities.forEach((e) => e.onStart(this));

    this.visited = true;
  }

  onAwaken() {
    this.drawnStatic = false;
    this.interactibles.forEach((i) => i.onAwaken());
    this.entities.forEach((e) => e.onAwaken());
  }

  addWithoutDuplicate(object: Object) {
    if (!this.objects.find(({ rect }) => rect === object.rect)) {
      this.objects.push(object);
    }
  }

  emitEvent(event: LevelEvent) {
    // TODO: Either guarantee that this is available or create a queue to send
    // these events once it does become available.
    if (this.playModeManager) {
      this.playModeManager.onLevelEvent(event);
    }
  }

  feedPlayerInfo(previousPlayer: Player, previousExit: ExitTrigger) {
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
  update(deltaTime: number, inputState: InputState) {
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

      this.interactingWith = undefined;
    }
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    if (this.isPlayerActive()) {
      this.player.onInput(input);
    }

    if (input.isForKey(Input.Interact)) {
      if (this.interactingWith) {
        this.closeCurrentPuzzle();
      } else {
        const relevant = this.interactibles.find((i) => i.isAreaActive);
        if (relevant) {
          const event = relevant.onInteract();

          if (event && event instanceof OpenPuzzleEvent) {
            this.interactingWith = relevant;
            this.emitEvent(event);
          }
        }
      }
    } else if (input.isForKey(Input.Escape)) {
      this.closeCurrentPuzzle();
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

  clampCamera(camera: Vector) {
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

  updateCamera(deltaTime: number) {
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

  withSetupCanvas(canvas: Canvas, action: (canvas: Canvas) => void) {
    canvas.saveTransform();
    canvas.scale(SCALE_FACTOR, SCALE_FACTOR);
    action(canvas);
    canvas.restoreTransform();
  }

  drawForMap(canvas: Canvas) {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const blockType = this.levelGrid[row][col];

        if (blockType === BlockEnum.SOLID) {
          canvas.setColor("black");
          canvas.fillRect(col, row, 1, 1);
        }
      }
    }

    for (const entity of this.entities) {
      entity.drawForMap(canvas);
    }
  }

  /**
   * Draw the current level.
   * @param {ScreenManager} screenManager The screen to draw on
   */
  draw(screenManager: ScreenManager) {
    if (!this.drawnStatic) {
      // Draw background
      this.backgroundArtist.draw(screenManager);

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

      screenManager.uiCanvas.clear();

      this.drawnStatic = true;
    }

    this.withSetupCanvas(screenManager.dynamicWorldCanvas, (canvas) => {
      canvas.clear();

      this.withSetupCanvas(screenManager.behindGroundCanvas, () => {
        screenManager.behindGroundCanvas.clear();

        // Draw interactibles
        this.interactibles.forEach((interactible) => {
          interactible.draw(screenManager);
        });

        // Draw player
        this.player.draw(canvas);

        // Draw entities
        this.entities.forEach((entity) => {
          entity.draw(screenManager);
        });
      });
    });

    screenManager.setCamera(
      new Vector(
        Math.floor(this.camera.x * SCALE_FACTOR),
        Math.floor(this.camera.y * SCALE_FACTOR)
      )
    );

    this.backgroundArtist.updateCameras(screenManager);
  }
}
