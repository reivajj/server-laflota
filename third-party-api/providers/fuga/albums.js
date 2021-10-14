const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllAlbumsFromFuga = async () => {
  const response = await get('/products');

  if (!response.data) throw createError(400, 'Error al buscar los albums', { properties: response });
  return response;
}

const getAlbumByIdFromFuga = async albumId => {
  const response = await get(`/products/${albumId}`);

  if (!response.data) throw createError(400, 'Error al buscar el album con ID', { id: albumId, properties: response });
  return response;
}

const uploadAlbumToProvider = async rawDataAlbum => {
  const response = await post('/products', rawDataAlbum);

  if (!response.data) throw createError(400, 'Error al subir un album en FUGA', { properties: { response, formData: rawDataAlbum } });
  return response;
}

const uploadTrackAssetInAlbumToFuga = async (rawDataTrackAsset, albumId) => {
  const response = await post(`products/${albumId}/assets`, rawDataTrackAsset);

  if (!response.data) throw createError(400, `Error to upload an asset to the Album with Id: ${albumId}` , { properties: { response, formData: rawDataTrackAsset } });
  return response;
}

module.exports = { getAllAlbumsFromFuga, uploadAlbumToProvider, getAlbumByIdFromFuga, uploadTrackAssetInAlbumToFuga };