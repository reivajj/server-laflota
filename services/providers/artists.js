const { uploadArtistFuga, getArtistByIdFromFuga, getAllArtistsFromFuga, updateArtistWithIdFuga } = require('../../third-party-api/providers/fuga/artists');
const createFugaArtist = require('../../models/artists');

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

module.exports = { getAllArtists, getArtistById, updateArtistWithId, createArtist };