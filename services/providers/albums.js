const { uploadAlbumToProvider, getAllAlbumsFromFuga, getAlbumByIdFromFuga, uploadTrackAssetInAlbumToFuga } = require('../../third-party-api/providers/fuga/albums');
const createFugaAlbum = require('../../models/albums');
const { createFugaTrackAsset } = require('../../models/tracks');

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

module.exports = { getAllAlbums, getAlbumById, createAlbum, createTrackAssetInAlbumWithId };