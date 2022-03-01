const createError = require('http-errors');
const FormData = require('form-data');
const { uploadTrackFileInAlbumToFuga } = require('../third-party-api/providers/fuga/tracks');

const createFugaTrackUploadStart = uploadMetaData => {
  let rawDataUpload = {};
  // if (uploadMetaData.type !== 'audio') throw createError(400, 'Error starting the track upload, because the type is missing or is not AUDIO', { properties: { formData: uploadMetaData } });
  // if (uploadMetaData.id === undefined) throw createError(400, 'Error starting the track upload, because the trackAssetId is missing', { properties: { formData: uploadMetaData } });
  rawDataUpload.id = uploadMetaData.id;
  rawDataUpload.type = uploadMetaData.type;

  return rawDataUpload;
}

const createFugaTrackFileUpload = (trackFile, trackUploadStartUuid) => {
  const formDataTrack = new FormData();
  formDataTrack.append("uuid", trackUploadStartUuid);
  formDataTrack.append("filename", trackFile.originalname);
  formDataTrack.append("totalfilesize", trackFile.size);
  formDataTrack.append("partbyteoffset", '0');
  formDataTrack.append("file", trackFile.buffer, trackFile.originalname);
  return formDataTrack;
}

const getEnd = (index, chunksize, totalParts, totalSize) => {
  if (index + 1 === totalParts) return totalSize - 1;
  else return (index + 1) * chunksize - 1;
}

const createFugaTrackFileUploadTest = async (trackFile, trackUploadStartUuid) => {
  let chunksize = 2000000;
  let totalParts = parseInt(trackFile.size / chunksize) + 1;
  let arrayChunks = [...Array(totalParts).keys()];

  const uploadChunks = arrayChunks.map(async chunkIndex => {
    let cutBufferAt = getEnd(chunkIndex, chunksize, totalParts, trackFile.size);
    let startBuffer = chunkIndex * chunksize;

    let chunkFile = {
      fieldname: 'track',
      originalname: `trackChunk-${chunkIndex}.wav`,
      encoding: '7bit',
      mimetype: 'audio/wave',
      buffer: trackFile.buffer.slice(startBuffer, cutBufferAt)
    }

    console.log("Start and End :", { startBuffer, cutBufferAt });
    const formDataTrack = new FormData();
    formDataTrack.append("uuid", trackUploadStartUuid);
    formDataTrack.append("filename", trackFile.originalname);
    formDataTrack.append("totalfilesize", trackFile.size);
    formDataTrack.append("partindex", chunkIndex);
    formDataTrack.append("chunksize", chunksize);
    formDataTrack.append("partbyteoffset", chunksize * chunkIndex);
    formDataTrack.append("totalparts", totalParts);
    formDataTrack.append("file", chunkFile.buffer, chunkFile.originalname);

    console.log("CHUNK FILE :", chunkFile)
    await uploadTrackFileInAlbumToFuga(formDataTrack);
  })

  return Promise.all(uploadChunks).then(result => result).catch(error => console.log(error));
}

const createFugaCoverUploadStart = uploadCoverFormData => {
  let rawDataCoverUploadStart = {};
  // if (uploadCoverFormData.type !== 'image_cover_art') throw createError(400, 'Error starting the image_cover upload, because the type is missing or is not image_cover_art', { properties: { formData: uploadCoverFormData } });
  // if (uploadCoverFormData.id === undefined) throw createError(400, 'Error starting the track upload, because the image_cover_id is missing', { properties: { formData: uploadCoverFormData } });
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
  formDataImageCoverArt.append("file", imageCoverArtFile.buffer, imageCoverArtFile.originalname);

  return formDataImageCoverArt;
}

module.exports = {
  createFugaTrackUploadStart, createFugaTrackFileUpload, createFugaCoverUploadStart,
  createFugaCoverUpload, createFugaTrackFileUploadTest
};