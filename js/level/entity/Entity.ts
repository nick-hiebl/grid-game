import { Level } from "../Level";
import { ScreenManager } from "../../ScreenManager";

export class Entity {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  onStart(_level: Level) {
    // Do nothing
  }

  update(_player: unknown, _deltaTime: number, _level: Level) {
    // Do nothing
  }

  draw(_screenManager: ScreenManager) {
    // Do nothing
  }
}
