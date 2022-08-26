import { Canvas } from "../Canvas";
import { Input } from "../constants/Keys";
import { InputEvent, InputState } from "../InputManager";
import { clamp, sign } from "../math/Common";
import { Circle, Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { BlockEnum, BlockType } from "./BlockTypes";
import { Level } from "./Level";

import { RectPool } from "./RectPool";

const PLAYER_RADIUS = 0.8;

// Running parameters
const PLAYER_MAX_SPEED = 16;
const PLAYER_ACCEL = PLAYER_MAX_SPEED / 0.3;
const PLAYER_DECEL = 2 * PLAYER_ACCEL;
const TURN_SPEED = 1.8 * PLAYER_ACCEL;

// Jump speed parameters
const JUMP_HEIGHT = 4;
const JUMP_DURATION = 0.6;
const PARAM_A = (4 * JUMP_HEIGHT) / JUMP_DURATION;
const JUMP_INITIAL_SPEED = PARAM_A;
const GRAVITY = (2 * PARAM_A) / JUMP_DURATION;

// Jump assist parameters
const COYOTE_TIME = 0.1;

function isDefined<T>(value: T | undefined): value is T {
  return !!value;
}

export class Player {
  position: Vector;
  velocity: Vector;
  collider: Circle;

  isColliding: boolean;
  isGrounded: boolean;
  isDropping: boolean;

  wantsToJump: boolean;
  contactingAnyLedge: boolean;
  inAirFor: number;

  constructor(position: Vector) {
    this.position = position;
    this.collider = new Circle(position, PLAYER_RADIUS);

    this.velocity = new Vector(0, 0);

    this.isColliding = false;
    this.isGrounded = false;
    this.isDropping = false;

    this.wantsToJump = false;
    this.contactingAnyLedge = false;
    this.inAirFor = 1;
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    if (input.isForKey(Input.Jump)) {
      this.wantsToJump = true;
    }
  }

  collideWithBlock(type: BlockEnum, rect: Rectangle, deltaTime: number) {
    const isActiveLedge =
      !this.isDropping &&
      type === BlockEnum.LEDGE &&
      this.velocity.y >= 0 &&
      this.position.y < rect.y1;

    const intersects = this.collider.intersectsRectangle(rect);

    if (intersects && type === BlockEnum.LEDGE) {
      this.contactingAnyLedge = true;
      if (this.velocity.y < 0 && this.position.y >= rect.y1) {
        this.isDropping = true;
      }
    }

    if (BlockType.isSolid(type) || isActiveLedge) {
      if (intersects) {
        this.isColliding = true;
        const collidingBy = rect.uncollideCircle(this.collider);

        this.velocity.add(Vector.scale(collidingBy, 1 / deltaTime));
        // Horizontal rebound
        if (collidingBy.x > 0 && collidingBy.y === 0) {
          this.velocity.x = Math.max(0, this.velocity.x);
        } else if (collidingBy.x < 0 && collidingBy.y === 0) {
          this.velocity.x = Math.min(0, this.velocity.x);
        }
        // Vertical rebound
        if (collidingBy.y > 0 && collidingBy.x === 0) {
          this.velocity.y = Math.max(0, this.velocity.y);
        } else if (collidingBy.y < 0 && collidingBy.x === 0) {
          this.velocity.y = Math.min(0, this.velocity.y);
        }
        this.position.add(collidingBy);
      }
      return this.collider.intersectsRectangle(rect);
    }
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {InputState} inputState The current state of inputs.
   * @param {Level} level The level that the player is in.
   */
  update(deltaTime: number, inputState: InputState, level: Level) {
    const getCellAt = (x: number, y: number) => {
      return level.levelGrid[Math.floor(y)]?.[Math.floor(x)];
    };
    const getRectAt = (x: number, y: number) => {
      const type = getCellAt(x, y);
      if (type) {
        return {
          type: getCellAt(x, y),
          rect: RectPool.get(
            Math.floor(y),
            Math.floor(x),
            type === BlockEnum.LEDGE
          ),
        };
      }
    };

    // Process horizontal input
    const inputX = inputState.getHorizontalAxis();
    const acceleration = new Vector(inputX * PLAYER_ACCEL, 0);

    if (inputState.isPressed(Input.Down)) {
      this.isDropping = true;
    }

    // Check grounded
    const playerBottom = this.position.y + this.collider.radius;
    const cellBelow = getCellAt(this.position.x, playerBottom);
    const groundingCellBelow = this.isDropping
      ? BlockType.isSolid(cellBelow)
      : BlockType.isGrounding(cellBelow);

    const gridCellWithin = getCellAt(this.position.x, this.position.y);
    const groundedOnGridCell =
      groundingCellBelow && playerBottom === Math.floor(playerBottom);

    this.isGrounded =
      groundedOnGridCell ||
      level.objects.some(
        ({ type, rect }) =>
          (this.isDropping
            ? BlockType.isSolid(type)
            : BlockType.isGrounding(type)) && this.collider.isKissingBelow(rect)
      );

    // General motion
    if (this.isGrounded) {
      this.inAirFor = 0;
      if (sign(inputX)) {
        // Turn speed
        if (sign(inputX) !== sign(this.velocity.x)) {
          acceleration.x += -TURN_SPEED * sign(this.velocity.x);
        }
      } else {
        acceleration.x +=
          -Math.min(Math.abs(this.velocity.x / deltaTime), PLAYER_DECEL) *
          sign(this.velocity.x);
      }

      this.velocity.y = 0;
    } else {
      // Gravity
      this.inAirFor += deltaTime;
      if (gridCellWithin === BlockEnum.VENT) {
        const ventMultiplier = this.velocity.y > 0 ? 0 : 1.1;
        acceleration.y -= GRAVITY * ventMultiplier;
      } else {
        acceleration.y += GRAVITY;
      }
    }

    // Coyote jump
    if (this.inAirFor < COYOTE_TIME && this.wantsToJump) {
      this.velocity.y = -JUMP_INITIAL_SPEED;
    }

    this.velocity.add(Vector.scale(acceleration, deltaTime));
    this.velocity.x = clamp(
      this.velocity.x,
      -PLAYER_MAX_SPEED,
      PLAYER_MAX_SPEED
    );

    const step = Vector.scale(this.velocity, deltaTime);

    step.x = clamp(step.x, -PLAYER_RADIUS, PLAYER_RADIUS);
    step.y = clamp(step.y, -PLAYER_RADIUS, PLAYER_RADIUS);

    this.position.add(step);

    this.isColliding = false;

    const { x, y } = this.position;

    // Re-ordered to prioritise collisions with closer blocks first
    const nearbyBlocks = [
      getRectAt(x, y),
      getRectAt(x, y + 1),
      getRectAt(x, y - 1),
      getRectAt(x - 1, y),
      getRectAt(x + 1, y),
      getRectAt(x - 1, y - 1),
      getRectAt(x + 1, y - 1),
      getRectAt(x - 1, y + 1),
      getRectAt(x + 1, y + 1),
    ].filter(isDefined);

    this.contactingAnyLedge = false;

    nearbyBlocks.concat(level.objects).forEach(({ type, rect }) => {
      this.collideWithBlock(type, rect, deltaTime);
    });

    this.wantsToJump = false;
    this.isDropping = this.isDropping && this.contactingAnyLedge;
  }

  /**
   * Draw the player on the canvas
   * @param {Canvas} canvas The canvas to draw on
   */
  draw(canvas: Canvas) {
    canvas.setColor("yellow");

    this.collider.draw(canvas);
  }
}
