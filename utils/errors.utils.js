// ACA ESCRIBIRE TODOS LOS ERRORES PARA QUE SEAN IMPORTADOS EN TESTS Y CREATEERRRORS

// VARIOS
const errorInesperado = "Hubo un error inesperado. Por favor, intente nuevamente.";

// ALBUMS
const albumPublishPermissionError = "Error al querer publicar el Album, no tienes permiso o contrato.";
const albumPublishNotFoundError = "Error al querer publicar el Album, no fue posible encontrar el Album.";
const albumRearrengeError = "Error al actualizar la posición de la Canción en el Album.";
const albumUploadCoverError = `Error al subir la imagen del Arte de Tapa.`;
const albumTrackAssetError = "Error al adjuntar la Canción al Album.";
const albumUploadAlbumError = 'Error al crear el Album.';
const albumUploadAlbumEntityNotFoundError = entityMissing => `Error al crear el Album, no encontramos las siguientes entidades: ${entityMissing}`;
const albumGetAlbumError = "Error al querer obtener el Album.";
const albumGetAllError = "Error al querer obtener todos los Albums.";
const albumUpdateFieldsError = "Error al querer actualizar el Album. ";
const albumDeleteError = "No se pudo eliminar el Album. ";
const albumCreateDuplicateAlbum = "Este Album ya existe en el catálogo, con el mismo nombre y numero de catálogo.";
const albumGenerateUPCInesperatedError = "Sucedió un error inesperado al asignar un UPC al Album.";
const albumNotAuthorizedGenericError = "No estás autorizado para realizar esta operación. Problablemente no estés logueado.";
const albumMissingFieldsToPublish = fieldsMissing => `Faltan los siguientes campos obligatorios al querer Publicar el Album: ${fieldsMissing}`;
const albumAlreadyHasUPC = "El UPC del lanzamiento ya existe en nuestro sistema, no puede usarlo nuevamente. Si el UPC fue asignado por el sistema, por favor, elimínelo y dejelo vacío (ver campo UPC).";
const albumInesperatedGenericError = "Hubo un error inesperado al trabajar con un Album. Por favor, intente nuevamente.";

// ARTISTS
const artistCreateError = 'Error creating an artist in FUGA';
const artistGetArtistError = "No podemos encontrar al artista solicitado.";
const artistGetAllError = 'Error getting all the artists';
const artistUpdateFieldsError = fieldsToUpdate => `Error trying to update an Artist with fields: ${Object.keys(fieldsToUpdate).toString()}`;
const artistsDeleteError = "Generic Error trying to delete artist";
const artistsInUseDeleteError = "Error trying to delete artist because is in use";
const artistFieldsMissingCreateError = fields => `Los siguientes campos del Artista faltan o son incorrectos: ${fields}`
const artistDuplicateArtistNameProprietaryId = 'Error al crear el Artista, Id del Propietario ya se encuentra en uso';
const errorInesperadoArtista = 'Hubo un error inesperado al trabajar con un Artista. Por favor, intente nuevamente';
const artistErrorCreatingIdentifierNotAuthorized = 'Error al crear un Identificador para el Artista. Puede ser que el identificador ingresado sea incorrecto. Reingrese nuevamente el identificador.';
const artistErrorNotAuthorized = 'Error de autorización para realizar esta acción. Aségurate que los datos ingresados son correctos.';
const artistInvalidIdentifier = 'El identificador de artista no tiene el formato correcto. El Spotify Artist URI es un código alfanúmerico (sin signo de preguntas) que contiene exactamente 37 carácteres. Por ejemplo: spotify:artist:6rqhFgbbKwnb9MLmUQDhG6.';
// LABELS
const labelInesperatedGenericError = "Hubo un error inesperado al trabajar con un Sello. Por favor, intente nuevamente.";
const labelDuplicateName = "El nombre del sello ya se encuentra en uso.";

// TRACKS
const trackInesperatedGenericError = "Hubo un error inesperado al trabajar con una Canción. Por favor, intente nuevamente.";
const trackUploadFileError = "Error al subir la Canción (archivo) al Lanzamiento, la calidad es muy baja. Debe ser un stereo, 16, 24, or 32 bit entre 44.1 and 192 kHz WAV";
const genericErrorUploadingAFile = "Error al subir un archivo.";
const trackIsrcWrongValue = "Error al subir la Canción, el ISRC no es válido."
const trackQualityTooLow = "Error al subir el archivo de la canción, la calidad es muy baja. Debe ser un stereo, 16, 24, or 32 bit entre 44.1 and 192 kHz WAV";
const trackFloatingPointWavError = "Archivos Floating point WAV no son soportados. Debe ser un stereo, 16, 24, or 32 bit entre 44.1 y 192 kHz (Sample Rate) WAV";
// CONTRIBUTORS
const contributorsInesperatedGenericError = "Error inesperado al trabajar con los Contribuidores. ";
const contributorDuplicatedError = "El artista que contribuye ya existe con ese mismo Rol.";
const contributorInvalidValueError = fieldValue => `El campo ${fieldValue}, tiene un valor inválido al querer agregar un Contriuidor.`

// PEOPLE
const peopleInesperatedGenericError = "Error inesperado al trabajar con People";
const errorPersonNameDuplicated = "Error al crear una Persona, el nombre ya existe. ";

module.exports = {
  errorInesperado,

  albumPublishNotFoundError, albumPublishPermissionError, albumRearrengeError, albumUploadCoverError,
  albumTrackAssetError, albumUploadAlbumError, albumGetAlbumError, albumGetAllError, albumUpdateFieldsError,
  albumDeleteError, albumUploadAlbumEntityNotFoundError, albumCreateDuplicateAlbum, albumGenerateUPCInesperatedError,
  albumNotAuthorizedGenericError, albumMissingFieldsToPublish, albumAlreadyHasUPC, albumInesperatedGenericError,

  artistCreateError, artistGetAllError, artistGetArtistError, artistUpdateFieldsError, artistsDeleteError,
  artistsInUseDeleteError, artistFieldsMissingCreateError, artistDuplicateArtistNameProprietaryId, errorInesperadoArtista,
  artistErrorCreatingIdentifierNotAuthorized, artistErrorNotAuthorized, artistInvalidIdentifier,

  labelDuplicateName, labelInesperatedGenericError,

  trackUploadFileError, trackInesperatedGenericError, trackIsrcWrongValue, trackQualityTooLow, trackFloatingPointWavError,

  genericErrorUploadingAFile,

  contributorsInesperatedGenericError, contributorDuplicatedError, contributorInvalidValueError,

  peopleInesperatedGenericError, errorPersonNameDuplicated,
}