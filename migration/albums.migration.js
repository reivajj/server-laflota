const { setFsAlbum, getFsAlbumsByField } = require("../firebase/firestore/albums");
const { getFsArtistsByField, addOwnerEmailToArtist, createFsArtistFromFugaArtist } = require("../firebase/firestore/artists");
const { getUserInFSByEmail } = require("../firebase/firestore/user");
const { createFSAlbumFromFugaAlbum } = require("../models/albums");
const { getAlbumByFieldValue, getAlbumById, getAllAlbums, updateAlbumWithId } = require("../services/providers/albums");
const { createCsvWriter, readCsv, getArrayElementsInFsFromCsv } = require("../utils/csv.utils");

const csvWriterFsAlbumsNotDelivereds = createCsvWriter({
  path: 'migration/0.albumsNotDelivered.csv',
  header: [{ id: "upc", title: "upc" }, { id: "artistFugaId", title: "artistFugaId" },
  { id: "artistName", title: "artistName" }, { id: "ownerEmail", title: "ownerEmail" },
  { id: "ownerIdWp", title: "ownerIdWp" }, { id: "albumState", title: "albumState" },
  { id: "albumFugaId", title: "albumFugaId" }, { id: "requesitToPublish", title: "requesitToPublish" }]
});

const csvWriterFugaApproachDelivered = createCsvWriter({
  path: 'migration/2.migrateArtistsMissing.csv',
  header: [{ id: "upc", title: "upc" }, { id: "mainArtistFugaId", title: "mainArtistFugaId" },
  { id: "mainArtistAppId", title: "mainArtistAppId" }, { id: "artistName", title: "artistName" },
  { id: "albumAppId", title: "albumAppId" }, { id: "ownerEmail", title: "ownerEmail" },
  { id: "albumFugaId", title: "albumFugaId" }, { id: "result", title: "result" }]
});


const createAlbumAnalisisRow = (albumFromFuga, albumFromWp, validationRules) => {
  return {
    upc: albumFromFuga.upc || "UPC NOT FOUNDED",
    artistFugaId: albumFromFuga.artists[0]?.id || "ID NOT FOUNDED",
    artistName: albumFromWp['Artista'],
    ownerEmail: albumFromWp['Owner Email'],
    ownerIdWp: albumFromWp['User WP Id'],
    albumState: albumFromFuga.state || "STATE NOT FOUNDED",
    albumFugaId: albumFromFuga.id || "FUGA ID NOT FOUNDED",
    requesitToPublish: validationRules
  }
}

const analizeAlbumsNotInDelivery = async () => {
  let albumsFromWp = await getArrayElementsInFsFromCsv("migration/test.csv");
  let upcsAsList = [];
  albumsFromWp.forEach(albumFromWp => upcsAsList.push(albumFromWp['UPC']));

  upcsAsList = upcsAsList.map(upc => upc.length === 11 ? `0${upc}` : upc);

  let dataResults = [];
  console.time("TEST GET ALBUM");
  let index = 0;

  for (const upc of upcsAsList) {

    let albumResponse = await getAlbumByFieldValue(upc);

    if (!albumResponse || albumResponse.data === "NOT_EXISTS") {
      albumResponse = await getAlbumByFieldValue(`0${upc}`);
      if (!albumResponse || albumResponse.data === "NOT_EXISTS") {
        dataResults.push({ upc, requesitToPublish: "NOT_FOUNDED" });
        continue;
      }
    }

    let albumFugaId = albumResponse.data[0].id;
    let albumByIdResponse = {};
    if (albumFugaId) {
      albumByIdResponse = await getAlbumById(albumResponse.data[0].id).catch(error => {
        dataResults.push({ upc, requesitToPublish: "NOT_FOUNDED" });
        return;
      });
    }
    if (!albumByIdResponse || albumByIdResponse.data === "NOT_EXISTS") dataResults.push({ upc, requesitToPublish: "NOT_FOUNDED" });

    let album = albumByIdResponse.data;
    let validationRules = [];

    if (album.state === "PENDING") {
      rules = album?.validation_rules?.publish;
      rules.items.forEach(rule => validationRules.push(rule.message)) || "";
      console.log("VALIDATION RULES: ", validationRules);
      if (validationRules === "" || validationRules.length === 0) {
        if (rules.assets === 0) validationRules = "READY TO APPROVE";
        else validationRules = "ERROR SIN RECONOCER: Tal vez falta AUDIO"
      }
    }
    dataResults.push(createAlbumAnalisisRow(album, albumsFromWp[index], validationRules));
    index++;
    console.log("YA PROCESADOS: ", index);
    console.log("Falta en minutos APROX: ", ((upcsAsList.length - index) * 2.5) / 60);
  }

  await csvWriterFsAlbumsNotDelivereds.writeRecords(dataResults);
  console.timeEnd("TEST GET ALBUM");
  return dataResults;
}



