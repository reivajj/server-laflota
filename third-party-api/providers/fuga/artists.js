const axiosFugaInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosFugaInstance;

const getAllArtistsFromFuga = async () => {
  const response = await get('/artists');

  if (!response.data) throw createError(400, 'Error al buscar los Artists');
  return response;
}

// const uploadArtistToProvider = async formDataArtist => {
//   const response = await post('/artists', formDataArtist, {
//     headers: { ...formDataArtist.getHeaders() }
//   });

//   if (!response.data) throw createError(400, 'Error al subir un artista en DashGo', { properties: { response, formData: formDataArtist } });
//   return response;
// }

// module.exports = { getAllArtistsFromDashGo, uploadArtistToProvider };
module.exports = getAllArtistsFromFuga;