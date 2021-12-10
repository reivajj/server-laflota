// ACA ESCRIBIRE TODOS LOS ERRORES PARA QUE SEAN IMPORTADOS EN TESTS Y CREATEERRRORS

// ALBUMS
const albumPublishPermissionError = albumId => `Error to publish an album in FUGA with id: ${albumId}, no permission or contract.`;
const albumPublishNotFoundError = albumId => `Error to publish an album in FUGA with id: ${albumId}: no existe o no esta disponible.`;
const albumRearrengeError = (trackId, albumId) => `Error to update position of trackId: ${trackId} in album with id: ${albumId}`;
const albumUploadCoverError = `Error to upload a Cover Image to an album`;
const albumTrackAssetError = (albumId, trackId) => `Error to attach an asset to the Album with Id: ${albumId} and trackId: ${trackId}`;
const albumUploadAlbumError = 'Error uploading an album in FUGA';
const albumGetAlbumError = albumId => `Error getting an album with ID: ${albumId}`;
const albumGetAllError = 'Error getting al the albums';
const albumUpdateFieldsError = albumId => `Error trying to update an Album with id: ${albumId}`;

module.exports = {
  albumPublishNotFoundError, albumPublishPermissionError, albumRearrengeError, albumUploadCoverError,
  albumTrackAssetError, albumUploadAlbumError, albumGetAlbumError, albumGetAllError, albumUpdateFieldsError
}