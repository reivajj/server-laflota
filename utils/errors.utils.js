// ACA ESCRIBIRE TODOS LOS ERRORES PARA QUE SEAN IMPORTADOS EN TESTS Y CREATEERRRORS

// VARIOS
const errorInesperado = "Hubo un error inesperado. Por favor, intente nuevamente.";

// ALBUMS
const albumPublishPermissionError = "Error al querer publicar el Album, no tienes permiso o contrato.";
const albumPublishNotFoundError = "Error al querer publicar el Album, no fue posible encontrar el Album.";
const albumRearrengeError = "Error al actualizar la posición de la Canción en el Album.";
const albumUploadCoverError = `Error al subir la imagen del Arte de Tapa.`;
const albumTrackAssetError = "Error al subir la Canción al Album.";
const albumUploadAlbumError = 'Error al crear el Album.';
const albumUploadAlbumEntityNotFoundError = entityMissing => `Error al crear el Album, no encontramos las siguientes entidades: ${entityMissing}`;
const albumGetAlbumError = "Error al querer obtener el Album.";
const albumGetAllError = "Error al querer obtener todos los Albums.";
const albumUpdateFieldsError = "Error al querer actualizar el Album. ";
const albumDeleteError = "No se pudo eliminar el Album. ";
const albumCreateDuplicateAlbum = "Este Album ya existe en el catálogo, con el mismo nombre y numero de catálogo.";

// ARTISTS
const artistCreateError = 'Error creating an artist in FUGA';
const artistGetArtistError = "No podemos encontrar al artista solicitado.";
const artistGetAllError = 'Error getting all the artists';
const artistUpdateFieldsError = fieldsToUpdate => `Error trying to update an Artist with fields: ${Object.keys(fieldsToUpdate).toString()}`;
const artistsDeleteError = "Generic Error trying to delete artist";
const artistsInUseDeleteError = "Error trying to delete artist because is in use";
const artistFieldsMissingCreateError = fields => `Los siguientes campos del Artista faltan o son incorrectos: ${fields}`

// LABELS
const labelDuplicateName = "El nombre del sello ya se encuentra en uso.";

// TRACKS
const trackUploadFileError = "Error al subir la Canción (archivo) al Album. "
const genericErrorUploadingAFile = "Error al subir un archivo.";

// CONTRIBUTORS
const errorInesperadoContributors = "Error inesperado al trabajar con los Contribuidores. ";
const contributorDuplicatedError = "El artista que contribuye ya existe con ese mismo Rol.";
const contributorInvalidValueError = fieldValue => `El campo ${fieldValue}, tiene un valor inválido al querer agregar un Contriuidor.`

// PEOPLE
const errorInesperadoPeople = "Error inesperado al trabajar con People";
const errorPersonNameDuplicated = "Error al crear una Persona, el nombre ya existe. ";

module.exports = {
  errorInesperado,

  albumPublishNotFoundError, albumPublishPermissionError, albumRearrengeError, albumUploadCoverError,
  albumTrackAssetError, albumUploadAlbumError, albumGetAlbumError, albumGetAllError, albumUpdateFieldsError,
  albumDeleteError, albumUploadAlbumEntityNotFoundError, albumCreateDuplicateAlbum,

  artistCreateError, artistGetAllError, artistGetArtistError, artistUpdateFieldsError, artistsDeleteError,
  artistsInUseDeleteError, artistFieldsMissingCreateError,

  labelDuplicateName,

  trackUploadFileError,

  genericErrorUploadingAFile,

  errorInesperadoContributors, contributorDuplicatedError, contributorInvalidValueError,

  errorInesperadoPeople, errorPersonNameDuplicated,
}