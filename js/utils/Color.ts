const HEX = 16;
const ZERO = "0";

/**
 * A function to convert a number to a zero-padded hex string.
 * @param {number} number The number to be converted
 * @param {number} digits The expected length (for zero-padding purposes)
 */
export const toHex = (number: number, digits: number) => {
  return number.toString(HEX).padStart(digits, ZERO);
};

export const rgbaColor = (red: number, green: number, blue: number, alpha = 255) => {
  return `#${toHex(red, 2)}${toHex(green, 2)}${toHex(
    blue,
    2
  )}${toHex(alpha, 2)}`;
};
