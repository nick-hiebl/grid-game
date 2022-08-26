import { PIXELS_PER_TILE } from "../constants/ScreenConstants.js";
import { PuzzleInteractible } from "./interactibles/PuzzleInteractible.js";
import { SwitchInteractible } from "./interactibles/SwitchInteractible.js";
import { Rectangle } from "../math/Shapes.js";
import { Vector } from "../math/Vector.js";

import { ExitTrigger } from "./ExitTrigger.js";
import { LevelFactory } from "./LevelFactory.js";
import { DoorInteractible } from "./interactibles/DoorInteractible.js";
import { TrapdoorInteractible } from "./interactibles/TrapdoorInteractible.js";
import { CoverEntity } from "./entity/CoverEntity.js";

const LEVEL_DATA_URL = "./data/world.json";

function loadJson(file) {
  return fetch(file).then((data) => data.json());
}

function find(list, iden, key = "__identifier") {
  return list.find((item) => item[key] === iden);
}

function findLayer(level, key) {
  return find(level.layerInstances, key);
}

function pxToTile(num) {
  return Math.floor(num / PIXELS_PER_TILE);
}

function srcToBlockType(src) {
  return pxToTile(src[0]) + 1;
}

function getPrereqs(entity) {
  const raw = find(entity.fieldInstances, "prerequisites")?.__value || [];
  return raw.map((ref) => ref.entityIid);
}

function createPuzzle(entity) {
  const id = entity.iid;
  const key = find(entity.fieldInstances, "key");
  if (!key) {
    console.warn("Puzzle with no key in:", level.identifier);
  }
  const center = new Vector(entity.__grid[0] + 2, entity.__grid[1] + 2);
  const config = {
    isFlipped: find(entity.fieldInstances, "isFlipped").__value,
  };
  return new PuzzleInteractible(
    id,
    center,
    Rectangle.aroundPoint(center, 2, 2),
    getPrereqs(entity),
    key.__value,
    config
  );
}

function createSwitch(entity) {
  const id = entity.iid;
  if (!id) {
    console.warn("Switch with no key in:", level.identifier);
  }
  const center = new Vector(entity.__grid[0] + 2, entity.__grid[1] + 2);
  return new SwitchInteractible(
    id,
    center,
    Rectangle.aroundPoint(center, 2, 2),
    getPrereqs(entity)
  );
}

function createDoor(entity) {
  const id = entity.iid;
  if (!id) {
    console.warn("Door with no key in:", level.identifier);
  }
  const door = new Vector(entity.__grid[0] + 2, entity.__grid[1] + 2);
  return new DoorInteractible(id, door, getPrereqs(entity), entity.height / 10);
}

function createTrapdoor(entity) {
  const id = entity.iid;
  if (!id) {
    console.warn("Trapdoor with no key in:", level.identifier);
  }
  const pos = new Vector(...entity.__grid);
  const config = {
    isFlipped: find(entity.fieldInstances, "isFlipped").__value,
    hasLedge: find(entity.fieldInstances, "hasLedge").__value,
  };
  return new TrapdoorInteractible(
    id,
    pos,
    getPrereqs(entity),
    entity.width / 10,
    config
  );
}

function createCoverEntity(entity, entities) {
  const id = entity.iid;
  if (!id) {
    console.warn("CoverEntity with no key in:", level.identifier);
  }
  const triggerId = find(entity.fieldInstances, "triggerArea").__value.entityIid;
  const trigger = find(entities, triggerId, "iid");
  return new CoverEntity(
    id,
    Rectangle.widthForm(...entity.__grid, entity.width / 10, entity.height / 10),
    Rectangle.widthForm(...trigger.__grid, trigger.width / 10, trigger.height / 10)
  );
}

function firstPass(level) {
  const factory = new LevelFactory(
    level.identifier,
    level.iid,
    pxToTile(level.pxWid),
    pxToTile(level.pxHei)
  );
  factory.makeGridSpace();
  const solidLayer = findLayer(level, "Solid");
  for (const cell of solidLayer.gridTiles) {
    const col = pxToTile(cell.px[0]);
    const row = pxToTile(cell.px[1]);
    const blockType = srcToBlockType(cell.src);

    factory.setCell(row, col, blockType);
  }

  let setStartPos = false;
  const entityLayer = findLayer(level, "EntityLayer");

  const entities = entityLayer.entityInstances;
  entities.forEach((entity) => {
    switch (entity.__identifier) {
      case "Util":
        break;
      case "PlayerStart":
        factory.setPlayerPos(new Vector(entity.__grid[0], entity.__grid[1]));
        setStartPos = true;
        break;
      case "PuzzleScreen":
        factory.addInteractibles([createPuzzle(entity)]);
        break;
      case "Switch":
        factory.addInteractibles([createSwitch(entity)]);
        break;
      case "Door":
        factory.addInteractibles([createDoor(entity)]);
        break;
      case "Trapdoor":
        factory.addInteractibles([createTrapdoor(entity)]);
        break;
      case "CoverEntity":
        factory.addEntities([createCoverEntity(entity, entities)]);
        break;
      default:
        console.warn("Processing unknown entity type:", entity.__identifier);
    }
  });

  if (!setStartPos) {
    console.warn(`Level ${level.identifier} is missing a PlayerStart`);
  }

  factory.setWorldPosition(
    new Vector(pxToTile(level.worldX), pxToTile(level.worldY))
  );

  return factory;
}

function secondPass(level, others) {
  const factory = others[level.iid];
  for (const neighbourInfo of level.__neighbours) {
    const nId = neighbourInfo.levelIid;
    const neighbour = others[nId];
    const topLeft = Vector.diff(neighbour.worldPosition, factory.worldPosition);
    const nextCollider = Rectangle.widthForm(
      topLeft.x,
      topLeft.y,
      neighbour.width,
      neighbour.height
    );
    factory.addExits([
      new ExitTrigger(nextCollider, neighbour.key, nextCollider),
    ]);
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
