const { artistsInUseDeleteError, artistFieldsMissingCreateError, artistGetArtistError, errorInesperado, labelDuplicateName,
  albumUploadAlbumEntityNotFoundError, albumUploadCoverError, trackUploadFileError, genericErrorUploadingAFile,
  albumCreateDuplicateAlbum, albumGetAlbumError, contributorsInesperatedGenericError, peopleInesperatedGenericError, errorPersonNameDuplicated,
  contributorDuplicatedError, contributorInvalidValueError, albumNotAuthorizedGenericError, albumMissingFieldsToPublish,
  albumAlreadyHasUPC, albumInesperatedGenericError, trackInesperatedGenericError, labelInesperatedGenericError, trackIsrcWrongValue, artistDuplicateArtistNameProprietaryId, errorInesperadoArtista, artistErrorNotAuthorized, artistErrorCreatingIdentifierNotAuthorized, artistInvalidIdentifier, trackQualityTooLow, trackFloatingPointWavError, trackIsrcDuplicate,
} = require("../../../utils/errors.utils");

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
  if (!peopleErrorFromFuga || !peopleErrorFromFuga.data) return peopleInesperatedGenericError;
  if (peopleErrorFromFuga.unexpectedError) return peopleInesperatedGenericError;
  if (peopleErrorFromFuga.data.code === "DUPLICATE_PERSON_NAME") return errorPersonNameDuplicated;
  return peopleInesperatedGenericError;
}

const handleContributorsErrorsMessage = (contributorsAssetsErrorFromFuga, errorConfigData) => {
  if (!contributorsAssetsErrorFromFuga || !contributorsAssetsErrorFromFuga.data) return contributorsInesperatedGenericError;
  let errorData = contributorsAssetsErrorFromFuga.data;
  if (errorData.code === "DUPLICATE_CONTRIBUTOR") return contributorDuplicatedError;
  if (errorData.role === "INVALID_VALUE") return contributorInvalidValueError("role");
  return contributorsInesperatedGenericError;
}

const handleAssetsErrorsMessage = (assetsErrorResponseFromFuga, errorConfigData) => {
  let errorData = assetsErrorResponseFromFuga.data;
  if (!assetsErrorResponseFromFuga || !assetsErrorResponseFromFuga.data) return trackInesperatedGenericError;
  if (assetsErrorResponseFromFuga.unexpectedError) return trackInesperatedGenericError;

  if (errorData.isrc === "DUPLICATE_ISRC_CODE") return trackIsrcDuplicate(errorData.messageVariables[2]);
  if (errorData.isrc === "FIELD_VALUE_WRONG") return trackIsrcWrongValue;

  return trackInesperatedGenericError;
}

const handleUploadErrorsMessage = (uploadErrorResponseFromFuga, errorConfigData) => {
  if (errorConfigData.type === "image_cover_art") return albumUploadCoverError;
  if (errorConfigData.type === "audio") return trackUploadFileError;
  if (uploadErrorResponseFromFuga.data.error.code === "INVALID_FILE_TYPE") {
    if (uploadErrorResponseFromFuga.data.error.message.indexOf("Floating point") >= 0) return trackFloatingPointWavError;
    if (uploadErrorResponseFromFuga.data.error.message.indexOf("Need a stereo") >= 0) return trackQualityTooLow;
  }
  return trackQualityTooLow;
}

const handleAlbumsErrorsMessage = albumErrorResponseFromFuga => {
  console.log("ALBUM ERROR: ", albumErrorResponseFromFuga);
  const configError = albumErrorResponseFromFuga.config;
  const urlReq = configError ? configError.url : "";
  const dataError = albumErrorResponseFromFuga.data;

  if (!albumErrorResponseFromFuga || !albumErrorResponseFromFuga.data) return albumInesperatedGenericError;
  if (albumErrorResponseFromFuga.statusText === "Not Found") return albumGetAlbumError;

  if (dataError.code === "PRODUCT_ALREADY_HAS_UPC") return albumAlreadyHasUPC;
  if (dataError.code === "NO_COVER_FILE") return albumUploadCoverError;
  // if (dataError.code === "FIELD_REQUIRED" && urlReq.indexOf("/publish") > 0) return albumMissingFieldsToPublish(dataError.context);
  if (dataError.code === "FIELD_REQUIRED" && urlReq.indexOf("/publish") > 0) return albumMissingFieldsToPublish(dataError.context);
  if (dataError.code === "NOT_AUTHORIZED") return albumNotAuthorizedGenericError;
  if (dataError.code === "DUPLICATE_AUDIOPRODUCT") return albumCreateDuplicateAlbum;
  if (dataError.upc === "DUPLICATE_UPC_CODE") return albumAlreadyHasUPC;

  if (dataError.primary_artist === "ENTITY_NOT_FOUND") return albumUploadAlbumEntityNotFoundError(`${dataError.context}`);
  if (dataError.label === "ENTITY_NOT_FOUND") return albumUploadAlbumEntityNotFoundError(`${dataError.context}`);

  return albumInesperatedGenericError;
}

const handleLabelErrorsMessage = labelErrorResponseFromFuga => {
  if (labelErrorResponseFromFuga.id) return labelErrorResponseFromFuga;
  if (!labelErrorResponseFromFuga || !labelErrorResponseFromFuga.data) return labelInesperatedGenericError;
  switch (labelErrorResponseFromFuga.data.code) {
    case "DUPLICATE_LABEL_NAME":
      return labelDuplicateName;
    default:
      return labelInesperatedGenericError;
  }
};

const handleArtistErrorsMessage = artistErrorResponseFromFuga => {
  const url = artistErrorResponseFromFuga.config.url;
  if (!artistErrorResponseFromFuga || !artistErrorResponseFromFuga.data) return errorInesperado;
  if (artistErrorResponseFromFuga.status === 404) return artistGetArtistError;
  switch (artistErrorResponseFromFuga.data.code) {
    case "ARTIST_INVALID_IDENTIFIER":
      return artistInvalidIdentifier;
    case "DUPLICATE_ARTIST_NAME_PROPRIETARY_ID":
      return artistDuplicateArtistNameProprietaryId;
    case "NOT_AUTHORIZED":
      if (url.indexOf("identifier") >= 0) return artistErrorCreatingIdentifierNotAuthorized;
      return artistErrorNotAuthorized
    case "CANNOT_DELETE_ITEM_IN_USE":
      return artistsInUseDeleteError;
    case "FIELD_REQUIRED":
      return artistFieldsMissingCreateError(artistErrorResponseFromFuga.data.context);
    default:
      return errorInesperadoArtista;
  }
};

module.exports = { handleErrorsMessagesFromFuga, handleLabelErrorsMessage, handleArtistErrorsMessage, handleAlbumsErrorsMessage };