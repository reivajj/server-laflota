const { getAllArtistsFromLFByUserFromDB } = require("../db/users");
const { getArtistByName, getArtistIdentifierById } = require("../services/providers/artists");
const { v4: uuidv4 } = require('uuid');
const { createCsvWriter, readCsv, getArrayElementsInFsFromCsv } = require("../utils/csv.utils");
const { deleteWeirdCharacters } = require("../utils/utils");
const { createIdentifiersFromFugaToFS } = require("../models/artists");
const { createArtistFsFromMigration } = require("../firebase/models/artist");
const { createArtistFS, getFsArtistsByField, updateArtistFS } = require("../firebase/firestore/artists");
const { getUserInFSByEmail } = require("../firebase/firestore/user");

const csvWriterFsArtists = createCsvWriter({
  path: 'migration/0.artists.csv',
  header: [{ id: "artistWpId", title: "artistWpId" }, { id: "artistName", title: "artistName" },
  { id: "ownerEmail", title: "ownerEmail" }, { id: "ownerId", title: "ownerId" }, { id: "ownerIdWp", title: "ownerIdWp" }]
});

const csvWriterFsEmptyArtists = createCsvWriter({
  path: 'migration/1.userWithNoArtists.csv',
  header: [{ id: "artistWpId", title: "artistWpId" }, { id: "artistName", title: "artistName" }, { id: "artistDGId", title: "artistDGId" },
  { id: "ownerEmail", title: "ownerEmail" }, { id: "ownerId", title: "ownerId" }, { id: "ownerIdWp", title: "ownerIdWp" }]
});

const csvWriterFsArtistsFuga = createCsvWriter({
  path: 'migration/0.fuga.weird.artists.csv',
  header: [{ id: "artistFugaId", title: "artistFugaId" }, { id: "artistProprietaryId", title: "artistProprietaryId" },
  { id: "artistWpId", title: "artistWpId" }, { id: "artistName", title: "artistName" },
  { id: "ownerEmail", title: "ownerEmail" }, { id: "ownerId", title: "ownerId" }, { id: "ownerIdWp", title: "ownerIdWp" }]
});

const csvWriterFsFugaNotFoundedArtists = createCsvWriter({
  path: 'migration/1.fuga.weird.userWithNoArtists.csv',
  header: [{ id: "artistFugaId", title: "artistFugaId" }, { id: "artistProprietaryId", title: "artistProprietaryId" },
  { id: "artistWpId", title: "artistWpId" }, { id: "artistName", title: "artistName" },
  { id: "ownerEmail", title: "ownerEmail" }, { id: "ownerId", title: "ownerId" }, { id: "ownerIdWp", title: "ownerIdWp" }]
});

const csvWriterFsArtistsFugaIdentifiers = createCsvWriter({
  path: 'migration/0.fuga.identifiers.artists.csv',
  header: [
    { id: "artistFugaId", title: "artistFugaId" }, { id: "artistProprietaryId", title: "artistProprietaryId" },
    { id: "artistWpId", title: "artistWpId" }, { id: "artistName", title: "artistName" },
    { id: "ownerEmail", title: "ownerEmail" }, { id: "ownerId", title: "ownerId" }, { id: "ownerIdWp", title: "ownerIdWp" },
    { id: "spotify_uri", title: "spotify_uri" }, { id: "spotifyIdentifierIdFuga", title: "spotifyIdentifierIdFuga" },
    { id: "apple_id", title: "apple_id" }, { id: "appleIdentifierIdFuga", title: "appleIdentifierIdFuga" }
  ]
});

const csvWriterFSCreation = createCsvWriter({
  path: 'migration/0.fs.artists.status.csv',
  header: [{ id: "artistFugaId", title: "artistFugaId" }, { id: "artistFsId", title: "artistFsId" },
  { id: "artistOwnerId", title: "artistOwnerId" }, { id: "artistOwnerEmail", title: "artistOwnerEmail" },
  { id: "status", title: "status" }]
});

const createArtistCsvRow = (artistFromCsv, artistIdentifiers) => {
  return {
    ...artistFromCsv,
    spotifyIdentifierIdFuga: artistIdentifiers.spotifyIdentifierIdFuga,
    appleIdentifierIdFuga: artistIdentifiers.appleIdentifierIdFuga,
    spotify_uri: artistIdentifiers.spotify_uri,
    apple_id: artistIdentifiers.apple_id
  }
}

