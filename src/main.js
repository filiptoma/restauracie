const cheerio = require('cheerio'); // HTML parsing
const iconv = require('iconv-lite'); // win1250 to utf-8

// helper methods
const parseMenu = require('./utils/parseMenu');
const printMenu = require('./utils/printMenu');
const calculateCurrentDate = require('./utils/calculateCurrentDate');

const { restaurantName } = require('./config');
const { menickaGet } = require('./api');

/**
 * Gets data from `menicka.cz` API, parses it and returns a daily menu
 * object based on current day.
 * @returns menu object
 */
const getMenu = async () => {
  // unknown restaurant flag
  if (!restaurantName) return undefined;

  try {
    const res = await menickaGet();

    // i had to decode it from binary because win1250 damaged the data
    const htmlData = iconv.decode(Buffer.from(res.data), 'win1250');

    // HTML parsing using `npm cheerio`
    const $ = cheerio.load(htmlData);
    const weekMenu = $('.content h2, .menu').text().split('\n');
    // parse menu string into menu object
    return parseMenu(weekMenu);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Main method of this app.
 */
module.exports = async () => {
  const menu = await getMenu();
  const errMsg = restaurantName
    ? `Pro den ${calculateCurrentDate()} nebylo v restauraci "${restaurantName}" zadáno menu.`
    : 'Restauraci neznám.';
  menu ? printMenu(menu, restaurantName) : console.error(errMsg);
};
