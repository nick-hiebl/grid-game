import { PIXELS_PER_TILE } from "../constants/ScreenConstants.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";
import { ExitTrigger } from "./ExitTrigger.js";

import { LevelFactory } from "./LevelFactory.js";

const LEVEL_DATA_URL = "../../data/world.json";

function loadJson(file) {
  return fetch(file).then((data) => data.json());
}

function find(list, iden) {
  return list.find((item) => item.__identifier === iden);
}

function findLayer(level, key) {
  return find(level.layerInstances, key);
}

function pxToTile(num) {
  return Math.floor(num / PIXELS_PER_TILE);
}

function firstPass(level) {
  const factory = new LevelFactory(level.identifier, level.iid, pxToTile(level.pxWid), pxToTile(level.pxHei));
  factory.makeGridSpace();
  const solidLayer = findLayer(level, "Solid");
  for (const cell of solidLayer.gridTiles) {
    const col = pxToTile(cell.px[0]);
    const row = pxToTile(cell.px[1]);
    factory.setCell(row, col, cell.src[0] === 0 && cell.src[1] === 0);
  }
  const entityLayer = findLayer(level, "EntityLayer");
  const playerStart = find(entityLayer.entityInstances, "PlayerStart");
  if (playerStart) {
    factory.setPlayerPos(new Vector(playerStart.__grid[0], playerStart.__grid[1]));
  } else {
    console.warn('Level', level.identifier, 'is missing a PlayerStart');
  }

  factory.setWorldPosition(new Vector(pxToTile(level.worldX), pxToTile(level.worldY)));

  return factory;
}

function secondPass(level, others) {
  const factory = others[level.iid];
  for (const neighbourInfo of level.__neighbours) {
    const nId = neighbourInfo.levelIid;
    const neighbour = others[nId];
    const topLeft = Vector.diff(neighbour.worldPosition, factory.worldPosition);
    const nextCollider = Rectangle.widthForm(topLeft.x, topLeft.y, neighbour.width, neighbour.height);
    factory.addExits([new ExitTrigger(nextCollider, neighbour.key, nextCollider)]);
  }

  return factory.create();
}

export class DataLoader {
  static hasLoaded = false;
  static data = null;
  static levelMap = {};

  static start() {
    return loadJson(LEVEL_DATA_URL)
      .then((data) => {
        DataLoader.data = data;

        const basicMap = {};

        data.levels.forEach((level) => {
          const basicData = firstPass(level);
          basicMap[basicData.iid] = basicData;
          basicMap[basicData.key] = basicData;
        });

        data.levels.forEach((rawLevel) => {
          const level = secondPass(rawLevel, basicMap);
          DataLoader.levelMap[level.key] = level;
        });
      })
      .then(() => undefined);
  }

  static getLevel(key) {
    return DataLoader.levelMap[key];
  }
}