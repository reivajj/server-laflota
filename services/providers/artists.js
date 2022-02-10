const { uploadArtistFuga, getArtistByIdFromFuga, getAllArtistsFromFuga, updateArtistWithIdFuga,
  deleteArtistWithIdFuga, createArtistIdentifierDspFuga, getArtistIdenfierByIdFuga, askForArtistIdentifierDspFuga
  , editArtistIdentifierDspFuga,
  deleteArtistIdentifierByBothIdsFuga } = require('../../third-party-api/providers/fuga/artists');
const { createFugaArtist, createFugaIdentifierArtist } = require('../../models/artists');

const getAllArtists = async () => {
  const response = await getAllArtistsFromFuga();
  return response;
}

const getArtistById = async artistId => {
  const response = await getArtistByIdFromFuga(artistId);
  return response;
}

// CREATE ARTIST NO DEVUELVE EL PHOTO OBJECT...
// const uploadPhotoInArtist = async (artistPhotoMetaDataUpload, artistPhoto) => {
//   // const rawDataCoverUploadStart = createFugaCoverUploadStart(artistPhotoMetaDataUpload);
//   const responseUploadStart = await getUploadUuid(artistPhotoMetaDataUpload);

//   const artistPhotoWithUploadUuid = createFugaCoverUpload(artistPhoto, responseUploadStart.data.id);
//   await uploadArtistPhotoToArtistFuga(artistPhotoWithUploadUuid);

//   const responseUploadArtistPhotoFinish = finishUpload(responseUploadStart.data.id);
//   return responseUploadArtistPhotoFinish;
// }

// const uploadArtistWithPhoto = async (artistMetadata, artistPhoto) => {
//   const artistFormData = createFugaArtist(artistMetadata);
//   const responseUplaodArtist = await uploadArtistFuga(artistFormData);
//   console.log("RESPONSE UPLOAD:", responseUplaodArtist.data);
//   const responseUploadArtistPhotoFinish = await uploadPhotoInArtist({
//     type: "image_artist_art", id: responseUplaodArtist.data.photo.id
//   }, artistPhoto);
//   console.log("RESPONSE FINISH: ", responseUploadArtistPhotoFinish);
//   return responseUploadArtistPhotoFinish;
// }

const createArtist = async artistMetadata => {
  const artistRawData = createFugaArtist(artistMetadata);
  const response = await uploadArtistFuga(artistRawData);
  return response;
}

const updateArtistWithId = async (artistId, artistMetadata) => {
  const rawDataArtist = createFugaArtist(artistMetadata);
  const response = await updateArtistWithIdFuga(artistId, rawDataArtist);
  return response;
}

const deleteArtistWithId = async (artistId) => {
  const response = await deleteArtistWithIdFuga(artistId);
  return response;
}


//====================================================IDENTIFIERS====================================================\\

const getArtistIdentifierById = async artistId => {
  const responseGetIdentifiers = await getArtistIdenfierByIdFuga(artistId);
  return responseGetIdentifiers;
}

const createArtistIdentifierDsp = async (artistId, identifierField, identifierValue, name) => {
  const rawDataArtistIdentifier = createFugaIdentifierArtist(identifierField, identifierValue, name);
  response = await askForArtistIdentifierDspFuga(artistId, rawDataArtistIdentifier)
  return response;
}

const editArtistIdentifierDsp = async (artistId, identifierField, identifierValue, name) => {
  const rawDataArtistIdentifier = createFugaIdentifierArtist(identifierField, identifierValue, name);
  let response = await editArtistIdentifierDspFuga(artistId, rawDataArtistIdentifier);
  return response;
}

const createArtistWithIdentifiersDsp = async artistMetaData => {
  const createArtistResponse = await createArtist(artistMetaData);
  const responseSpotifyUri = await createArtistIdentifierDsp(createArtistResponse.data.id, "spotify_uri", artistMetaData.spotify_uri, artistMetaData.name);
  const resposneAppleId = await createArtistIdentifierDsp(createArtistResponse.data.id, "apple_id", artistMetaData.apple_id, artistMetaData.name);
  return { data: { ...createArtistResponse.data, spotifyIdentifierIdFuga: responseSpotifyUri.data.id, appleIdentifierIdFuga: resposneAppleId.data.id } };
}

const deleteArtistIdentifierByBothIds = async (artistId, identifierId) => {
  const responseDelete = deleteArtistIdentifierByBothIdsFuga(artistId, identifierId);
  return responseDelete;
}

module.exports = {
  getAllArtists, getArtistById, updateArtistWithId, createArtist, deleteArtistWithId,
  createArtistIdentifierDsp, createArtistWithIdentifiersDsp, getArtistIdentifierById,
  deleteArtistIdentifierByBothIds, editArtistIdentifierDsp
};