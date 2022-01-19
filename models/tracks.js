const FormData = require('form-data');

// REVEER: Validar parametros de entrada. No solo retornarlos
const createFugaTrackAsset = trackAssetMetaData => {

  let rawDataTrackAsset = {};
  if (trackAssetMetaData.name) rawDataTrackAsset.name = trackAssetMetaData.name;
  if (trackAssetMetaData.genre) rawDataTrackAsset.genre = trackAssetMetaData.genre;
  if (trackAssetMetaData.artists) rawDataTrackAsset.artists = JSON.parse(trackAssetMetaData.artists);
  if (trackAssetMetaData.sequence) rawDataTrackAsset.sequence = trackAssetMetaData.sequence;
  if (trackAssetMetaData.display_artist) rawDataTrackAsset.display_artist = trackAssetMetaData.display_artist;
  if (trackAssetMetaData.language) rawDataTrackAsset.language = trackAssetMetaData.language;
  if (trackAssetMetaData.isrc) rawDataTrackAsset.isrc = trackAssetMetaData.isrc;
  if (trackAssetMetaData.price) rawDataTrackAsset.price = trackAssetMetaData.price;
  if (trackAssetMetaData.lyrics) rawDataTrackAsset.lyrics = trackAssetMetaData.lyrics;
  if (trackAssetMetaData.preorder_date) {
    rawDataTrackAsset.preorder_date = trackAssetMetaData.preorder_date;
    rawDataTrackAsset.allow_preorder = true;
    rawDataTrackAsset.available_separately = true;
  }
  if (trackAssetMetaData.allow_preorder_preview) rawDataTrackAsset.allow_preorder_preview = trackAssetMetaData.allow_preorder_preview;
  return rawDataTrackAsset;
}

const createFugaTrackFile = (fileTrackMetaData, trackFile) => {
  const formDataTrackFile = new FormData();
  formDataTrack.append("track", trackFile.buffer, trackFile.originalname);
  return formDataTrackFile;
}

module.exports = { createFugaTrackAsset, createFugaTrackFile };
