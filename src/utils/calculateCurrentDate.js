/**
 * Calculates current date in format `dd.mm.yyyy`.
 * @returns date string
 */
module.exports = () => {
  const dateObj = new Date();
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  return `${day}.${month}.${year}`;
};
