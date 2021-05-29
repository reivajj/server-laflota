const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllTracksFromDashGo = async () => {
  const response = await get('/tracks');

  if (!response.data) throw createError(400, 'Error al buscar los Tracks');
  return response;
}

const uploadTrackToAlbumToProvider = async formDataTrack => {
  const response = await post('/tracks', formDataTrack, {
    headers: { ...formDataTrack.getHeaders() }
  });

  if (!response.data) throw createError(400, 'Error al subir un track al Album en DashGo', { properties: { response, formData: formDataTrack }});
  return response;
}

module.exports = { getAllTracksFromDashGo, uploadTrackToAlbumToProvider };