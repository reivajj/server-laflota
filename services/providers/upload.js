const createFugaTrack = require('../../models/tracks');
const createFugaUpload = require('../../models/upload');
const getUploadUuid = require('../../third-party-api/providers/fuga/upload');

const startUploadFile = async uploadMetaData => {
  const rawDataUpload = createFugaUpload(uploadMetaData);
  const response = await getUploadUuid(rawDataUpload);
  return response;
}

// const createTrackForAlbum = async (trackMetadata, trackFile) => {
//   const trackFormData = createFugaTrack(trackMetadata, trackFile);
//   const response = await uploadTrackToAlbumToProvider(trackFormData);
//   return response;
// }

module.exports = startUploadFile;