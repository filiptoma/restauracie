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
}

const reqUrl = `https://www.menicka.cz/api/iframe/?id=${restaurantId}`;

module.exports = {
  restaurantName,
  reqUrl,
};
