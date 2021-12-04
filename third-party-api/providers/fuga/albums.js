const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post, put } = axiosInstance;

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
  console.log("Entro a uploadAlbumToProvider: ", rawDataAlbum);
  const response = await post('/products', rawDataAlbum);
  console.log("Response en uploadAlbum: ", response)
  if (!response.data) throw createError(400, 'Error al subir un album en FUGA', { properties: { response, formData: rawDataAlbum } });
  console.log("TODO OK en uploadAlbum: ", response);
  return response;
}

const attachTrackAssetInAlbumFuga = async (albumId, trackId) => {
  const response = await put(`products/${albumId}/assets/${trackId}`);

  if (!response.data) throw createError(400, `Error to attach an asset to the Album with Id: ${albumId}`, { properties: { response, formData: rawDataTrackAsset } });
  return response;
}

const uploadCoverInAlbumToFuga = async formDataCover => {
  const response = await post('/upload', formDataCover, {
    headers: { ...formDataCover.getHeaders() }
  })

  if (!response.data.success) throw createError(400, `Error to upload a Cover Image to an album`, { properties: { response, formData: formDataCover } });
  return response;
}

const changeTrackPositionInAlbumInFUGA = async (albumId, trackId, newPosition) => {
  const response = await put(`products/${albumId}/assets/${trackId}/position/${newPosition}`);
  
  if (!response.data.id) throw createError(400, `Error to update position of trackId: ${trackId} in album with id: ${albumId}`
    , { properties: { response, formData: { albumId, trackId, newPosition } } });
  
    return response;
}

module.exports = {
  getAllAlbumsFromFuga, uploadAlbumToProvider, getAlbumByIdFromFuga, attachTrackAssetInAlbumFuga
  , uploadCoverInAlbumToFuga, changeTrackPositionInAlbumInFUGA
};