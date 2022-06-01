const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');
const { createFSAlbumFromFugaAlbum } = require('../../models/albums');
const { getAlbumById } = require('../../services/providers/albums');

const dbFS = admin.firestore();

const setFsAlbum = async fsAlbum => {
  await dbFS.collection("albums").doc(fsAlbum.id).set(fsAlbum);
}

const getFsAlbumsByField = async (fieldName, fieldValue) => {
  let fsAlbumSnap = await dbFS.collection("albums").where(fieldName, "in", [fieldValue.toString(), fieldValue]).get();
  if (!fsAlbumSnap || fsAlbumSnap.empty) return ["NOT_FOUNDED_FS_ALBUM"];
  return fsAlbumSnap.docs.map(albumDoc => albumDoc.data());
}

const addAlbumFromFugaToFSUser = async (albumFugaId, userEmail, userId, artistId, nombreArtist) => {
  let albumFromFuga = await getAlbumById(albumFugaId);
  let fsAlbumToCreate = createFSAlbumFromFugaAlbum(albumFromFuga.data, userEmail, userId, artistId, nombreArtist);
  await dbFS.collection("albums").doc(fsAlbumToCreate.id).set(fsAlbumToCreate);
  return { created: "SUCCESS" };
}

module.exports = { addAlbumFromFugaToFSUser, getFsAlbumsByField, setFsAlbum }