const createAlbumStatusRow = (fugaAlbum, appAlbum, result) => {
  return {
    upc: fugaAlbum.upc || appAlbum.upc,
    mainArtistFugaId: appAlbum.artistFugaId || fugaAlbum.artists[0].id,
    mainArtistAppId: appAlbum.artistId,
    artistName: appAlbum.nombreArtist || fugaAlbum.artists[0].name,
    albumAppId: appAlbum.id || "",
    ownerEmail: appAlbum.ownerEmail || "",
    albumFugaId: fugaAlbum.id || appAlbum.fugaId,
    result
  }
}

// createFSAlbumFromFugaAlbum = (albumFromFuga, ownerEmail, ownerId, artistId, nombreArtist)

const getExtraFields = (fsAlbum, fugaAlbum) => {
  return {
    extra_1: `Cantidad de Tracks total:${fugaAlbum.total_assets}`,
    extra_2: `Deliver to apple:migrated`,
    extra_3: `Id en la app del lanzamiento:${fsAlbum.id}`,
    extra_4: `Email en la app del user:${fsAlbum.ownerEmail}`,
    extra_5: `Id en la app del user:${fsAlbum.ownerId}`,
    extra_6: `Version App:MIGRATION`,
    extra_7: `Id en la app del Artista:${fsAlbum.artistId}`
  }
}

const getUserCredentialsFromArtist = async (artistFugaId, albumFromFuga) => {
  let addOwnerEmail = ""; let duplicateArtistInFuga = false;
  let [artistsFsResponse] = await getFsArtistsByField("fugaId", parseInt(artistFugaId));
  if (artistsFsResponse === "NOT_FOUNDED_FS_ARTIST") {
    [artistsFsResponse] = await getFsArtistsByField("name", albumFromFuga.artists[0].name);
    duplicateArtistInFuga = true;
  }
  if (artistsFsResponse === "NOT_FOUNDED_FS_ARTIST") return "NOT_FOUNDED_FS_ARTIST";

  if (!artistsFsResponse.ownerEmail || artistsFsResponse.ownerEmail.length === 0) {
    if (!artistsFsResponse.ownerId || artistsFsResponse.ownerId.length === 0) return "FOUNDED_FS_ARTIST_BUT_NOT_OWNER_ID";
    addOwnerEmail = await addOwnerEmailToArtist(artistsFsResponse.ownerId, artistsFsResponse.id);
    artistsFsResponse.ownerEmail = addOwnerEmail.ownerEmail;
  }
  return { ...artistsFsResponse, duplicateArtistInFuga };
}

