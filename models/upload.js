const createError = require('http-errors');
const FormData = require('form-data');

const createFugaTrackStartUpload = uploadMetaData => {
  let rawDataUpload = {};
  if (uploadMetaData.type !== 'audio') throw createError(400, 'Error starting the track upload, because the type is missing or is not AUDIO', { properties: { formData: uploadMetaData } }); 
  if (uploadMetaData.id === undefined) throw createError(400, 'Error starting the track upload, because the trackAssetId is missing', { properties: { formData: uploadMetaData } }); 
  rawDataUpload.id = uploadMetaData.id;
  rawDataUpload.type = uploadMetaData.type;
  if (uploadMetaData.overwrite_all !== undefined) rawDataUpload.overwrite_all = uploadMetaData.overwrite_all;
  if (uploadMetaData.clear_all_encodings !== undefined) rawDataUpload.clear_all_encodings = uploadMetaData.clear_all_encodings;
  
  return rawDataUpload;
}

const createFugaTrackFileUpload = (trackFileMetadata, trackFile) => {
  const formDataTrackWithFile = new FormData();

  if (trackFileMetadata.uuid === undefined) throw createError(400, 'Error in the track upload, because the UUID of the start upload is missing', { properties: { formData: trackFileMetadata } }); 
  formDataTrackWithFile.append("uuid", trackFileMetadata.uuid);
  formDataTrackWithFile.append("filename", trackFileMetadata.filename);
  formDataTrackWithFile.append("partbyteoffset", trackFileMetadata.partbyteoffset);
  formDataTrackWithFile.append("file", trackFile.buffer, trackFile.originalname);

  return formDataTrackWithFile;
}

module.exports = { createFugaTrackStartUpload, createFugaTrackFileUpload };