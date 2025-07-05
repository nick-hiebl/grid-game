import { Canvas } from "../../Canvas";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { Projectile } from "./Projectile";

const RADIUS = 120;
const VELOCITY = 240;

export class Enemy {
  static radius = RADIUS;

  position: Vector;
  radius: number = RADIUS;

  particles: Projectile[];

  constructor(initialPosition: Vector) {
    this.position = initialPosition;

    this.particles = [];
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   */
  update(deltaTime: number, playerPosition: Vector, playerShield: Rectangle | undefined) {
    if (Math.random() < 0.01) {
      const startPos = new Vector(
        this.position.x + this.radius * 1.5,
        this.position.y + this.radius * (Math.random() * 2 - 1) * 1.5,
      );

      const targetPos = new Vector(
        playerPosition.x - this.radius,
        playerPosition.y + (Math.random() * 2 - 1) * this.radius * 0.2,
      );

      const velocity = Vector.diff(targetPos, startPos);
      velocity.multiply(VELOCITY / velocity.magnitude);

      this.particles.push(new Projectile(startPos, velocity));
    }

    this.particles.forEach(particle => {
      particle.update(deltaTime, particle.position.x < playerPosition.x);

      if (playerShield && particle.collider.intersectsRectangle(playerShield)) {
        particle.dead = true;
      }
    });

    this.particles = this.particles.filter(particle => !particle.dead);
  }

  draw(canvas: Canvas) {
    canvas.setColor('red');
    canvas.fillEllipse(this.position.x, this.position.y, this.radius, this.radius);

    this.particles.forEach(particle => particle.draw(canvas));
  }
}
