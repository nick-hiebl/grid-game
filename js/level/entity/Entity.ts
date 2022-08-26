export class Entity {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  onStart(_level) {
    // Do nothing
  }

  update(_player, _deltaTime, _level) {
    // Do nothing
  }

  draw(_screenManager) {
    // Do nothing
  }
}
