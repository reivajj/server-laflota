import { getAllAlbumsFromDashGo, uploadAlbumToProvider } from "../../third-party-api/providers/dashgo/albums.js";
import { createDashGoAlbum } from '../../models/albums.js';

export const getAllAlbums = async () => {
  const response = await getAllAlbumsFromDashGo();
  return response;
}

export const createAlbum = async (albumMetadata, albumCover) => {
  const albumFormData = createDashGoAlbum(albumMetadata, albumCover);
  const response = await uploadAlbumToProvider(albumFormData);
  return response;
}
