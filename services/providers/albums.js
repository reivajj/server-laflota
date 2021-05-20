const { getAllAlbumsFromDashGo, uploadAlbumToProvider } = require('../../third-party-api/providers/dashgo/albums');
const { createDashGoAlbum } = require('../../models/albums');

const getAllAlbums = async () => {
  const response = await getAllAlbumsFromDashGo();
  return response;
}

const createAlbum = async (albumMetadata, albumCover) => {
  const albumFormData = createDashGoAlbum(albumMetadata, albumCover);
  const response = await uploadAlbumToProvider(albumFormData);
  return response;
}

module.exports = { getAllAlbums, createAlbum };