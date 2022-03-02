const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');
const { attachTrackAssetInAlbumWithId } = require('../../services/providers/albums');

const dbFS = admin.firestore();

const getTracksByPropFS = async searchFieldAndValue => {
  let tracksSnap = await dbFS.collection('tracks').where(searchFieldAndValue.field, "==", searchFieldAndValue.value).limit(10).get();
  if (!tracksSnap) return "ERROR";
  if (tracksSnap.empty) return "EMPTY";
  return tracksSnap.docs.map(trackDoc => trackDoc.data());
}

const attachTracksToAlbumFS = async albumFugaId => {
  let tracksInFS = await getTracksByPropFS({ field: "albumFugaId", value: Number(albumFugaId) });
  if (tracksInFS === "ERROR") return "ERROR";
  if (tracksInFS === "EMPTY") return "EMPTY";

  let tracksCleaned = tracksInFS.map(t => { return { fugaId: t.fugaId, sequence: t.position } });
  let sortedTracks = tracksCleaned.sort((tA, tB) => {
    if (tA.sequence < tB.sequence) return -1;
    else return 1;
  })

  let responses = [];
  for (const track of sortedTracks) {
    const attachResponse = await attachTrackAssetInAlbumWithId(albumFugaId, track.fugaId);
    responses.push(attachResponse.data.sequence);
  }
  return responses;
}

module.exports = { getTracksByPropFS, attachTracksToAlbumFS }