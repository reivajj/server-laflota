const axiosInstance = require('../../../config/axiosConfig');

const { get, post } = axiosInstance;

const getAllArtistsFromDashGo = async () => {
  const response = await get('/artists');

  if (!response.data) throw createError(400, 'Error al buscar los Artists');
  return response;
}

const uploadArtistToProvider = async formDataArtist => {
  const response = await post('/artists', formDataArtist, {
    headers: { ...formDataArtist.getHeaders() }
  });

  if (!response.data) throw createError(400, 'Error al subir un artista en DashGo', { dataResponse: response, formData: formDataArtist });
  return response;
}

module.exports = { getAllArtistsFromDashGo, uploadArtistToProvider };