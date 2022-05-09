const { createFugaTrackAsset } = require('../../models/tracks');
const { createFugaTrackUploadStart } = require('../../models/upload');
const { getAllTracksAssetsFromFuga, uploadTrackAssetToProvider, getTrackAssetByIdFromFuga, uploadTrackFileInAlbumToFuga,
  updateTrackAssetWithIdFromFuga, getTrackContributorsFromFuga, addContributorToAssetFuga } = require('../../third-party-api/providers/fuga/tracks');
const { getUploadUuid, finishUpload } = require('../../third-party-api/providers/fuga/upload');
const { uploadFileByChunks } = require('../../utils/upload.utils');
const { attachTrackAssetInAlbumWithId } = require('./albums');

const getAllTracks = async () => {
  const response = await getAllTracksAssetsFromFuga();
  return response;
}

const getTrackAssetById = async trackAssetId => {
  const response = await getTrackAssetByIdFromFuga(trackAssetId);
  return response;
}

const createTrackAsset = async trackAssetMetadata => {
  const rawDataTrackAsset = createFugaTrackAsset(trackAssetMetadata);
  const response = await uploadTrackAssetToProvider(rawDataTrackAsset);
  return response;
}

const createTrackAssetNew = async trackAssetMetadata => {
  const rawDataTrackAsset = createFugaTrackAsset(trackAssetMetadata);
  const responseAsset = await uploadTrackAssetToProvider(rawDataTrackAsset);
  const response = await attachTrackAssetInAlbumWithId(trackAssetMetadata.albumId, responseAsset.data.id);
  return { data: { fugaTrackCreatedInfo: response.data, albumId: trackAssetMetadata.albumId } };
}

const uploadTrackFileInAssetNew = async (trackAssetId, trackFile) => {
  const rawDataTrackFileUploadStart = createFugaTrackUploadStart({ id: trackAssetId });
  const responseUploadStart = await getUploadUuid(rawDataTrackFileUploadStart);

  const chunksUploadResponse = await uploadFileByChunks(trackFile, responseUploadStart.data.id, "audio/wave", "wav", "track", uploadTrackFileInAlbumToFuga);
  const responseFinishUpload = await finishUpload(responseUploadStart.data.id, trackFile);

  return { data: responseFinishUpload.data };
}

const uploadTrackFileInAlbum = async (trackAssetId, trackAssetType, trackFile) => {
  const rawDataTrackFileUploadStart = createFugaTrackUploadStart({ id: trackAssetId, type: trackAssetType });
  const responseUploadStart = await getUploadUuid(rawDataTrackFileUploadStart);

  const chunksUploadResponse = await uploadFileByChunks(trackFile, responseUploadStart.data.id, "audio/wave", "wav", "track", uploadTrackFileInAlbumToFuga);
  const responseFinishUpload = await finishUpload(responseUploadStart.data.id, trackFile);

  return { responseFinishUpload };
}

const uploadTrackAssetWithFile = async (trackAssetMetaData, trackFile) => {
  const responseTrackAssetCreated = await createTrackAsset(trackAssetMetaData);
  const { responseFinishUpload } = await uploadTrackFileInAlbum(responseTrackAssetCreated.data.id, 'audio', trackFile);

  return {
    data: {
      result: responseFinishUpload.data, fugaTrackCreatedInfo: responseTrackAssetCreated.data
      , albumId: trackAssetMetaData.albumId
    }
  };
}

const updateTrackAssetWithId = async (trackAssetId, trackAssetMetadataToUpdate) => {
  const rawDataTrackAssetToUpdate = createFugaTrackAsset(trackAssetMetadataToUpdate);
  const response = await updateTrackAssetWithIdFromFuga(trackAssetId, rawDataTrackAssetToUpdate);
  return response;
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
  getAllTracks, getTrackAssetById, createTrackAsset, uploadTrackAssetWithFile,
  updateTrackAssetWithId, getTrackContributors, addContributorToAsset, createTrackAssetNew,
  uploadTrackFileInAssetNew,
}