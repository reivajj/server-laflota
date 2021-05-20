
import { createDashGoTrack } from '../../models/tracks.js';
import { getAllTracksFromDashGo, uploadTrackToAlbumToProvider } from '../../third-party-api/providers/dashgo/tracks.js';

export const getAllTracks = async () => {
  const response = await getAllTracksFromDashGo();
  return response;
}

export const createTrackForAlbum = async (trackMetadata, trackFile) => {
  const trackFormData = createDashGoTrack(trackMetadata, trackFile);
  const response = await uploadTrackToAlbumToProvider(trackFormData);
  return response;
}