"use strict";

import { Input } from "../constants/Keys.js";
import { clamp, sign } from "../math/Common.js";
import { Circle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

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

export class Player {
  constructor(position) {
    this.position = position;
    this.collider = new Circle(position, PLAYER_RADIUS);

    this.velocity = new Vector(0, 0);

    this.isColliding = false;
    this.isGrounded = false;

    this.wantsToJump = false;
    this.inAirFor = 1;
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input) {
    if (input.input === Input.Jump) {
      this.wantsToJump = true;
    }
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {InputState} inputState The current state of inputs.
   * @param {Level} level The level that the player is in.
   */
  update(deltaTime, inputState, level) {
    const inputX = inputState.getHorizontalAxis();

    const acceleration = new Vector(inputX * PLAYER_ACCEL, 0);

    this.isGrounded = level.objects.some(object =>
      this.collider.isKissingBelow(object)
    );

    if (this.isGrounded) {
      this.inAirFor = 0;
      if (sign(inputX)) {
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
      this.inAirFor += deltaTime;
      acceleration.y += GRAVITY;
    }

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

    level.objects.forEach(object => {
      if (this.collider.intersectsRectangle(object)) {
        this.isColliding = true;
        const collidingBy = this.collider.uncollideWithRectangle(object);

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
      return this.collider.intersectsRectangle(object);
    });

    this.wantsToJump = false;
  }

  /**
   * Draw the player on the canvas
   * @param {Canvas} canvas The canvas to draw on
   */
  draw(canvas) {
    if (this.isGrounded) {
      canvas.setColor("yellow");
    } else if (this.isColliding) {
      canvas.setColor("red");
    } else {
      canvas.setColorRGB(255, 0, 255);
    }

    this.collider.draw(canvas);
  }
}
