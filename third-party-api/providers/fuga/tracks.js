const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllTracksAssetsFromFuga = async () => {
  const response = await get('/assets');

  if (!response.data) throw createError(400, 'Error getting the tracks assets', { properties: response });
  return response;
}

const getTrackAssetByIdFromFuga = async trackAssetId => {
  const response = await get(`/assets/${trackAssetId}`);

  if (!response.data) throw createError(400, `Error getting the track asset with ID: ${trackAssetId}`, { properties: response });
  return response;
}

const uploadTrackAssetToProvider = async rawDataTrackAsset => {
  const response = await post('/assets', rawDataTrackAsset);

  if (!response.data.id) throw createError(400, 'Error uploading the track asset', { properties: { response, formData: rawDataTrackAsset } });
  return response;
}

module.exports = { getAllTracksAssetsFromFuga, getTrackAssetByIdFromFuga, uploadTrackAssetToProvider };