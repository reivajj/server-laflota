const { createDashGoTrack } = require('../../models/tracks');
// import { createDashGoTrack } from '../../models/tracks.js';
const { getAllTracksFromDashGo, uploadTrackToAlbumToProvider } = require('../../third-party-api/providers/dashgo/tracks');

const getAllTracks = async () => {
  const response = await getAllTracksFromDashGo();
  return response;
}

const createTrackForAlbum = async (trackMetadata, trackFile) => {
  const trackFormData = createDashGoTrack(trackMetadata, trackFile);
  const response = await uploadTrackToAlbumToProvider(trackFormData);
  return response;
}

module.exports = { getAllTracks, createTrackForAlbum }