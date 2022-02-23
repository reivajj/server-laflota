const createError = require('http-errors');
const { axiosFugaInstance } = require('../../../config/axiosConfig');
const { artistGetAllError } = require('../../../utils/errors.utils');

const { get, post, put } = axiosFugaInstance;

const getAllArtistsFromFuga = async () => {
  const response = await get('/artists')
    .catch((error) => { throw createError(400, artistGetAllError, { properties: error.response.data }) });
  return response;
}

// const checkIfErrorIsDuplicatedPropIdAndAct = async (errorCreatingArtist, artistName) => {
//   if (errorCreatingArtist.data.code === "DUPLICATE_PERSON_NAME") {
//     const allPersonsWhoInitWithThatName = await getPersonByName(artistName);
//     return { data: allPersonsWhoInitWithThatName.data.person.find(person => person.name.toLowerCase() === artistName.toLowerCase()) };
//   }
//   else throw createError(400, errorCreatingArtist.data.message, { config: { url: "/people" }, response: { data: { unexpectedError: true } } });
// }

// const getArtistsByNameFromFuga = async artistName => {
//   const response = await get(`/artists?name=${artistName}`)
//     .catch(async error => await checkIfErrorIsDuplicatedPropIdAndAct(error.response, rawDataPerson.name))
//   return response;
// }

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
  const response = await axiosFugaInstance.delete(`/artists/${artistId}`);
  return response;
}

//===================================================IDENTIFIERS==============================================\\

const getArtistIdenfierByIdFuga = async artistId => {
  const response = await get(`/artists/${artistId}/identifier`);
  return response;
}

const askForArtistIdentifierDspFuga = async (artistId, rawDataArtist) => {
  console.log("RawdataArtist: ", rawDataArtist);
  const response = await post(`/artists/${artistId}/identifier`, rawDataArtist);
  return response;
}

const editArtistIdentifierDspFuga = async (artistId, rawDataArtist) => {
  const response = await put(`/artists/${artistId}/identifier`, rawDataArtist);
  return response;
}

const deleteArtistIdentifierByBothIdsFuga = async (artistId, identifierId) => {
  const response = await axiosFugaInstance.delete(`/artists/${artistId}/identifier/${identifierId}`);
  return response;
}


module.exports = {
  getAllArtistsFromFuga, getArtistByIdFromFuga, uploadArtistFuga, updateArtistWithIdFuga, deleteArtistWithIdFuga,
  getArtistIdenfierByIdFuga, askForArtistIdentifierDspFuga, editArtistIdentifierDspFuga, deleteArtistIdentifierByBothIdsFuga
};