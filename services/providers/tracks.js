const { createFugaTrackAsset } = require('../../models/tracks');
const { createFugaTrackUploadStart, createFugaTrackFileUpload } = require('../../models/upload');
const { getAllTracksAssetsFromFuga, uploadTrackAssetToProvider, getTrackAssetByIdFromFuga, uploadTrackFileInAlbumToFuga } = require('../../third-party-api/providers/fuga/tracks');
const { getUploadUuid, uploadFile, finishUpload } = require('../../third-party-api/providers/fuga/upload');
const { attachTrackAssetInAlbumWithId } = require('./albums');

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

const uploadTrack = async (trackFileMetaData, trackFile) => {
  const formDataTrackWithFile = createFugaTrackFileUpload(trackFileMetaData, trackFile);
  const response = await uploadFile(formDataTrackWithFile);
  return response;
}

const uploadTrackAssetWithFile = async (trackAssetMetaData, trackFile) => {
  const responseTrackAssetCreated = await createTrackAsset(trackAssetMetaData);
  console.log("Track Asset: ", responseTrackAssetCreated.data);

  const rawDataTrackFileUploadStart = createFugaTrackUploadStart({ id: responseTrackAssetCreated.data.id, type: 'audio' });
  const responseUploadStart = await getUploadUuid(rawDataTrackFileUploadStart);
  console.log("Response upload Start:", responseUploadStart.data);

  const trackFileFormDataWithUploadUuid = createFugaTrackFileUpload(trackFile, responseUploadStart.data.id);
  await uploadTrackFileInAlbumToFuga(trackFileFormDataWithUploadUuid);
  const responseFinishUpload = await finishUpload(responseUploadStart.data.id);

  const responseAttachTrackInAlbum = await attachTrackAssetInAlbumWithId(trackAssetMetaData.albumId, responseTrackAssetCreated.data.id);
  console.log("responseAttachTrackInAlbum: ", responseAttachTrackInAlbum)
  return { data: { result: responseFinishUpload.data, assetId: responseAttachTrackInAlbum.data.id, albumId: trackAssetMetaData.albumId } };
}

module.exports = { getAllTracks, getTrackAssetById, createTrackAsset, startUploadTrack, uploadTrack, uploadTrackAssetWithFile }