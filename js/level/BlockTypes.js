export const BlockType = {
  SOLID: 1,
  LEDGE: 2,
  VENT: 3,
  LADDER: 4,
};

export const isSolid = (blockType) => {
  return blockType === BlockType.SOLID;
};
