const createDashGoTrack = require('../../models/tracks');
const { getAllTracksFromDashGo, uploadTrackToAlbumToProvider } = require('../../third-party-api/providers/dashgo/tracks');

const getAllTracks = async () => {
  const response = await getAllTracksFromDashGo();
  return response;
}

const createTrackForAlbum = async (trackMetadata, trackFile) => {
  console.log("Parametros que llegan al BE: ", trackMetadata);
  console.log("Cover que llega al BE: ", trackFile);
  const trackFormData = createDashGoTrack(trackMetadata, trackFile);
  const response = await uploadTrackToAlbumToProvider(trackFormData);
  return response;
}

module.exports = { getAllTracks, createTrackForAlbum }