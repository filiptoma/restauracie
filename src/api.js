const { reqUrl } = require('./config');

const axios = require('axios'); // HTTP requests

/**
 * Gets data from menicka.cz as a GET request.
 * @returns data
 */
module.exports.menickaGet = async () => {
  return await axios.get(reqUrl, {
    responseType: 'arraybuffer',
    reponseEncoding: 'binary',
  });
};
