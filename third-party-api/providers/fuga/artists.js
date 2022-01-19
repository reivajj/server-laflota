const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');
const { artistGetAllError } = require('../../../utils/errors.utils');

const { get, post, put } = axiosInstance;

const getAllArtistsFromFuga = async () => {
  const response = await get('/artists')
    .catch((error) => { throw createError(400, artistGetAllError, { properties: error.response.data }) });
  return response;
}

const getArtistByIdFromFuga = async artistId => {
  const response = await get(`/artists/${artistId}`)
  return response;
}

// const uploadArtistPhotoToArtistFuga = async artistPhotoWithUploadUuid => {
//   const response = await post('/upload', artistPhotoWithUploadUuid, {
//     headers: { ...artistPhotoWithUploadUuid.getHeaders() }
//   })
//     .catch((error) => { throw createError(400, artistPhotoWithUploadUuid, { properties: { message: error.message, formData: artistPhotoWithUploadUuid } }); });
//   return response;
// }

const uploadArtistFuga = async rawDataArtist => {
  const response = await post('/artists', rawDataArtist);
  return response;
}

const updateArtistWithIdFuga = async (artistId, rawDataArtist) => {
  const response = await put(`/artists/${artistId}`, rawDataArtist);
  return response;
}

const deleteArtistWithIdFuga = async (artistId) => {
  const response = await axiosInstance.delete(`/artists/${artistId}`);
  return response;
}

const createArtistIdentifierDspFuga = async (artistId, rawDataArtist) => {
  const response = await post(`/artists/${artistId}/identifier`, rawDataArtist);
  return response;
}



module.exports = {
  getAllArtistsFromFuga, getArtistByIdFromFuga, uploadArtistFuga, updateArtistWithIdFuga, deleteArtistWithIdFuga,
  createArtistIdentifierDspFuga
};