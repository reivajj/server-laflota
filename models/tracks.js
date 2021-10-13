const FormData = require('form-data');

const createFugaTrackAsset = trackAssetMetaData => {
  let rawDataTrackAsset = {};
  return rawDataTrackAsset;
}

const createFugaTrackFile = (fileTrackMetaData, trackFile) => {
  const formDataTrackFile = new FormData();
  formDataTrack.append("track", trackFile.buffer, trackFile.originalname);
  return formDataTrackFile;
}

module.exports = { createFugaTrackAsset, createFugaTrackFile };