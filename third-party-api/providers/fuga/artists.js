const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllArtistsFromFuga = async () => {
  const response = await get('/artists');

  if (!response.data) throw createError(400, 'Error al pedir los Artistas', { properties: response });
  return response;
}

const uploadArtistToProvider = async rawDataArtist => {
  const response = await post('/artists', rawDataArtist);

  if (!response.data.id) throw createError(400, 'Error al subir un artista en DashGo', { properties: { response, formData: rawDataArtist } });
  return response;
}

module.exports = { getAllArtistsFromFuga, uploadArtistToProvider };