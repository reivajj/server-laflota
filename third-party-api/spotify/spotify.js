const createHttpError = require('http-errors');
const { axiosSpotifyInstance } = require('../../config/axiosConfig');

const { get, post } = axiosSpotifyInstance;

const getArtistByIdSpotify = async artistId => {
  const response = await get(`/artists/${artistId}`);
  console.log("RESPONSE SPO: ", response);
  // if (!response.data) throw createHttpError(400, 'Error al buscar los Labels', { properties: response });
  return response;
}

module.exports = { getArtistByIdSpotify }