const emptyIdentifiers = { spotifyIdentifierIdFuga: "", appleIdentifierIdFuga: "", spotify_uri: "", apple_id: "" }

const getArtistsToMigrateToFS = async () => {
  let artistsToMigrate = await getArrayElementsInFsFromCsv("migration/1.users.InWpMissingInFs.csv");

  let emptyArtistsResult = []; let hasArtistsResult = [];
  console.time("TEST GET ALBUM");
  let index = 0;

  for (const userMigrated of usersMigrated) {
    let artistsFromDB = await getAllArtistsFromLFByUserFromDB(userMigrated.userIdWp);
    if (artistsFromDB === "El usuario no tiene Artistas") emptyArtistsResult.push(createArtistCsvRow("NO_ARTISTS", userMigrated));
    else artistsFromDB.forEach(artistFromDB => hasArtistsResult.push(createArtistCsvRow(artistFromDB, userMigrated)));
    console.log("PROCESADOS: ", index);
    console.log("PROCESADOS: ", index);
    index++;
  }

  await csvWriterFsEmptyArtists.writeRecords(emptyArtistsResult);
  await csvWriterFsArtists.writeRecords(hasArtistsResult);
  console.timeEnd("TEST GET ALBUM");
  return hasArtistsResult;
}

const getArtistsFugaIdToMigrateToFS = async () => {
  let artistsToMigrate = await getArrayElementsInFsFromCsv("migration/0.fuga.artists.csv");

  let hasArtistsResult = [];
  console.time("TEST GET ALBUM");
  let index = 0;

  for (const artistMigrated of artistsToMigrate) {
    let artistIdentifiers = await getArtistIdentifierById(artistMigrated.artistFugaId);
    console.log("IDENTIFIERS", artistIdentifiers.data)
    artistIdentifiers = artistIdentifiers.data;

    if (artistIdentifiers.length === 0) {
      hasArtistsResult.push(createArtistCsvRow(artistMigrated, emptyIdentifiers));
      console.log("PROCESADOS: ", index);
      index++;
      continue;
    }
    else hasArtistsResult.push(createArtistCsvRow(artistMigrated, createIdentifiersFromFugaToFS(artistIdentifiers)));
    console.log("PROCESADOS: ", index);
    index++;
  }

  await csvWriterFsArtistsFugaIdentifiers.writeRecords(hasArtistsResult);
  console.timeEnd("TEST GET ALBUM");
  return hasArtistsResult;
}

const createArtistFsFromMigrate = async () => {
  let artistsToMigrate = await getArrayElementsInFsFromCsv("migration/0.fuga.artists.csv");

  let migrateResult = [];
  console.time("TEST GET ALBUM");
  let index = 0;

  for (const artistMigrated of artistsToMigrate) {

    let fsArtist = await getFsArtistsByField("fugaId", artistMigrated.artistFugaId);
    if (fsArtist === "NOT_FOUNDED_FS_ARTIST") {
      migrateResult.push({ artistFugaId: artistMigrated.artistFugaId, artistFsId: "NOT_FOUND_ARTIST", status: "NOT_FOUND_ARTIST" });
      continue;
    }

    let artistOwnerUser = await getUserInFSByEmail(artistMigrated.ownerEmail);
    if (!artistOwnerUser.exist) {
      migrateResult.push({ artistFugaId: artistMigrated.artistFugaId, artistFsId: fsArtist[0].id, status: "NOT_FOUND_USER" });
      continue;
    }

    let resultCreate = await updateArtistFS(fsArtist[0].id, { ownerId: artistOwnerUser.user.id, fugaId: parseInt(artistMigrated.artistFugaId) });
    migrateResult.push({
      artistFugaId: artistMigrated.artistFugaId, artistFsId: fsArtist[0].id,
      artistOwnerId: artistOwnerUser.user.id, artistOwnerEmail: artistMigrated.ownerEmail, status: resultCreate.created
    });
    index++;
    console.log("PROCESSED: ", index);
  }

  await csvWriterFSCreation.writeRecords(migrateResult);
  console.timeEnd("TEST GET ALBUM");
  return migrateResult;
}

module.exports = { getArtistsToMigrateToFS, getArtistsFugaIdToMigrateToFS, createArtistFsFromMigrate }