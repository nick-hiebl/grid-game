export enum BlockEnum {
  SOLID = 1,
  LEDGE = 2,
  VENT = 3,
  LADDER = 4,
}

export const BlockType = {
  isSolid: (blockType?: BlockEnum) => {
    return blockType === BlockEnum.SOLID;
  },
  isGrounding: (blockType?: BlockEnum) => {
    return blockType === BlockEnum.LEDGE || BlockType.isSolid(blockType);
  },
};
