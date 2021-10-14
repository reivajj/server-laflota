const { createFugaTrackAsset } = require('../../models/tracks');
const { createFugaTrackStartUpload, createFugaTrackFileUpload } = require('../../models/upload');
const { getAllTracksAssetsFromFuga, uploadTrackAssetToProvider, getTrackAssetByIdFromFuga } = require('../../third-party-api/providers/fuga/tracks');
const { getUploadUuid, uploadFile } = require('../../third-party-api/providers/fuga/upload');

const getAllTracks = async () => {
  const response = await getAllTracksAssetsFromFuga();
  return response;
}

const getTrackAssetById = async trackAssetId => {
  const response = await getTrackAssetByIdFromFuga(trackAssetId);
  return response;
}

const createTrackAsset = async (trackAssetMetadata, trackFile) => {
  const rawDataTrackAsset = createFugaTrackAsset(trackAssetMetadata);
  const response = await uploadTrackAssetToProvider(rawDataTrackAsset);
  return response;
}

const startUploadTrack = async uploadStartMetaData => {
  const rawDataUploadStart = createFugaTrackStartUpload(uploadStartMetaData);
  const response = await getUploadUuid(rawDataUploadStart);
  return response;
}

const uploadTrack = async (trackFileMetaData, trackFile) => {
  const formDataTrackWithFile = createFugaTrackFileUpload(trackFileMetaData, trackFile);
  const response = await uploadFile(formDataTrackWithFile);
  return response;
}

module.exports = { getAllTracks, getTrackAssetById, createTrackAsset, startUploadTrack, uploadTrack }