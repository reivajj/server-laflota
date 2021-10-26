const createError = require('http-errors');
const FormData = require('form-data');

const createFugaTrackUploadStart = uploadMetaData => {
  let rawDataUpload = {};
  if (uploadMetaData.type !== 'audio') throw createError(400, 'Error starting the track upload, because the type is missing or is not AUDIO', { properties: { formData: uploadMetaData } });
  if (uploadMetaData.id === undefined) throw createError(400, 'Error starting the track upload, because the trackAssetId is missing', { properties: { formData: uploadMetaData } });
  rawDataUpload.id = uploadMetaData.id;
  rawDataUpload.type = uploadMetaData.type;
  if (uploadMetaData.overwrite_all !== undefined) rawDataUpload.overwrite_all = uploadMetaData.overwrite_all;
  if (uploadMetaData.clear_all_encodings !== undefined) rawDataUpload.clear_all_encodings = uploadMetaData.clear_all_encodings;

  return rawDataUpload;
}

const createFugaCoverUploadStart = uploadCoverFormData => {
  let rawDataCoverUploadStart = {};
  if (uploadCoverFormData.type !== 'image_cover_art') throw createError(400, 'Error starting the image_cover_art upload, because the type is missing or is not image_cover_art', { properties: { formData: uploadCoverFormData } });
  if (uploadCoverFormData.id === undefined) throw createError(400, 'Error starting the track upload, because the image_cover_art_id is missing', { properties: { formData: uploadCoverFormData } });
  rawDataCoverUploadStart.id = uploadCoverFormData.id;
  rawDataCoverUploadStart.type = uploadCoverFormData.type;

  return rawDataCoverUploadStart;
}

const createFugaCoverUpload = (imageCoverArtFile, coverUploadStartUuid) => {
  const formDataImageCoverArt = new FormData();
  formDataImageCoverArt.append("uuid", coverUploadStartUuid);
  formDataImageCoverArt.append("filename", imageCoverArtFile.originalname);
  formDataImageCoverArt.append("totalfilesize", imageCoverArtFile.size);
  formDataImageCoverArt.append("partbyteoffset", '0');
  formDataImageCoverArt.append("file", imageCoverArtFile.buffer , imageCoverArtFile.originalname);

  return formDataImageCoverArt;
}

module.exports = { createFugaTrackUploadStart, createFugaCoverUploadStart, createFugaCoverUpload };