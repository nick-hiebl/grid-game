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

// Climbing parameters
const CLIMB_MAX_SPEED = PLAYER_MAX_SPEED * 0.5;

function isDefined<T>(value: T | undefined): value is T {
  return !!value;
}

enum PlayerState {
  GROUND,
  CLIMB,
  AIR,
}

export class Player {
  position: Vector;
  velocity: Vector;
  collider: Circle;

  isDropping: boolean;

  wantsToJump: boolean;
  contactingAnyLedge: boolean;
  inAirFor: number;

  state: PlayerState;

  constructor(position: Vector) {
    this.position = position;
    this.collider = new Circle(position, PLAYER_RADIUS);

    this.velocity = new Vector(0, 0);

    this.isDropping = false;

    this.wantsToJump = false;
    this.contactingAnyLedge = false;
    this.inAirFor = 1;

    this.state = PlayerState.AIR;
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
    const getCellAt = (x: number, y: number): BlockEnum | undefined => {
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
    const inputY = inputState.getVerticalAxis();
    const acceleration = new Vector(inputX * PLAYER_ACCEL, 0);

    if (inputState.isPressed(Input.Down) && this.state !== PlayerState.CLIMB) {
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

    const isGrounded =
      groundedOnGridCell ||
      level.objects.some(
        ({ type, rect }) =>
          (this.isDropping
            ? BlockType.isSolid(type)
            : BlockType.isGrounding(type)) && this.collider.isKissingBelow(rect)
      );

    const hasLeftLadder = this.state === PlayerState.CLIMB && gridCellWithin !== BlockEnum.LADDER;

    // Calculate immediate overrides
    if (gridCellWithin === BlockEnum.LADDER && inputY !== 0) {
      this.state = PlayerState.CLIMB;
    } else if (isGrounded) {
      this.state = PlayerState.GROUND;
    } else if (!gridCellWithin || hasLeftLadder) {
      // If just leaving ladder and holding up
      if (hasLeftLadder && inputY < 0) {
        this.wantsToJump = true;
      }
      this.state = PlayerState.AIR;
    }

    const updateSpeed = (input: number, vCurr: number, decel: number) => {
      if (sign(input)) {
        // Turn speed
        if (sign(input) !== sign(vCurr)) {
          return -TURN_SPEED * sign(vCurr);
        }
      } else {
        return -Math.min(Math.abs(vCurr / deltaTime), decel) * sign(vCurr);
      }

      return 0;
    };

    // General motion
    if (this.state === PlayerState.GROUND) {
      this.inAirFor = 0;

      acceleration.x += updateSpeed(inputX, this.velocity.x, PLAYER_DECEL);

      this.velocity.y = 0;
    } else if (this.state === PlayerState.CLIMB) {
      this.inAirFor = 0;
      acceleration.y = inputState.getVerticalAxis() * PLAYER_ACCEL;

      acceleration.x += updateSpeed(inputX, this.velocity.x, PLAYER_DECEL);
      acceleration.y += updateSpeed(inputY, this.velocity.y, PLAYER_DECEL);
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
      this.wantsToJump = false;
      this.velocity.y = -JUMP_INITIAL_SPEED;
      this.state = PlayerState.AIR;
    }

    this.velocity.add(Vector.scale(acceleration, deltaTime));
    if (this.state === PlayerState.CLIMB) {
      this.velocity.x = clamp(
        this.velocity.x,
        -CLIMB_MAX_SPEED,
        CLIMB_MAX_SPEED
      );
      this.velocity.y = clamp(
        this.velocity.y,
        -CLIMB_MAX_SPEED,
        CLIMB_MAX_SPEED
      );
    } else {
      this.velocity.x = clamp(
        this.velocity.x,
        -PLAYER_MAX_SPEED,
        PLAYER_MAX_SPEED
      );
    }

    const step = Vector.scale(this.velocity, deltaTime);

    step.x = clamp(step.x, -PLAYER_RADIUS, PLAYER_RADIUS);
    step.y = clamp(step.y, -PLAYER_RADIUS, PLAYER_RADIUS);

    this.position.add(step);

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
      this.collideWithBlock(type!, rect, deltaTime);
    });

    this.isDropping = this.isDropping && this.contactingAnyLedge;
  }

  /**
   * Draw the player on the canvas
   * @param {Canvas} canvas The canvas to draw on
   */
  draw(canvas: Canvas) {
    canvas.setColor("#0096ff");

    this.collider.draw(canvas);
  }
}
