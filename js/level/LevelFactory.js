import { Vector } from "../math/Vector.js";

import { Level } from "./Level.js";
import { Player } from "./Player.js";

export class LevelFactory {
  constructor(key, iid, width, height) {
    this.key = key;
    this.iid = iid;
    this.width = width;
    this.height = height;
    this.levelGrid = [];
    this.objects = [];
    this.playerPosition = new Vector(16, 9);
    this.exitTriggers = [];
    this.interactibles = [];

    this.worldPosition = new Vector(0, 0);
  }

  addObjects(objects) {
    this.objects = this.objects.concat(objects);
    return this;
  }

  addExits(exits) {
    this.exitTriggers = this.exitTriggers.concat(exits);
    return this;
  }

  addInteractibles(is) {
    this.interactibles = this.interactibles.concat(is);
    return this;
  }

  setPlayerPos(pos) {
    this.playerPosition = pos;
    return this;
  }

  setLevelGrid(grid) {
    this.levelGrid = grid;
  }

  makeGridSpace() {
    this.levelGrid = [];

    for (let row = 0; row < this.height; row++) {
      this.levelGrid.push([]);
    }
  }

  setWorldPosition(vec) {
    this.worldPosition = vec;
  }

  setCell(row, col, isSolid) {
    this.levelGrid[row][col] = isSolid ? 1 : 0;
  }

  generateLevelGrid() {
    this.makeGridSpace();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const vec = new Vector(col + 0.5, row + 0.5);
        const isSolid = this.objects.some((rect) => rect.intersectsPoint(vec));

        this.setCell(row, col, isSolid);
      }
    }

    this.objects = [];
  }

  create() {
    return new Level(
      this.key,
      this.width,
      this.height,
      this.levelGrid,
      this.objects,
      new Player(this.playerPosition),
      this.exitTriggers,
      this.interactibles
    );
  }
}