import { Canvas } from "../../Canvas";
import { ScreenManager } from "../../ScreenManager";
import { Level } from "../Level";
import { Player } from "../Player";

export class Entity {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  onStart(_level: Level) {
    // Do nothing
  }

  onAwaken() {
    // Do nothing
  }

  update(_player: Player, _deltaTime: number, _level: Level) {
    // Do nothing
  }

  draw(_screenManager: ScreenManager) {
    // Do nothing
  }

  drawForMap(_canvas: Canvas) {
    // Do nothing
  }

  drawAsMapIcon(_canvas: Canvas, _level: Level) {
    // Do nothing
  }
}
