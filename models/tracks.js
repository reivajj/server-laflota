const FormData = require('form-data');

// REVEER: Validar parametros de entrada. No solo retornarlos
const createFugaTrackAsset = trackAssetMetaData => {
  // let rawDataTrackAsset = {};

  return trackAssetMetaData;
}

const createFugaTrackFile = (fileTrackMetaData, trackFile) => {
  const formDataTrackFile = new FormData();
  formDataTrack.append("track", trackFile.buffer, trackFile.originalname);
  return formDataTrackFile;
}

module.exports = { createFugaTrackAsset, createFugaTrackFile };