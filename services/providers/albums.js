const { uploadAlbumToProvider, getAllAlbumsFromFuga, getAlbumByIdFromFuga, attachTrackAssetInAlbumFuga,
  uploadCoverInAlbumToFuga, changeTrackPositionInAlbumInFUGA } = require('../../third-party-api/providers/fuga/albums');
const { getUploadUuid, finishUpload } = require('../../third-party-api/providers/fuga/upload');
const { createFugaCoverUploadStart, createFugaCoverUpload } = require('../../models/upload');
const { createFugaAlbumFromFormData } = require('../../models/albums');

const getAllAlbums = async () => {
  const response = await getAllAlbumsFromFuga();
  return response;
}

const getAlbumById = async albumId => {
  const response = await getAlbumByIdFromFuga(albumId);
  return response;
}

const createAlbumAsset = async albumFormData => {
  const rawDataAlbum = createFugaAlbumFromFormData(albumFormData);
  const response = await uploadAlbumToProvider(rawDataAlbum);
  return response;
}

const attachTrackAssetInAlbumWithId = async (albumId, trackId) => {
  const response = await attachTrackAssetInAlbumFuga(albumId, trackId);
  return response;
}

const createCoverImageInAlbum = async (coverFormDataToUpload, coverFile) => {
  const rawDataCoverUploadStart = createFugaCoverUploadStart(coverFormDataToUpload);
  const responseUploadStart = await getUploadUuid(rawDataCoverUploadStart);

  const coverFormDataWithUploadUuid = createFugaCoverUpload(coverFile, responseUploadStart.data.id);
  await uploadCoverInAlbumToFuga(coverFormDataWithUploadUuid);

  const responseUploadAlbumCoverFinish = finishUpload(responseUploadStart.data.id);
  return responseUploadAlbumCoverFinish;
}

const uploadAlbumAssetWithCover = async (albumAssetMetaData, coverFile) => {
  const responseCreateAlbumAsset = await createAlbumAsset(albumAssetMetaData);
  const responseUploadAlbumCoverFinish = await createCoverImageInAlbum({
    type: albumAssetMetaData.typeCover, id: responseCreateAlbumAsset.data.cover_image.id
  }, coverFile);

  return { data: { result: responseUploadAlbumCoverFinish.data, albumId: responseCreateAlbumAsset.data.id } };
}

const changeTrackPositionInAlbum = async (albumId, trackId, newPosition) => {
  const response = await changeTrackPositionInAlbumInFUGA(albumId, trackId, newPosition);
  return response;
}

const changeMultipleTracksPositionsInAlbum = async (albumId, rearrengeInstructionInBody) => {
  const rearrengeFunction = rearrengeInstructionInBody.rearrengeInstructions.map(async instruction => {
    const responseIndividual = await changeTrackPositionInAlbumInFUGA(albumId, instruction.trackId, instruction.newPosition);
    return { trackId: instruction.trackId, success: responseIndividual.status === 200 };
  });

  return Promise.all(rearrengeFunction).then(result => result).catch(error => console.log(error));
}

module.exports = {
  getAllAlbums, getAlbumById, createAlbumAsset, attachTrackAssetInAlbumWithId,
  createCoverImageInAlbum, uploadAlbumAssetWithCover, changeTrackPositionInAlbum,
  changeMultipleTracksPositionsInAlbum
};