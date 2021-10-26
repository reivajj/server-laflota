const { uploadAlbumToProvider, getAllAlbumsFromFuga, getAlbumByIdFromFuga, uploadTrackAssetInAlbumToFuga, uploadCoverInAlbumToFuga } = require('../../third-party-api/providers/fuga/albums');
const createFugaAlbum = require('../../models/albums');
const { createFugaTrackAsset } = require('../../models/tracks');
const { getUploadUuid, finishUpload } = require('../../third-party-api/providers/fuga/upload');
const { createFugaCoverUploadStart, createFugaCoverUpload } = require('../../models/upload');

const getAllAlbums = async () => {
  const response = await getAllAlbumsFromFuga();
  return response;
}

const getAlbumById = async albumId => {
  const response = await getAlbumByIdFromFuga(albumId);
  return response;
}

const createAlbum = async albumMetaData => {
  const rawDataAlbum = createFugaAlbum(albumMetaData);
  const response = await uploadAlbumToProvider(rawDataAlbum);

  return response;
}

const createTrackAssetInAlbumWithId = async (trackAssetMetaData, albumId) => {
  const rawDataTrackAsset = createFugaTrackAsset(trackAssetMetaData);
  const response = await uploadTrackAssetInAlbumToFuga(rawDataTrackAsset, albumId);

  return response;
}

const createCoverImageInAlbum = async (coverFormDataToUpload, coverFile) => {
  const rawDataCoverUploadStart = createFugaCoverUploadStart(coverFormDataToUpload);
  const responseUploadStart = await getUploadUuid(rawDataCoverUploadStart);
  console.log("Response upload Start:", responseUploadStart.data);
  
  const coverFormDataWithUploadUuid = createFugaCoverUpload(coverFile, responseUploadStart.data.id);
  await uploadCoverInAlbumToFuga(coverFormDataWithUploadUuid);
  
  const responseUploadFinish = finishUpload(responseUploadStart.data.id);
  return responseUploadFinish;
}

module.exports = { getAllAlbums, getAlbumById, createAlbum, createTrackAssetInAlbumWithId, createCoverImageInAlbum };