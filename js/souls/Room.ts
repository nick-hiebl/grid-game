import { InputEvent, InputState } from "../InputManager";
import { ScreenManager } from "../ScreenManager";
import { Vector } from "../math/Vector";

import { Enemy } from "./enemy/Enemy";
import { Player } from "./Player";

const FLOOR_Y = 520;

export class Room {
  player: Player;
  enemy: Enemy;

  constructor() {
    this.player = new Player(new Vector(400, FLOOR_Y - Player.radius));
    this.enemy = new Enemy(new Vector(700, FLOOR_Y - Enemy.radius));
  }

  getCameraFor(position: Vector, screenManager: ScreenManager): Vector {
    return new Vector(
      position.x - screenManager.uiCanvas.width / 2,
      position.y - screenManager.uiCanvas.height / 2,
    );
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.player.update(deltaTime, inputState);

    this.enemy.update(deltaTime, this.player.position, this.player.getShieldCollider());
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.player.onInput(input);
  }

  drawnStatic: boolean = false;

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: ScreenManager) {
    // screenManager.setCamera(this.getCameraFor(
    //   Vector.lerp(this.player.position, this.enemy.position, 0.5),
    //   screenManager,
    // ));
    if (!this.drawnStatic) {
      screenManager.background.setColor('#330066')
      screenManager.background.fillRect(0, 0, screenManager.background.width, screenManager.background.height);

      screenManager.staticWorldCanvas.setColor('black');
      screenManager.staticWorldCanvas.fillRect(0, FLOOR_Y, screenManager.staticWorldCanvas.width, 500);

      this.drawnStatic = true;
    }

    screenManager.dynamicWorldCanvas.clear();
    this.player.draw(screenManager.dynamicWorldCanvas);
    this.enemy.draw(screenManager.dynamicWorldCanvas);
  }
}
