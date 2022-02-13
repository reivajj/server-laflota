const { createFugaTrackAsset } = require('../../models/tracks');
const { createFugaTrackUploadStart } = require('../../models/upload');
const { getAllTracksAssetsFromFuga, uploadTrackAssetToProvider, getTrackAssetByIdFromFuga, uploadTrackFileInAlbumToFuga, updateTrackAssetWithIdFromFuga, getTrackContributorsFromFuga, addContributorToAssetFuga } = require('../../third-party-api/providers/fuga/tracks');
const { getUploadUuid, uploadFile, finishUpload } = require('../../third-party-api/providers/fuga/upload');
const { attachTrackAssetInAlbumWithId } = require('./albums');
const FormData = require('form-data');
const { uploadFileByChunks } = require('../../utils/upload.utils');

const getAllTracks = async () => {
  const response = await getAllTracksAssetsFromFuga();
  return response;
}

const getTrackAssetById = async trackAssetId => {
  const response = await getTrackAssetByIdFromFuga(trackAssetId);
  return response;
}

const createTrackAsset = async (trackAssetMetadata) => {
  const rawDataTrackAsset = createFugaTrackAsset(trackAssetMetadata);
  const response = await uploadTrackAssetToProvider(rawDataTrackAsset);
  return response;
}

const startUploadTrack = async uploadStartMetaData => {
  const rawDataUploadStart = createFugaTrackUploadStart(uploadStartMetaData);
  const response = await getUploadUuid(rawDataUploadStart);
  return response;
}

// const uploadTrack = async (trackFileMetaData, trackFile) => {
//   const formDataTrackWithFile = createFugaTrackFileUpload(trackFileMetaData, trackFile);
//   const response = await uploadFile(formDataTrackWithFile);
//   return response;
// }

const updateTrackAssetWithId = async (trackAssetId, trackAssetMetadataToUpdate) => {
  const rawDataTrackAssetToUpdate = createFugaTrackAsset(trackAssetMetadataToUpdate);
  const response = await updateTrackAssetWithIdFromFuga(trackAssetId, rawDataTrackAssetToUpdate);
  return response;
}

const uploadTrackFileInAlbum = async (trackAssetId, trackAssetType, albumId, trackFile) => {
  const rawDataTrackFileUploadStart = createFugaTrackUploadStart({ id: trackAssetId, type: trackAssetType });
  const responseUploadStart = await getUploadUuid(rawDataTrackFileUploadStart);

  const chunksUploadResponse = await uploadFileByChunks(trackFile, responseUploadStart.data.id, "audio/wave", "wav", "track", uploadTrackFileInAlbumToFuga);
  const responseFinishUpload = await finishUpload(responseUploadStart.data.id, trackFile);

  const responseAttachTrackInAlbum = await attachTrackAssetInAlbumWithId(albumId, trackAssetId);
  return { responseAttachTrackInAlbum, responseFinishUpload };
}

const uploadTrackAssetWithFile = async (trackAssetMetaData, trackFile) => {
  const responseTrackAssetCreated = await createTrackAsset(trackAssetMetaData);
  const { responseFinishUpload, responseAttachTrackInAlbum } = await uploadTrackFileInAlbum(responseTrackAssetCreated.data.id
    , 'audio', trackAssetMetaData.albumId, trackFile);

  return {
    data: {
      result: responseFinishUpload.data, fugaTrackCreatedInfo: responseAttachTrackInAlbum.data
      , albumId: trackAssetMetaData.albumId
    }
  };
}

// =================================CONTRIBUTORS================================\\


const getTrackContributors = async trackAssetId => {
  const response = await getTrackContributorsFromFuga(trackAssetId);
  return response;
}

const addContributorToAsset = async (trackAssetId, rawDataContributor) => {
  const response = await addContributorToAssetFuga(trackAssetId, rawDataContributor)
  return response;
}

module.exports = {
  getAllTracks, getTrackAssetById, createTrackAsset, startUploadTrack,
  uploadTrackAssetWithFile, updateTrackAssetWithId, getTrackContributors, addContributorToAsset,
}