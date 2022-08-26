import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

export class ExitTrigger {
  collider: Rectangle;
  key: string;
  nextLevelCollider: Rectangle;

  constructor(collider: Rectangle, key: string, nextLevelCollider: Rectangle) {
    this.collider = collider;
    this.key = key;
    this.nextLevelCollider = nextLevelCollider || collider;
  }

  hasEntered(player: unknown) {
    return this.collider.intersectsPoint(player.position);
  }

  translatePlayerToNext(player: unknown) {
    return Vector.diff(
      player.position,
      new Vector(this.nextLevelCollider.x1, this.nextLevelCollider.y1)
    );
  }
}
