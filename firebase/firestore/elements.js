const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');

const dbFS = admin.firestore();

const deleteElementFromFS = async (targetCollection, targetElementId) => {
  let elementDeleteResponse = await dbFS.collection(targetCollection).doc(targetElementId).delete();
  console.log("Element delete response: ", elementDeleteResponse);
  return { deleted: "SUCCESS", collection: targetCollection, element: targetElementId };
}

const getElementFromFS = async (targetCollection, targetElementId) => {
  let elementGetSnap = await dbFS.collection(targetCollection).doc(targetElementId).get();
  if (!elementGetSnap.exists) return "ELEMENT NOT EXISTS"
  return { getted: "SUCCESS", collection: targetCollection, element: targetElementId };
}

module.exports = { deleteElementFromFS, getElementFromFS }