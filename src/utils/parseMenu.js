const isNumber = require('./isNumber');
const isTitleMenuLine = require('./isTitleMenuLine');
const formatMenuLine = require('./formatMenuLine');
const calculateCurrentDate = require('./calculateCurrentDate');

/**
 * Parses week menu string consisting of menu lines into new menu object.
 * @param {string} weekMenu week menu string
 * @returns menu object
 */
module.exports = (weekMenu) => {
  let menu = {
    day: null,
    date: null,
    soups: [],
    meals: [],
  };
  const currentDate = calculateCurrentDate();

  for (let line of weekMenu) {
    // trim redundant whitespace
    line = line.trimStart();
    if (isTitleMenuLine(line)) {
      if (menu.day) break;
      const title = line.split(' '); // title is [ day, date ]
      if (title[1] === currentDate) {
        menu.day = title[0];
        menu.date = currentDate;
      }
    } else if (menu.day) {
      if (line === 'Pro tento den nebylo zadáno menu.') return undefined;
      // meals always start with a number
      isNumber(line.charAt(0))
        ? menu.meals.push(formatMenuLine(line))
        : menu.soups.push(formatMenuLine(line));
    }
  }

  return menu;
};
