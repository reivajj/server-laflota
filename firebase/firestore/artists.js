const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');
const { createIdentifiersFromFugaToFS } = require('../../models/artists');
const { getArtistIdentifierById, getArtistById } = require('../../services/providers/artists');
const { createArtistFsFromFuga } = require('../models/artist');

const dbFS = admin.firestore();

const createArtistFS = async artistWithId => {
  await dbFS.collection("artists").doc(artistWithId.id).set(artistWithId).catch(error => {
    console.log(error);
    return { created: "FAIL" }
  });
  return { created: "SUCCESS" };
}

const updateArtistFS = async (artistFsId, newFields) => {
  await dbFS.collection("artists").doc(artistFsId).update(newFields).catch(error => {
    console.log(error);
    return { created: "FAIL" }
  });
  return { created: "SUCCESS" };
}

const getFsArtistsByField = async (fieldName, fieldValue) => {
  let fsArtistSnap = await dbFS.collection("artists").where(fieldName, "in", [fieldValue.toString(), fieldValue])
    .get().catch(error => console.log(error));
  if (!fsArtistSnap || fsArtistSnap.empty) return ["NOT_FOUNDED_FS_ARTIST"];
  return fsArtistSnap.docs.map(albumDoc => albumDoc.data());
}

const addOwnerEmailToArtist = async (artistOwnerId, artistFsId) => {
  let artistToAddOwnerEmailRef = dbFS.collection("artists").doc(artistFsId);
  let ownerUserSnap = await dbFS.collection("users").doc(artistOwnerId).get();
  let ownerEmail = ownerUserSnap.exists ? ownerUserSnap.data().email : "";
  await artistToAddOwnerEmailRef.update({ ownerEmail });
  return { updated: "SUCCESS", ownerEmail };
}

const createFsArtistFromFugaArtist = async (artistFugaId, ownerEmail, ownerId) => {
  let artistFugaResponse = await getArtistById(artistFugaId);
  if (!artistFugaResponse || !artistFugaResponse.data || artistFugaResponse.data.status >= 400) return "FUGA_ARTIST_NOT_FOUNDED";
  let fsIdentifiers = await createFsArtistIdentifiersFromFuga(artistFugaId);
  let createdFsArtist = createArtistFsFromFuga(artistFugaResponse.data, fsIdentifiers, ownerEmail, ownerId);
  let setArtistResponse = await createArtistFS(createdFsArtist);
  if (setArtistResponse.created === "FAIL") return "FUGA_ARTIST_NOT_FOUNDED";
  return createdFsArtist;
}

const createFsArtistIdentifiersFromFuga = async artistFugaId => {
  const emptyIdentifiers = { spotifyIdentifierIdFuga: "", appleIdentifierIdFuga: "", spotify_uri: "", apple_id: "" };

  let artistIdentifiers = await getArtistIdentifierById(artistFugaId);
  artistIdentifiers = artistIdentifiers.data;

  if (!artistIdentifiers || artistIdentifiers.length === 0) return emptyIdentifiers;
  else return createIdentifiersFromFugaToFS(artistIdentifiers);
}

module.exports = {
  createArtistFS, getFsArtistsByField, addOwnerEmailToArtist, updateArtistFS,
  createFsArtistIdentifiersFromFuga, createFsArtistFromFugaArtist
}