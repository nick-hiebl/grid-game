"use strict";

import { Up, Down, Right, Left } from "../constants/Keys.js";
import { clamp, sign } from "../math/Common.js";
import { Circle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

const PLAYER_RADIUS = 0.8;

// Running parameters
const PLAYER_MAX_SPEED = 16;
const PLAYER_ACCEL = PLAYER_MAX_SPEED / 0.3;
const PLAYER_DECEL = 2 * PLAYER_ACCEL;
const TURN_SPEED = 1.8 * PLAYER_ACCEL;
// const FRICTION = 0.8;
// const PLAYER_SPEED = 100;

// Jump speed parameters
const JUMP_HEIGHT = 4;
const JUMP_DURATION = 0.6;
const PARAM_A = (4 * JUMP_HEIGHT) / JUMP_DURATION;
const JUMP_INITIAL_SPEED = PARAM_A;
const GRAVITY = (2 * PARAM_A) / JUMP_DURATION;

export class Player {
  constructor(position) {
    this.position = position;
    this.collider = new Circle(position, PLAYER_RADIUS);

    this.velocity = new Vector(0, 0);

    this.isColliding = false;
    this.isKissing = false;
    // this.collidingBy = new Vector(0, 0);
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   * @param {Level} level The level that the player is in.
   */
  update(deltaTime, inputState, level) {
    const inputX = +!!inputState[Right] - +!!inputState[Left];
    // const inputY = +!!inputState[Down] - +!!inputState[Up];

    const acceleration = new Vector(inputX * PLAYER_ACCEL, 0);

    this.isKissing = level.objects.some(object =>
      this.collider.isKissingBelow(object)
    );

    if (this.isKissing) {
      if (sign(inputX)) {
        if (sign(inputX) !== sign(this.velocity.x)) {
          acceleration.x += -TURN_SPEED * sign(this.velocity.x);
        }
      } else {
        acceleration.x +=
          -Math.min(Math.abs(this.velocity.x / deltaTime), PLAYER_DECEL) *
          sign(this.velocity.x);
      }

      if (inputState[Up]) {
        this.velocity.y = -JUMP_INITIAL_SPEED;
      } else {
        this.velocity.y = 0;
      }
    } else {
      acceleration.y += GRAVITY;
    }

    this.velocity.add(Vector.scale(acceleration, deltaTime));
    this.velocity.x = clamp(
      this.velocity.x,
      -PLAYER_MAX_SPEED,
      PLAYER_MAX_SPEED
    );

    this.position.add(
      Vector.add(
        Vector.scale(this.velocity, deltaTime),
        Vector.scale(acceleration, deltaTime * deltaTime)
      )
    );

    this.isColliding = false;

    level.objects.forEach(object => {
      if (this.collider.intersectsRectangle(object)) {
        this.isColliding = true;
        const collidingBy = this.collider.uncollideWithRectangle(object);

        this.velocity.add(collidingBy);
        this.position.add(collidingBy);
      }
      return this.collider.intersectsRectangle(object);
    });
  }

  /**
   * Draw the player on the canvas
   * @param {Canvas} canvas The canvas to draw on
   */
  draw(canvas) {
    if (this.isKissing) {
      canvas.setColor("yellow");
    } else if (this.isColliding) {
      canvas.setColor("red");
    } else {
      canvas.setColorRGB(255, 0, 255);
    }
    // canvas.setColorRGB(255, this.isKissing ? 0 : 255, this.isColliding ? 0 : 255);
    this.collider.draw(canvas);
    // canvas.setColorRGB(255, 255, 255);
    // canvas.drawLine(
    //   this.position.x,
    //   this.position.y,
    //   this.position.x + this.collidingBy.x,
    //   this.position.y + this.collidingBy.y
    // );
  }
}
