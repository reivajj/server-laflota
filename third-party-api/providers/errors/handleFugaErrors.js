const { artistsInUseDeleteError, artistFieldsMissingCreateError, artistGetArtistError, errorInesperado, labelDuplicateName, albumUploadAlbumEntityNotFoundError, albumUploadCoverError, trackUploadFileError, genericErrorUploadingAFile, albumCreateDuplicateAlbum } = require("../../../utils/errors.utils");

const handleErrorsMessagesFromFuga = (responseErrorFromFuga, urlReq, errorConfigData) => {
  if (urlReq.indexOf("/artists") === 0) return handleArtistErrorsMessage(responseErrorFromFuga);
  if (urlReq.indexOf("/labels") === 0) return handleLabelErrorsMessage(responseErrorFromFuga);
  if (urlReq.indexOf("/products") === 0) return handleAlbumsErrorsMessage(responseErrorFromFuga);
  if (urlReq.indexOf("/upload") === 0) return handleUploadErrorsMessage(responseErrorFromFuga, errorConfigData);
}

const handleUploadErrorsMessage = (uploadErrorResponseFromFuga, errorConfigData) => {
  console.log("ERROR EN HANDLE UPLOAD COVER:", errorConfigData);
  if (errorConfigData.type === "image_cover_art") return albumUploadCoverError;
  if (errorConfigData.type === "audio") return trackUploadFileError;
  return genericErrorUploadingAFile;
}

const handleAlbumsErrorsMessage = albumErrorResponseFromFuga => {
  console.log("ERRO EN ALBUM HANDLER:", albumErrorResponseFromFuga);
  if (!albumErrorResponseFromFuga || !albumErrorResponseFromFuga.data) return errorInesperado;
  
  let dataError = albumErrorResponseFromFuga.data;
  if (dataError.primary_artist === "ENTITY_NOT_FOUND") return albumUploadAlbumEntityNotFoundError(`${dataError.context}`);
  if (dataError.label === "ENTITY_NOT_FOUND") return albumUploadAlbumEntityNotFoundError(`${dataError.context}`);
  if (dataError.code === "DUPLICATE_AUDIOPRODUCT") return albumCreateDuplicateAlbum;
  return errorInesperado;
}

const handleLabelErrorsMessage = labelErrorResponseFromFuga => {
  if (labelErrorResponseFromFuga.id) return labelErrorResponseFromFuga;
  if (!labelErrorResponseFromFuga || !labelErrorResponseFromFuga.data) return errorInesperado;
  switch (labelErrorResponseFromFuga.data.code) {
    case "DUPLICATE_LABEL_NAME":
      return labelDuplicateName;
    default:
      return errorInesperado;
  }
};

const handleArtistErrorsMessage = artistErrorResponseFromFuga => {
  if (!artistErrorResponseFromFuga || !artistErrorResponseFromFuga.data) return errorInesperado;
  if (artistErrorResponseFromFuga.status === 404) return artistGetArtistError;
  switch (artistErrorResponseFromFuga.data.code) {
    case "CANNOT_DELETE_ITEM_IN_USE":
      return artistsInUseDeleteError;
    case "FIELD_REQUIRED":
      return artistFieldsMissingCreateError(artistErrorResponseFromFuga.data.context);
    default:
      return errorInesperado;
  }
};

module.exports = { handleErrorsMessagesFromFuga, handleLabelErrorsMessage, handleArtistErrorsMessage, handleAlbumsErrorsMessage };