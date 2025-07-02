import { Canvas } from "../Canvas";
import { Input } from "../constants/Keys";
import { InputEvent, InputState } from "../InputManager";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

const RADIUS = 30;

type ActionState = 'up' | 'right' | 'low';

const SHIELD_WIDTH = 8;

export class Player {
  static radius = RADIUS;

  position: Vector;
  radius: number = RADIUS;

  actionState?: ActionState;

  constructor(initialPosition: Vector) {
    this.position = initialPosition;

    this.actionState = undefined;
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    if (input.isForKey(Input.Up)) {
      this.actionState = 'up';
    } else if (input.isForKey(Input.Down)) {
      this.actionState = 'low';
    } else if (input.isForKey(Input.Right)) {
      this.actionState = 'right';
    }
  }

  /**
   * Update.
   * @param {number} _deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(_deltaTime: number, inputState: InputState) {
    if (this.actionState === 'up') {
      if (inputState.getVerticalAxis() >= 0) {
        this.actionState = undefined;
      }
    } else if (this.actionState === 'right') {
      if (inputState.getHorizontalAxis() <= 0) {
        this.actionState = undefined;
      }
    } else if (this.actionState === 'low') {
      if (inputState.getVerticalAxis() <= 0) {
        this.actionState = undefined;
      }
    }
  }

  getShieldCollider(): Rectangle | undefined {
    if (this.actionState === 'up') {
      return Rectangle.widthForm(this.position.x - this.radius, this.position.y - RADIUS - SHIELD_WIDTH, RADIUS * 2, SHIELD_WIDTH);
    } else if (this.actionState === 'right') {
      return Rectangle.widthForm(this.position.x + this.radius, this.position.y - RADIUS, SHIELD_WIDTH, RADIUS * 1.2);
    } else if (this.actionState === 'low') {
      return Rectangle.widthForm(this.position.x + this.radius, this.position.y + RADIUS * 0.2, SHIELD_WIDTH, RADIUS * 0.8);
    }
  }

  draw(canvas: Canvas) {
    canvas.setColor('green');
    canvas.fillEllipse(this.position.x, this.position.y, this.radius, this.radius);

    const shieldCollider = this.getShieldCollider();

    if (shieldCollider) {
      canvas.setColor('white');
      shieldCollider.draw(canvas);
    }
  }
}
