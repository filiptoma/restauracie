/**
 * Checks if menu line is in format `weekday dd.mm.yyyy`.
 * @param {string} line menu line to check
 * @returns true or false
 */
module.exports = (line) => {
  return /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/.test(
    line.split(' ')[1]
  );
};
