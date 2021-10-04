/**
 * Transforms a menu line to an object form.
 * @param {string} line menu line to transform
 * @returns menu line in an object form
 */
module.exports = (line) => {
  const lineArr = line.split(' ');
  const freeMeal = lineArr[lineArr.length - 1] !== 'Kč'; // if meal has a specified price
  return {
    name: freeMeal ? lineArr.join(' ') : lineArr.slice(0, -2).join(' '),
    price: freeMeal ? 0 : lineArr[lineArr.length - 2],
  };
};
