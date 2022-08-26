import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

import { Player } from "./Player";

export class ExitTrigger {
  collider: Rectangle;
  key: string;
  nextLevelCollider: Rectangle;

  constructor(collider: Rectangle, key: string, nextLevelCollider: Rectangle) {
    this.collider = collider;
    this.key = key;
    this.nextLevelCollider = nextLevelCollider || collider;
  }

  hasEntered(player: Player) {
    return this.collider.intersectsPoint(player.position);
  }

  translatePlayerToNext(player: Player) {
    return Vector.diff(
      player.position,
      new Vector(this.nextLevelCollider.x1, this.nextLevelCollider.y1)
    );
  }
}
