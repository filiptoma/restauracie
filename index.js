const axios = require('axios'); // HTTP requests
const cheerio = require('cheerio'); // HTML parsing
const iconv = require('iconv-lite'); // win1250 to utf-8

const args = process.argv.slice(2);
const restaurantFlag = args[0]; // flags are { cap, veroni, suzies }

let restaurantId; // access to menicka.cz API
let restaurantName;

switch (restaurantFlag) {
  case 'cap':
    restaurantId = 2700;
    restaurantName = 'Pivnice U Čápa';
    break;
  case 'veroni':
    restaurantId = 4921;
    restaurantName = 'VERONI coffee & chocolate';
    break;
  case 'suzies':
    restaurantId = 3830;
    restaurantName = 'Suzies steak pub';
    break;
  default:
    break;
}

/**
 * Gets data from `menicka.cz` API, parses it and returns a daily menu
 * object based on current day.
 * @returns menu object
 */
const getMenu = async () => {
  // unknown restaurant flag
  if (!restaurantId) return undefined;

  const reqUrl = `https://www.menicka.cz/api/iframe/?id=${restaurantId}`;

  try {
    const res = await axios.get(reqUrl, {
      responseType: 'arraybuffer',
      reponseEncoding: 'binary',
    });

    // i had to decode it from binary because win1250 damaged the data
    const htmlData = iconv.decode(Buffer.from(res.data), 'win1250');
    const currentDate = calculateCurrentDate();

    // HTML parsing using `npm cheerio`
    const $ = cheerio.load(htmlData);
    const weekMenu = $('.content h2, .menu').text().split('\n');

    let menu = {
      day: null,
      date: null,
      soups: [],
      meals: [],
    };

    for (let line of weekMenu) {
      // trim redundant whitespace
      line = line.trimStart();
      if (isTitleLine(line)) {
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
          ? menu.meals.push(formatLine(line))
          : menu.soups.push(formatLine(line));
      }
    }
    return menu;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Calculates current date in format `dd.mm.yyyy`.
 * @returns date string
 */
const calculateCurrentDate = () => {
  const dateObj = new Date();
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  return `${day}.${month}.${year}`;
};

/**
 * Checks if char is numeric.
 * @param {string} char char to check
 * @returns true if numeric, false otherwise
 */
const isNumber = (char) => char >= '0' && char <= '9';

/**
 * Checks if line is in format `weekday dd.mm.yyyy`.
 * @param {string} line line to check
 * @returns true or false
 */
const isTitleLine = (line) =>
  /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/.test(
    line.split(' ')[1]
  );

/**
 * Transforms a line from menu to an object form.
 * @param {string} line line
 * @returns line in object form
 */
const formatLine = (line) => {
  const lineArr = line.split(' ');
  const freeMeal = lineArr[lineArr.length - 1] !== 'Kč'; // if meal has a specified price
  return {
    name: freeMeal ? lineArr.join(' ') : lineArr.slice(0, -2).join(' '),
    price: freeMeal ? 0 : lineArr[lineArr.length - 2],
  };
};

/**
 * Prints menu object to a more readable form.
 * @param {*} menu menu object
 */
const printMenu = (menu) => {
  console.log();
  console.log(
    `V ${menu.day}, ${menu.date} je v restauraci "${restaurantName}" menu následovní:`
  );
  console.log('  Polévky:');
  menu.soups.forEach((soup) =>
    console.log(`    ${soup.name} -- ${soup.price} Kč`)
  );
  console.log('  Hlavní jídla:');
  menu.meals.forEach((meal) =>
    console.log(`    ${meal.name} -- ${meal.price} Kč`)
  );
  console.log();
};

/**
 * Main method of this app.
 */
const main = async () => {
  const menu = await getMenu();
  const errMsg = restaurantName
    ? `Pro den ${calculateCurrentDate()} nebylo v restauraci "${restaurantName}" zadáno menu.`
    : 'Restauraci neznám.';
  menu ? printMenu(menu) : console.log(errMsg);
};

main();