const createFsAlbum = async albumFromFuga => {
  let createdFsAlbum = {};
  let artistFromFSResponse = await getUserCredentialsFromArtist(albumFromFuga.artists[0].id, albumFromFuga);
  if (artistFromFSResponse === "NOT_FOUNDED_FS_ARTIST") return createAlbumStatusRow(albumFromFuga, {}, "NOT_FOUNDED_FS_ARTIST");
  if (artistFromFSResponse === "FOUNDED_FS_ARTIST_BUT_NOT_OWNER_ID") return createAlbumStatusRow(albumFromFuga, {}, "FOUNDED_FS_ARTIST_BUT_NOT_OWNER_ID");

  let { ownerEmail, ownerId, id, duplicateArtistInFuga } = artistFromFSResponse;
  if (!ownerEmail || !ownerId || !id) return createAlbumStatusRow(albumFromFuga, createdFsAlbum, "NOT_FOUNDED_ARTISTS_CREDS");
  createdFsAlbum = createFSAlbumFromFugaAlbum(albumFromFuga, ownerEmail, ownerId, artistId = id);
  await updateAlbumWithId(albumFromFuga.id, getExtraFields(createdFsAlbum, albumFromFuga));
  await setFsAlbum(createdFsAlbum);
  return createAlbumStatusRow(albumFromFuga, createdFsAlbum, `CREATED_FS_ALBUM_AND_FUGA_EXTRA_FIELDS${duplicateArtistInFuga ? "_DUPLICATE_ARTIST_IN_FUGA" : ""}`);
}

const createFsAlbumFromNotMigrated = async albumFromCsv => {
  let createdFsAlbum = {};
  let albumFromFuga = await getAlbumById(albumFromCsv.albumFugaId);
  albumFromFuga = albumFromFuga.data;

  let userInFsResponse = await getUserInFSByEmail(albumFromCsv.ownerEmail.trim());
  if (!userInFsResponse.exist) return createAlbumStatusRow(albumFromFuga, createdFsAlbum, "NOT_FOUNDED_ARTIST");
  let userInFs = userInFsResponse.user;

  let artistFromFSResponse = await getUserCredentialsFromArtist(albumFromCsv.mainArtistFugaId, { artists: [{ name: albumFromCsv.artistName }] });
  if (artistFromFSResponse === "NOT_FOUNDED_FS_ARTIST") {
    artistFromFSResponse = await createFsArtistFromFugaArtist(albumFromCsv.mainArtistFugaId, albumFromCsv.ownerEmail.trim(), userInFs.id.trim());
    if (artistFromFSResponse === "FUGA_ARTIST_NOT_FOUNDED") return createAlbumStatusRow(albumFromFuga, createdFsAlbum, "NOT_FOUNDED_ARTIST_POST_CREATED");
  }

  let { ownerEmail, ownerId, id } = artistFromFSResponse;
  if (!ownerEmail || !ownerId || !id) return createAlbumStatusRow(albumFromFuga, createdFsAlbum, "NOT_FOUNDED_ARTISTS_CREDS");
  createdFsAlbum = createFSAlbumFromFugaAlbum(albumFromFuga, ownerEmail, ownerId, artistId = id);
  await updateAlbumWithId(albumFromCsv.albumFugaId, getExtraFields(createdFsAlbum, albumFromFuga));
  await setFsAlbum(createdFsAlbum);
  return createAlbumStatusRow(albumFromFuga, createdFsAlbum, `CREATED_FS_ALBUM_AND_FUGA_EXTRA_FIELDS`);
}


const reviewFsAlbum = async (albumFromFuga, albumFromFS) => {
  let result = "ALBUM_EXISTED";
  let artistFromFSResponse = await getUserCredentialsFromArtist(albumFromFuga.artists[0].id, albumFromFuga);
  if (artistFromFSResponse === "NOT_FOUNDED_FS_ARTIST") return createAlbumStatusRow(albumFromFuga, {}, "NOT_FOUNDED_FS_ARTIST");
  if (artistFromFSResponse === "FOUNDED_FS_ARTIST_BUT_NOT_OWNER_ID") return createAlbumStatusRow(albumFromFuga,
    { ownerEmail: artistFromFSResponse.ownerEmail, mainArtistAppId: artistFromFSResponse.id }, "FOUNDED_FS_ARTIST_BUT_NOT_OWNER_ID");

  let { ownerEmail, ownerId } = artistFromFSResponse;
  if (!ownerEmail || !ownerId) return createAlbumStatusRow(albumFromFuga, {
    ownerEmail, ownerId,
    mainArtistAppId: artistFromFSResponse.id
  }, "NOT_FOUNDED_ARTISTS_CREDS");

  if (ownerEmail !== albumFromFS.ownerEmail || ownerId !== albumFromFS.ownerId) {
    let needAppleRevision = albumFromFS.state === "DELIVERED_NEED_APPLE_REVISION";
    await setFsAlbum({ ...albumFromFS, ownerEmail, ownerId, state: needAppleRevision ? "DELIVERED_NEED_APPLE_REVISION" : "DELIVERED" });
    albumFromFS.ownerEmail = ownerEmail; albumFromFS.ownerId = ownerId;
    result = result + " | " + "NEEDED_USER_CREDENTIALS";
  }

  if (!(albumFromFS.state === "DELIVERED" || albumFromFS.state === "DELIVERED_NEED_APPLE_REVISION")) {
    await setFsAlbum({ ...albumFromFS, state: "DELIVERED" });
    result = result + " | " + "CHANGED_DELIVERY_STATE";
  }

  await updateAlbumWithId(albumFromFuga.id, getExtraFields(albumFromFS, albumFromFuga));
  return createAlbumStatusRow(albumFromFuga, albumFromFS, result);
}

