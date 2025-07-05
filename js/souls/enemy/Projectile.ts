import { Canvas } from "../../Canvas";
import { Circle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";

const PARTICLE_RADIUS = 5;

export class Projectile {
  position: Vector;
  velocity: Vector;

  radius: number;
  collider: Circle;

  timeLeft: number;
  dead: boolean;

  constructor(position: Vector, velocity: Vector) {
    this.position = position;
    this.velocity = velocity;

    this.radius = PARTICLE_RADIUS;
    this.collider = new Circle(this.position, this.radius);

    this.timeLeft = 1;
    this.dead = false;
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   */
  update(deltaTime: number, playerPassed: boolean) {
    if (playerPassed) {
      this.timeLeft -= deltaTime;
      if (this.timeLeft <= 0) {
        this.dead = true;
      }
    }

    this.position.add(Vector.scale(this.velocity, deltaTime));
  }

  draw(canvas: Canvas) {
    canvas.setColorHSLA(180, 0.8, 0.9, this.timeLeft);
    canvas.setColor('#88aaff');
    canvas.fillEllipse(this.position.x, this.position.y, 4, 4);
  }
}
