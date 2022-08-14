import { Vector } from "../math/Vector.js";

export class ExitTrigger {
  constructor(collider, key, nextLevelCollider) {
    this.collider = collider;
    this.key = key;
    this.nextLevelCollider = nextLevelCollider || collider;
  }

  hasEntered(player) {
    return this.collider.intersectsPoint(player.position);
  }

  translatePlayerToNext(player) {
    return Vector.diff(
      player.position,
      new Vector(this.nextLevelCollider.x1, this.nextLevelCollider.y1)
    );
  }
}
