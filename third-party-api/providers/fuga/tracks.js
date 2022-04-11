const createError = require('http-errors');
const { axiosFugaInstance } = require('../../../config/axiosConfig');

const { get, post, put } = axiosFugaInstance;

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

// Agregar un buen HANDLING DE ERRORES: que escriba al CLOUD!
const uploadTrackFileInAlbumToFuga = async formDataTrackFileUpload => {
  const response = await post('/upload', formDataTrackFileUpload, {
    headers: formDataTrackFileUpload.getHeaders()
  }).catch(error => console.log("ERROR: ", error));

  if (!response || !response.data || !response.data.success) throw createError(400, `Error to upload a Track to an album`, { properties: { response, formData: formDataTrackFileUpload } });
  return response;
}

const updateTrackAssetWithIdFromFuga = async (trackAssetId, rawDataTrackToUpdate) => {
  const response = await put(`/assets/${trackAssetId}`, rawDataTrackToUpdate);
  return response;
}

// =================================CONTRIBUTORS================================\\

const getTrackContributorsFromFuga = async trackAssetId => {
  const response = await get(`/assets/${trackAssetId}/contributors`);
  return response;
}

const addContributorToAssetFuga = async (trackAssetId, rawDataContributor) => {
  if (!rawDataContributor.person) return { data: "ERROR" };
  const response = await post(`/assets/${trackAssetId}/contributors`, rawDataContributor);
  return response;
}

module.exports = {
  getAllTracksAssetsFromFuga, getTrackAssetByIdFromFuga, uploadTrackAssetToProvider,
  uploadTrackFileInAlbumToFuga, updateTrackAssetWithIdFromFuga, getTrackContributorsFromFuga,
  addContributorToAssetFuga
};