const fugaAlbumsMigrationApproach = async () => {
  let totalAlbumTargets = 5106;
  let pageSize = 20; let pages = Math.ceil(totalAlbumTargets / pageSize);
  let albumStatus = "PUBLISHED";
  let pagesArray = [...Array(pages).keys()];
  let results = []; let index = 0;

  for (const page of pagesArray) {
    console.time(`TEST PAGINA: ${page}`);
    let albumsResponse = await getAllAlbums(`?page=${page}&page_size=${pageSize}&state=${albumStatus}&subresources=true`);
    let parallelMigration = albumsResponse.data.product.map(async albumFuga => {
      let [fsAlbumIfExists] = await getFsAlbumsByField("fugaId", albumFuga.id);

      if (fsAlbumIfExists === "NOT_FOUNDED_FS_ALBUM") results.push(await createFsAlbum(albumFuga));
      else results.push(await reviewFsAlbum(albumFuga, fsAlbumIfExists));

      index++;
      console.log("PROCESADO ALBUM: ", index, " / Fuga ID:  ", albumFuga.id);
    })

    await Promise.all(parallelMigration);
    console.timeEnd(`TEST PAGINA: ${page}`);
  }
  await csvWriterFugaApproachDelivered.writeRecords(results);
  return results;
}

const createAlbumsNotMigrated = async () => {
  let albumsNotMigrated = await getArrayElementsInFsFromCsv("migration/1.artistsMissing.csv");
  let results = [];

  let pageSize = 20; let pages = Math.ceil(albumsNotMigrated.length / pageSize);
  // let pageSize = 1; let pages = Math.ceil(1 / pageSize);
  let pagesArray = [...Array(pages).keys()];
  let index = 0;
  console.log("PAGES ARRAY: ", pagesArray);

  for (let page of pagesArray) {
    console.time(`TEST PAGINA: ${page}`);

    let parallelMigration = albumsNotMigrated.slice((page * pageSize), (page * pageSize) + pageSize,).map(async albumNotMigrated => {
      let [fsAlbumIfExists] = await getFsAlbumsByField("fugaId", parseInt(albumNotMigrated.albumFugaId));

      if (fsAlbumIfExists === "NOT_FOUNDED_FS_ALBUM") results.push(await createFsAlbumFromNotMigrated(albumNotMigrated));
      else results.push(createAlbumStatusRow({}, fsAlbumIfExists, "ALBUM_FS_ALREADY_CREATED"));

      index++;
      console.log("PROCESADO ALBUM: ", index, " / Fuga ID:  ", albumNotMigrated.albumFugaId, " / RESULT: ", results[index - 1]);
    })

    await Promise.all(parallelMigration);
    console.timeEnd(`TEST PAGINA: ${page}`);
  }
  await csvWriterFugaApproachDelivered.writeRecords(results);
  return results;
}

module.exports = {
  analizeAlbumsNotInDelivery, fugaAlbumsMigrationApproach,
  createAlbumsNotMigrated
}