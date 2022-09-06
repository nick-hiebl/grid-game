import { Vector } from "../math/Vector";
import { BlockEnum } from "./BlockTypes";
import { Entity } from "./entity/Entity";
import { ExitTrigger } from "./ExitTrigger";
import { Interactible } from "./interactibles/Interactible";

import { Level, Object } from "./Level";
import { Player } from "./Player";

export class LevelFactory {
  key: string;
  iid: string;
  width: number;
  height: number;
  levelGrid: BlockEnum[][];
  objects: Object[];
  playerPosition: Vector;
  exitTriggers: ExitTrigger[];
  interactibles: Interactible[];
  entities: Entity[];
  worldPosition: Vector;
  bgColor: string;

  constructor(key: string, iid: string, width: number, height: number, color: string) {
    this.key = key;
    this.iid = iid;
    this.width = width;
    this.height = height;
    this.bgColor = color;
    this.levelGrid = [];
    this.objects = [];
    this.playerPosition = new Vector(16, 9);
    this.exitTriggers = [];
    this.interactibles = [];
    this.entities = [];

    this.worldPosition = new Vector(0, 0);
  }

  addObjects(objects: Object[]) {
    this.objects = this.objects.concat(objects);
    return this;
  }

  addExits(exits: ExitTrigger[]) {
    this.exitTriggers = this.exitTriggers.concat(exits);
    return this;
  }

  addInteractibles(is: Interactible[]) {
    this.interactibles = this.interactibles.concat(is);
    return this;
  }

  addEntities(es: Entity[]) {
    this.entities = this.entities.concat(es);
    return this;
  }

  setPlayerPos(pos: Vector) {
    this.playerPosition = pos;
    return this;
  }

  setLevelGrid(grid: BlockEnum[][]) {
    this.levelGrid = grid;
  }

  makeGridSpace() {
    this.levelGrid = [];

    for (let row = 0; row < this.height; row++) {
      this.levelGrid.push([]);
    }
  }

  setWorldPosition(vec: Vector) {
    this.worldPosition = vec;
  }

  setCell(row: number, col: number, blockType: BlockEnum) {
    this.levelGrid[row][col] = blockType;
  }

  create() {
    return new Level(
      this.key,
      this.width,
      this.height,
      this.bgColor,
      this.levelGrid,
      this.objects,
      new Player(this.playerPosition),
      this.exitTriggers,
      this.interactibles,
      this.entities,
      this.worldPosition
    );
  }
}
