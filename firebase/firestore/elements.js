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
  return { getted: "SUCCESS", collection: targetCollection, element: elementGetSnap.data() };
}

const editElementFromFS = async (targetCollection, targetElementId, newInfo) => {
  console.log("TS: ", new Date().getTime());
  let elementToUpdateDoc = dbFS.collection(targetCollection).doc(targetElementId);
  let oldElement = await elementToUpdateDoc.get();
  if (!oldElement.exists) return { updated: "ELEMENT_NOT_EXISTS" };
  await elementToUpdateDoc.update({ ...newInfo, lastUpdateTS: new Date().getTime() });
  let newElement = await elementToUpdateDoc.get();
  return { updated: "SUCCESS", collection: targetCollection, element: newElement.data() };
}

module.exports = { deleteElementFromFS, getElementFromFS, editElementFromFS }