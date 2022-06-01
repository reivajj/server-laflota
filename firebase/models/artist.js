const { v4: uuidv4 } = require('uuid');
const { MIGRATED } = require('../../utils/utils');

const createArtistFsFromMigration = artistFromMigration => {
  let dateUpdatedOld = new Date();
  dateUpdatedOld.setFullYear(dateUpdatedOld.getFullYear() - 1);
  dateUpdatedOld = dateUpdatedOld.getTime();

  return {
    appleIdentifierIdFuga: artistFromMigration.appleIdentifierIdFuga,
    apple_id: artistFromMigration.apple_id,
    biography: "",
    fugaId: artistFromMigration.artistFugaId,
    fugaPropietaryId: "",
    id: uuidv4(),
    imagenUrl: "",
    lastUpdateTS: dateUpdatedOld,
    name: artistFromMigration.artistName,
    ownerEmail: artistFromMigration.ownerEmail,
    ownerId: artistFromMigration.ownerId,
    ownerIdWp: artistFromMigration.ownerIdWp,
    spotifyIdentifierIdFuga: artistFromMigration.spotifyIdentifierIdFuga,
    spotify_uri: artistFromMigration.spotify_uri,
    whenCreatedTS: dateUpdatedOld,
    artistStatus: MIGRATED
  }
}

const createArtistFsFromFuga = (artistFromFuga, artistIdentifiers, ownerEmail, ownerId) => {
  let dateUpdatedOld = 1654004821437;

  return {
    appleIdentifierIdFuga: artistIdentifiers.appleIdentifierIdFuga,
    apple_id: artistIdentifiers.apple_id,
    biography: artistFromFuga.biography || "",
    fugaId: artistFromFuga.id,
    fugaPropietaryId: "",
    id: uuidv4(),
    imagenUrl: "",
    lastUpdateTS: dateUpdatedOld,
    name: artistFromFuga.name,
    ownerEmail: ownerEmail,
    ownerId: ownerId,
    spotifyIdentifierIdFuga: artistIdentifiers.spotifyIdentifierIdFuga,
    spotify_uri: artistIdentifiers.spotify_uri,
    whenCreatedTS: dateUpdatedOld,
    artistStatus: MIGRATED
  }
}

module.exports = { createArtistFsFromMigration, createArtistFsFromFuga };