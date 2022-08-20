export const BlockType = {
  SOLID: 1,
  LEDGE: 2,
  VENT: 3,
  LADDER: 4,
  isSolid: (blockType) => {
    return blockType === BlockType.SOLID;
  },
  isGrounding: (blockType) => {
    return blockType === BlockType.SOLID || blockType === BlockType.LEDGE;
  },
};
