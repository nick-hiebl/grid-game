const HEX = 16;
const ZERO = "0";

/**
 * A function to convert a number to a zero-padded hex string.
 * @param {*} number The number to be converted
 * @param {*} digits The expected length (for zero-padding purposes)
 */
export const toHex = (number, digits) => {
  return number.toString(HEX).padStart(digits, ZERO);
};
