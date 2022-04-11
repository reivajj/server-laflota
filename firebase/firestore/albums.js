const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');
const { createFSAlbumFromFugaAlbum } = require('../../models/albums');
const { getAlbumById } = require('../../services/providers/albums');

const dbFS = admin.firestore();

const addAlbumFromFugaToFSUser = async (albumFugaId, userEmail, userId, artistId, nombreArtist) => {
  let albumFromFuga = await getAlbumById(albumFugaId);
  let fsAlbumToCreate = createFSAlbumFromFugaAlbum(albumFromFuga.data, userEmail, userId, artistId, nombreArtist);
  await dbFS.collection("albums").doc(fsAlbumToCreate.id).set(fsAlbumToCreate);
  return { created: "SUCCESS" };
}

module.exports = { addAlbumFromFugaToFSUser }