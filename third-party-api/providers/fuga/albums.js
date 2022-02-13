const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');
const { albumRearrengeError, albumTrackAssetError, albumGetAllError, albumUpdateFieldsError, albumDeleteError } = require('../../../utils/errors.utils');

const { get, post, put } = axiosInstance;

const getAllAlbumsFromFuga = async () => {
  const response = await get('/products')
    .catch((error) => { throw createError(400, albumGetAllError, { properties: error.response.data }) });
  return response;
}

const getAlbumByIdFromFuga = async albumId => {
  const response = await get(`/products/${albumId}`);
  return response;
}

const uploadAlbumToProvider = async rawDataAlbum => {
  const response = await post('/products', rawDataAlbum)
  return response;
}

const attachTrackAssetInAlbumFuga = async (albumId, trackId) => {
  const response = await put(`/products/${albumId}/assets/${trackId}`)
    .catch((error) => { throw createError(400, albumTrackAssetError, { properties: { message: error.message, formData: trackId, error } }); });
  return response;
}

const uploadCoverInAlbumToFuga = async formDataCover => {
  const response = await post('/upload', formDataCover, {
    headers: { ...formDataCover.getHeaders() }
  }).catch(error => error);
  return response;
}

const changeTrackPositionInAlbumInFUGA = async (albumId, trackId, newPosition) => {
  const response = await put(`/products/${albumId}/assets/${trackId}/position/${newPosition}`)
    .catch((error) => {
      throw createError(400, albumRearrengeError,
        { properties: { message: error.message, formData: { albumId, trackId, newPosition } } });
    })
  return response;
}

const updateAlbumWithIdInFuga = async (albumId, newFieldsValues) => {
  const response = await put(`/products/${albumId}`, newFieldsValues)
    .catch((error) => {
      throw createError(400, albumUpdateFieldsError, { properties: { error, formData: newFieldsValues } });
    })
  return response;
}

const deleteAlbumAndAssetsWithIdFromFuga = async (albumId, deleteAllAssetsBoolean) => {
  const response = await axiosInstance.delete(`/products/${albumId}?delete_assets=${deleteAllAssetsBoolean}`)
    .catch((error) => { throw createError(404, albumDeleteError, { properties: { message: error.message, albumId } }) });
  return response;
}

const generateUPCAlbumWithIdInFuga = async albumId => {
  const response = await post(`/products/${albumId}/barcode`);
  return response;
}

const publishAlbumWithIdInFuga = async albumId => {
  const response = await post(`/products/${albumId}/publish`);  
  return response;
}

module.exports = {
  getAllAlbumsFromFuga, uploadAlbumToProvider, getAlbumByIdFromFuga, attachTrackAssetInAlbumFuga,
  uploadCoverInAlbumToFuga, changeTrackPositionInAlbumInFUGA, publishAlbumWithIdInFuga, updateAlbumWithIdInFuga,
  deleteAlbumAndAssetsWithIdFromFuga, generateUPCAlbumWithIdInFuga
};