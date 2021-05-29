const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllAlbumsFromDashGo = async () => {
  const response = await get('/albums');

  if (!response.data) throw createError(400, 'Error al buscar los Albums');
  return response;
}

const uploadAlbumToProvider = async formDataAlbum => {
  const response = await post('/albums', formDataAlbum, {
    headers: { ...formDataAlbum.getHeaders() }
  });

  if (!response.data) throw createError(400, 'Error al subir un Album en DashGo', { properties: response });
  return response;
}

module.exports = { getAllAlbumsFromDashGo, uploadAlbumToProvider };