/**
 * Clamps a parameter between a low and high bound.
 * @param {number} x The number to be clamped 
 * @param {number} low The lowest value that could be returned
 * @param {number} high The highest value that could be returned
 */
export const clamp = (x, low, high) => {
  return Math.min(high, Math.max(x, low));
};

export const sign = (x) => {
  if (x > 0) {
    return 1;
  } else if (x === 0) {
    return 0;
  } else {
    return -1;
  }
}
