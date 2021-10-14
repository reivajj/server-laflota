const { getAllAlbumsFromDashGo, uploadAlbumToProvider } = require('../../third-party-api/providers/dashgo/albums');
const createDashGoAlbum = require('../../models/albums');
const Logger = require("../../loaders/logger");

const getAllAlbums = async () => {
  const response = await getAllAlbumsFromDashGo();
  return response;
}

const createAlbum = async (albumMetadata, albumCover) => {
  console.log("Parametros que llegan al BE: ", albumMetadata);
  console.log("Cover que llega al BE: ", albumCover);
  const albumFormData = createDashGoAlbum(albumMetadata, albumCover);
  const response = await uploadAlbumToProvider(albumFormData);
  return response;
}

module.exports = { getAllAlbums, createAlbum };