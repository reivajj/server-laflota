const FormData = require('form-data');

// REVEER: Validar parametros de entrada. No solo retornarlos
const createFugaTrackAsset = trackAssetMetaData => {
  console.log("Track asset meta in models: ", trackAssetMetaData);
  let rawDataTrackAsset = {};
  rawDataTrackAsset.name = trackAssetMetaData.name;
  rawDataTrackAsset.genre = trackAssetMetaData.genre;
  rawDataTrackAsset.artists = JSON.parse(trackAssetMetaData.artists);
  rawDataTrackAsset.sequence = trackAssetMetaData.sequence;

  return rawDataTrackAsset;
}

const createFugaTrackFile = (fileTrackMetaData, trackFile) => {
  const formDataTrackFile = new FormData();
  formDataTrack.append("track", trackFile.buffer, trackFile.originalname);
  return formDataTrackFile;
}

module.exports = { createFugaTrackAsset, createFugaTrackFile };