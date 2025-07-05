import { Canvas } from "../../Canvas";
import { Rectangle } from "../../math/Shapes";
import { Vector } from "../../math/Vector";
import { Projectile } from "./Projectile";

const RADIUS = 120;
const VELOCITY = 240;

const rand = () => Math.random() * 2 - 1;

export class Enemy {
  static radius = RADIUS;

  position: Vector;
  radius: number = RADIUS;

  particles: Projectile[];
  projectiles: Projectile[];

  constructor(initialPosition: Vector) {
    this.position = initialPosition;

    this.particles = [];
    this.projectiles = [];
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   */
  update(deltaTime: number, playerPosition: Vector, playerShield: Rectangle | undefined) {
    if (this.projectiles.length === 0) {
      const startPos = new Vector(
        this.position.x + this.radius * 1.5,
        this.position.y + this.radius * rand() * 1.5,
      );

      const targetPos = new Vector(
        playerPosition.x - this.radius,
        playerPosition.y + rand() * this.radius * 0.2,
      );

      const velocity = Vector.diff(targetPos, startPos);
      velocity.multiply(VELOCITY / velocity.magnitude);

      this.projectiles.push(new Projectile(startPos, velocity));
    }

    this.particles.forEach(particle => particle.update(deltaTime));

    this.projectiles.forEach(projectile => {
      projectile.update(deltaTime);

      if (projectile.distanceTravelled >= 700 && !projectile.fading) {
        projectile.fading = true;
      }

      if (playerShield && projectile.collider.intersectsRectangle(playerShield)) {
        projectile.dead = true;
        for (let i = 0; i < 5; i++) {
          const newVelocity = Vector.scale(projectile.velocity, 0.3);
          if (playerShield.width > playerShield.height) {
            newVelocity.y *= -1;
            newVelocity.x += rand() * VELOCITY * 0.25;
            newVelocity.y += rand() * VELOCITY * 0.15;
          } else {
            newVelocity.x *= -1;
            newVelocity.x += rand() * VELOCITY * 0.15;
            newVelocity.y += rand() * VELOCITY * 0.25;
          }

          this.particles.push(
            Projectile.createFading(
              projectile.position.copy(),
              newVelocity,
              0.2,
            ),
          );
        }
      }
    });

    this.projectiles = this.projectiles.filter(projectile => !projectile.dead);
    this.particles = this.particles.filter(particle => !particle.dead);
  }

  draw(canvas: Canvas) {
    canvas.setColor('red');
    canvas.fillEllipse(this.position.x, this.position.y, this.radius, this.radius);

    this.projectiles.forEach(projectile => projectile.draw(canvas));
    this.particles.forEach(particle => particle.draw(canvas));
  }
}
