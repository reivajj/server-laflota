const { artistsInUseDeleteError, artistFieldsMissingCreateError, artistGetArtistError, errorInesperado, labelDuplicateName, albumUploadAlbumEntityNotFoundError, albumUploadCoverError, trackUploadFileError, genericErrorUploadingAFile, albumCreateDuplicateAlbum, albumGetAlbumError, errorInesperadoContributors, errorInesperadoPeople, errorPersonNameDuplicated, contributorDuplicatedError, contributorInvalidValueError } = require("../../../utils/errors.utils");

// Pasar esto a las distintas RUTAS que tenes en ROUTES. Y ver que esten incluidas y listo.
const handleErrorsMessagesFromFuga = (responseErrorFromFuga, urlReq, errorConfigData) => {
  if (urlReq.indexOf("/artists") === 0) return handleArtistErrorsMessage(responseErrorFromFuga);
  if (urlReq.indexOf("/labels") === 0) return handleLabelErrorsMessage(responseErrorFromFuga);
  if (urlReq.indexOf("/products") === 0) return handleAlbumsErrorsMessage(responseErrorFromFuga);
  if (urlReq.indexOf("/upload") === 0) return handleUploadErrorsMessage(responseErrorFromFuga, errorConfigData);
  if (urlReq.indexOf("/assets") === 0 && urlReq.indexOf("/contributors") === -1) return handleAssetsErrorsMessage(responseErrorFromFuga, errorConfigData);
  if (urlReq.indexOf("/assets") === 0 && urlReq.indexOf("/contributors") > 0) return handleContributorsErrorsMessage(responseErrorFromFuga, errorConfigData);
  if (urlReq.indexOf("/people") === 0) return handlePeopleErrorsMessage(responseErrorFromFuga);
}

const handlePeopleErrorsMessage = peopleErrorFromFuga => {
  if (!peopleErrorFromFuga || !peopleErrorFromFuga.data) return errorInesperadoPeople;
  if (peopleErrorFromFuga.unexpectedError) return errorInesperadoPeople;
  if (peopleErrorFromFuga.data.code === "DUPLICATE_PERSON_NAME") return errorPersonNameDuplicated;
  return errorInesperadoPeople;
}

const handleContributorsErrorsMessage = (contributorsAssetsErrorFromFuga, errorConfigData) => {
  console.log("ERROR CONFIG EN HANDLE ASSETS", contributorsAssetsErrorFromFuga);
  if (!contributorsAssetsErrorFromFuga || !contributorsAssetsErrorFromFuga.data) return errorInesperadoContributors;

  let errorData = contributorsAssetsErrorFromFuga.data;
  if (errorData.code === "DUPLICATE_CONTRIBUTOR") return contributorDuplicatedError;
  if (errorData.role === "INVALID_VALUE") return contributorInvalidValueError("role");
  return errorInesperadoContributors;
}

const handleAssetsErrorsMessage = (assetsErrorResponseFromFuga, errorConfigData) => {
  console.log("ERROR CONFIG EN HANDLE ASSETS", assetsErrorResponseFromFuga);
  return errorInesperado;
}

const handleUploadErrorsMessage = (uploadErrorResponseFromFuga, errorConfigData) => {
  if (errorConfigData.type === "image_cover_art") return albumUploadCoverError;
  if (errorConfigData.type === "audio") return trackUploadFileError;
  return genericErrorUploadingAFile;
}

const handleAlbumsErrorsMessage = albumErrorResponseFromFuga => {
  console.log("ERRO EN ALBUM HANDLER:", albumErrorResponseFromFuga);
  if (!albumErrorResponseFromFuga || !albumErrorResponseFromFuga.data) return errorInesperado;
  if (albumErrorResponseFromFuga.statusText === "Not Found") return albumGetAlbumError;

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