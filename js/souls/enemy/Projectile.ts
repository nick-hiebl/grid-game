import { Canvas } from "../../Canvas";
import { Circle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";

const PARTICLE_RADIUS = 5;

const INITIAL_TIME = 0.3;

export class Projectile {
  position: Vector;
  velocity: Vector;
  speed: number;

  radius: number;
  collider: Circle;

  lifeTime: number;
  timeLeft: number;
  dead: boolean;
  fading: boolean;

  distanceTravelled: number;

  static createFading(position: Vector, velocity: Vector, lifeTime: number) {
    const projectile = new Projectile(position, velocity);
    projectile.fading = true;
    projectile.lifeTime = lifeTime;

    return projectile;
  }

  constructor(position: Vector, velocity: Vector) {
    this.position = position;
    this.velocity = velocity;
    this.speed = velocity.magnitude;

    this.radius = PARTICLE_RADIUS;
    this.collider = new Circle(this.position, this.radius);

    this.lifeTime = INITIAL_TIME;
    this.timeLeft = INITIAL_TIME;
    this.dead = false;
    this.fading = false;

    this.distanceTravelled = 0;
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   */
  update(deltaTime: number) {
    if (this.fading) {
      this.timeLeft -= deltaTime;
    }

    if (this.timeLeft <= 0) {
      this.dead = true;
    }

    this.position.add(Vector.scale(this.velocity, deltaTime));

    this.distanceTravelled += this.speed * deltaTime;
  }

  draw(canvas: Canvas) {
    canvas.setColorHSLA(180, 0.8, 0.9, this.timeLeft / INITIAL_TIME);
    canvas.fillEllipse(this.position.x, this.position.y, 4, 4);
  }
}
