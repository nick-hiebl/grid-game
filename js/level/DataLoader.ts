import { PIXELS_PER_TILE } from "../constants/ScreenConstants";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";

import { DoorInteractible } from "./interactibles/DoorInteractible";
import { PuzzleInteractible } from "./interactibles/PuzzleInteractible";
import { SwitchInteractible } from "./interactibles/SwitchInteractible";
import { TrapdoorInteractible } from "./interactibles/TrapdoorInteractible";
import { CoverEntity } from "./entity/CoverEntity";

import { ExitTrigger } from "./ExitTrigger";
import { LevelFactory } from "./LevelFactory";
import { Level } from "./Level";
import { PuzzleRules } from "../puzzle-manager/PuzzleFactory";
import { DecorationEntity } from "./entity/DecorationEntity";
import { NodeInteractible } from "./interactibles/NodeInteractible";

const LEVEL_DATA_URL = "./data/world.json";
const PUZZLE_DATA_URL = "./data/puzzles.json";

interface EntityRef {
  entityIid: string;
}

interface FieldData {
  __identifier: string;
  __value: string | boolean | string[] | EntityRef | EntityRef[];
}

interface EntityData {
  __identifier: string;
  iid: string;
  fieldInstances: FieldData[];
  __grid: [number, number];
  px: [number, number];
  width: number;
  height: number;
  __tags: string[];
  __tile: { x: number; y: number; w: number; h: number };
}

interface GridCell {
  px: [number, number];
  src: [number, number];
}

interface LayerData {
  __identifier: string;
  gridTiles: GridCell[];
  entityInstances: EntityData[];
}

interface LevelData {
  identifier: string;
  iid: string;
  pxWid: number;
  pxHei: number;
  worldX: number;
  worldY: number;

  __bgColor: string;
  __neighbours: { levelIid: string }[];

  layerInstances: LayerData[];
}

interface WorldData {
  levels: LevelData[];
}

function loadJson<T>(file: string): Promise<T> {
  return fetch(file).then((data) => data.json());
}

function find<T extends { __identifier: string }>(list: T[], iden: string) {
  return list.find((item) => item.__identifier === iden);
}

function findByIid<T extends { iid: string }>(list: T[], iid?: string) {
  return list.find((item) => item.iid === iid);
}

function findLayer(level: LevelData, key: string) {
  return find(level.layerInstances, key);
}

function pxToTile(num: number) {
  return Math.floor(num / PIXELS_PER_TILE);
}

function toTile(num: number) {
  return num / PIXELS_PER_TILE;
}

function srcToBlockType(src: [number, number]) {
  return pxToTile(src[0]) + 1;
}

function getField<T>(entity: EntityData, fieldKey: string): T | undefined {
  return find(entity.fieldInstances, fieldKey)?.__value as T | undefined;
}

function getPrereqs(entity: EntityData) {
  const raw = getField<EntityRef[]>(entity, "prerequisites") || [];
  return raw.map((ref) => ref.entityIid);
}

function getInteractibleTrigger(entity: EntityData, entities: EntityData[]) {
  const triggerId = getField<EntityRef>(entity, "triggerArea")?.entityIid;
  const triggerArea = triggerId ? findByIid(entities, triggerId) : undefined;

  return triggerArea
    ? rectOfEntity(triggerArea)
    : Rectangle.aroundPoint(
        new Vector(entity.__grid[0] + 2, entity.__grid[1] + 2),
        2,
        2
      );
}

function entityToPos(entity: EntityData) {
  return Vector.scale(new Vector(...entity.px), 1 / PIXELS_PER_TILE);
}

function createPuzzle(entity: EntityData, entities: EntityData[]) {
  const id = entity.iid;
  const key = getField<string>(entity, "key");
  if (!key) {
    console.warn("Puzzle with no key!");
  }
  const center = new Vector(entity.__grid[0] + 2, entity.__grid[1] + 2);
  const config = {
    isFlipped: getField<boolean>(entity, "isFlipped"),
  };

  return new PuzzleInteractible(
    id,
    center,
    getInteractibleTrigger(entity, entities),
    getPrereqs(entity),
    key!,
    config
  );
}

function createSwitch(entity: EntityData, entities: EntityData[]) {
  const id = entity.iid;
  if (!id) {
    console.warn("Switch with no key!");
  }
  const center = new Vector(entity.__grid[0] + 2, entity.__grid[1] + 2);
  return new SwitchInteractible(
    id,
    center,
    getInteractibleTrigger(entity, entities),
    getPrereqs(entity)
  );
}

function createDoor(entity: EntityData) {
  const id = entity.iid;
  if (!id) {
    console.warn("Door with no key!");
  }
  const door = Vector.add(entityToPos(entity), new Vector(2, 2));
  return new DoorInteractible(
    id,
    door,
    getPrereqs(entity),
    pxToTile(entity.height)
  );
}

function createTrapdoor(entity: EntityData) {
  const id = entity.iid;
  if (!id) {
    console.warn("Trapdoor with no key!");
  }
  const pos = entityToPos(entity);
  const config = {
    isFlipped: getField<boolean>(entity, "isFlipped"),
    hasLedge: getField<boolean>(entity, "hasLedge"),
    isSingle: getField<boolean>(entity, "isSingle"),
  };
  return new TrapdoorInteractible(
    id,
    pos,
    getPrereqs(entity),
    pxToTile(entity.width),
    config
  );
}

