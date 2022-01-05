const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post, put } = axiosInstance;

const getAllArtistsFromFuga = async () => {
  const response = await get('/artists');

  if (!response.data) throw createError(400, 'Error al pedir los Artistas', { properties: response });
  return response;
}

const getArtistByIdFromFuga = async artistId => {
  const response = await get(`/artists/${artistId}`);

  if (!response.data.id) throw createError(400, `Error getting the artist with ID: ${artistId}`, { properties: response });
  return response;
}

// const uploadArtistPhotoToArtistFuga = async artistPhotoWithUploadUuid => {
//   const response = await post('/upload', artistPhotoWithUploadUuid)
//     .catch((error) => { throw createError(400, artistPhotoWithUploadUuid, { properties: { message: error.message, formData: artistPhotoWithUploadUuid } }); });
//   return response;
// }

const uploadArtistFuga = async rawDataArtist => {
  console.log("ARTIST IN FUGA:", rawDataArtist)
  const response = await post('/artists', rawDataArtist);

  if (!response.data.id) throw createError(400, 'Error uploading artist in FUGA', { properties: { response, formData: rawDataArtist } });
  return response;
}

const updateArtistWithIdFuga = async (artistId, rawDataArtist) => {
  const response = await put(`/artists/${artistId}`, rawDataArtist);

  if (!response.data.id) throw createError(400, 'Error updating an artist in FUGA', { properties: { response, formData: rawDataArtist } });
  return response;
}


module.exports = { getAllArtistsFromFuga, getArtistByIdFromFuga, uploadArtistFuga, updateArtistWithIdFuga };