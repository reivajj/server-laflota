const FormData = require('form-data');

const createImageCoverArtFuga = (imageCoverArtMetaData, imageCoverArtFile) => {
  const formDataImageCoverArt = new FormData();

  formDataImageCoverArt.append("uuid", imageCoverArtMetaData.album_id);
  formDataImageCoverArt.append("filename", imageCoverArtMetaData.filename);
  formDataImageCoverArt.append("partbyteoffset", imageCoverArtMetaData.partbyteoffset);
  formDataImageCoverArt.append("totalfilesize", imageCoverArtMetaData.totalfilesize);
  formDataImageCoverArt.append("file  ", imageCoverArtFile.buffer, imageCoverArtFile.filename);

  return formDataImageCoverArt;
}

module.exports = createImageCoverArtFuga;