const rectOfEntity = (entity: EntityData) => {
  return Rectangle.widthForm(
    toTile(entity.px[0]),
    toTile(entity.px[1]),
    pxToTile(entity.width),
    pxToTile(entity.height)
  );
};

function isDefined<T>(value: T | undefined): value is T {
  return !!value;
}

function createCoverEntity(entity: EntityData, entities: EntityData[]) {
  const id = entity.iid;
  if (!id) {
    console.warn("CoverEntity with no key!");
  }
  const triggerId = getField<EntityRef>(entity, "triggerArea")?.entityIid;
  const trigger = findByIid(entities, triggerId) || entity;

  const extraField = getField<EntityRef[]>(entity, "extraCover") || [];
  const extraCovers = extraField
    .map((ref) => findByIid(entities, ref.entityIid))
    .filter(isDefined)
    .map(rectOfEntity);

  const config = {
    coverIsTrigger: getField<boolean>(entity, "coverIsTrigger"),
    canReCover: getField<boolean>(entity, "canReCover"),
  };

  return new CoverEntity(
    id,
    rectOfEntity(entity),
    extraCovers,
    rectOfEntity(trigger),
    config
  );
}

function createDecoration(entity: EntityData) {
  return new DecorationEntity(
    entity.iid,
    entityToPos(entity),
    pxToTile(entity.width),
    pxToTile(entity.height),
    new Vector(entity.__tile.x, entity.__tile.y),
    entity.__tile.w,
    entity.__tile.h,
    entity.__tags.includes("Scaling")
  );
}

function createNode(entity: EntityData) {
  const id = entity.iid;
  const key = getField<string>(entity, "key");
  const prereqs = getPrereqs(entity);
  if (!key && !prereqs.length) {
    console.warn("Node with no key or prerequisites!");
  }

  return new NodeInteractible(
    id,
    rectOfEntity(entity).midpoint,
    prereqs,
    key!
  );
}

function firstPass(level: LevelData): LevelFactory {
  const factory = new LevelFactory(
    level.identifier,
    level.iid,
    pxToTile(level.pxWid),
    pxToTile(level.pxHei),
    level.__bgColor
  );
  factory.makeGridSpace();
  const solidLayer = findLayer(level, "Solid")!;
  for (const cell of solidLayer.gridTiles) {
    const col = pxToTile(cell.px[0]);
    const row = pxToTile(cell.px[1]);
    const blockType = srcToBlockType(cell.src);

    factory.setCell(row, col, blockType);
  }

  let setStartPos = false;
  const entityLayer = findLayer(level, "EntityLayer")!;

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
        const key = getField<string>(entity, "key");
        if (!key) {
          console.warn("Puzzle with unknown id in:", level.identifier);
        }
        factory.addInteractibles([createPuzzle(entity, entities)]);
        break;
      case "Switch":
        factory.addInteractibles([createSwitch(entity, entities)]);
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
      case "Node":
        factory.addInteractibles([createNode(entity)]);
        break;
      default:
        console.warn("Processing unknown entity type:", entity.__identifier);
    }
  });

  const decors = findLayer(level, "Decorations")?.entityInstances;
  if (decors) {
    factory.addEntities(decors.map(createDecoration));
  }

  if (!setStartPos) {
    console.warn(`Level ${level.identifier} is missing a PlayerStart`);
  }

  factory.setWorldPosition(
    new Vector(pxToTile(level.worldX), pxToTile(level.worldY))
  );

  return factory;
}

function secondPass(level: LevelData, others: Record<string, LevelFactory>) {
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

interface RawPuzzles {
  puzzlesByLevel: {
    [levelName: string]: {
      [groupName: string]: Record<string, PuzzleRules>;
    };
  };
}

export class DataLoader {
  static hasLoaded = false;
  static data: WorldData | null = null;
  static levelMap: Record<string, Level> = {};
  static puzzles: Record<string, PuzzleRules> = {};

  static async fetchPuzzles() {
    const rawPuzzles = await loadJson<RawPuzzles>(PUZZLE_DATA_URL);

    const { puzzlesByLevel } = rawPuzzles;
    const allPuzzles: Record<string, PuzzleRules> = {};

    for (const level of Object.values(puzzlesByLevel)) {
      for (const group of Object.values(level))
        Object.assign(allPuzzles, group);
    }

    DataLoader.puzzles = allPuzzles;
  }

  static async fetchWorld() {
    const data = await loadJson<WorldData>(LEVEL_DATA_URL);
    DataLoader.data = data;

    const basicMap: Record<string, LevelFactory> = {};

    data.levels.forEach((level) => {
      const basicData = firstPass(level);
      basicMap[basicData.iid] = basicData;
      basicMap[basicData.key] = basicData;
    });

    data.levels.forEach((rawLevel) => {
      const level = secondPass(rawLevel, basicMap);
      DataLoader.levelMap[level.key] = level;
    });
  }

  static async start() {
    await Promise.all([DataLoader.fetchPuzzles(), DataLoader.fetchWorld()]);
  }

  static getLevel(key: string) {
    return DataLoader.levelMap[key];
  }
}
