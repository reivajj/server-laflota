const admin = require('firebase-admin');
const { readISRCsCsv } = require('../../csv/csvActions');
const firebaseApp = require('../../loaders/firebase');
const { batchActions } = require('../utils');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');

const isrcNamespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';

// Firebase App lo necesito aca..
const dbFS = admin.firestore();

const createISRCsBatchInFS = async csvFileName => {
  const isrcsFromCSV = await readISRCsCsv(csvFileName);
  // const elementsSliced = isrcsFromCSV.slice(0,10);
  const batchSize = 100;

  const docRefs = [];
  isrcsFromCSV.forEach(elem => docRefs.push(dbFS.collection("isrcs").doc(elem.id)));

  const result = await batchActions(docRefs, "set", isrcsFromCSV, "totalIsrcs", "isrcs", batchSize);
  return result;
}

const createCapifIsrcs = async (initNumber, cant) => {
  let isrcs = [];
  for (let index = Number(initNumber); Number(index) < Number(initNumber) + Number(cant); Number(index++)) {
    let indexToFiveDigits = index.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false });
    let isrc = `AR-QIW-22-${indexToFiveDigits}`;
    const capifIsrc = { procedence: "CAPIF", isrc, used: false, id: uuidv5(isrc, isrcNamespace) };
    isrcs.push(capifIsrc);
  }

  const batchSize = 300;
  const docRefs = [];
  isrcs.forEach(elem => docRefs.push(dbFS.collection("isrcs").doc(elem.id)));

  const result = await batchActions(docRefs, "set", isrcs, "totalIsrcs", "isrcs", batchSize);
  const updateStats = await dbFS.collection("isrcs").doc('stats').update({
    totalIsrcs: admin.firestore.FieldValue.increment(cant),
    totalIsrcsFromCAPIF: admin.firestore.FieldValue.increment(cant)
  })

  return { result, updateStats };
}

const deleteISRCsBatchInFS = async csvFileName => {
  const isrcsFromCSV = await readISRCsCsv(csvFileName);
  // const elementsSliced = isrcsFromCSV.slice(0,10);
  const batchSize = 200;

  const docRefs = [];
  isrcsFromCSV.forEach(elem => docRefs.push(dbFS.collection("isrcs").doc(elem.id)));

  const result = await batchActions(docRefs, "delete", isrcsFromCSV, "totalIsrcs", "isrcs", batchSize);
  return result;
}

const getCapifISRCs = async () => {
  let isrcsSnap = await dbFS.collection('isrcs').where('procedence', "==", "CAPIF").limit(10).get();
  if (!isrcsSnap || isrcsSnap.empty) return "No encontramos el ISRC o hubo un error";
  return isrcsSnap.docs.map(isrcDoc => isrcDoc.data());
}

const updateISRCsInFS = async (isrcsToUpdate, newValues) => {
  let docRefs = [];
  let updateWith = [];
  const batchSize = 200;

  isrcsToUpdate.forEach(_ => updateWith.push(newValues));
  isrcsToUpdate.forEach(isrc => docRefs.push(dbFS.collection("isrcs").doc(uuidv5(isrc, isrcNamespace))));

  const result = await batchActions(docRefs, "update", updateWith, "totalIsrcs", "isrcs", batchSize);
  return result;
}

const getIsrcDocByIsrcCodeFS = async isrcCode => {
  let isrcsSnap = await dbFS.collection('isrcs').where('isrc', "==", isrcCode).get();
  if (!isrcsSnap || isrcsSnap.empty) return "No encontramos el ISRC o hubo un error";
  return isrcsSnap.docs.map(isrcDoc => isrcDoc.data());
}

const getIsrcByUsesStateAndLimitFS = async instructionsAndLimit => {
  const { used, limit } = instructionsAndLimit;
  let isrcsSnap = await dbFS.collection('isrcs').where('used', "==", used).orderBy("isrc", "asc").limit(limit).get();
  if (isrcsSnap.empty) return `No encontre ISRC que esten con used:${used}`;

  return isrcsSnap.docs.map(isrcDoc => isrcDoc.data().isrc);
}

const getNotUsedIsrcAndMark = async limit => {
  let isrcsSnap = await dbFS.collection('isrcs').where('used', "==", false).orderBy("isrc", "asc").limit(limit).get();
  if (isrcsSnap.empty) return `No encontre ISRC que no esten usados`;

  let isrcs = [];
  for (isrcDoc of isrcsSnap.docs) {
    isrcs.push(isrcDoc.data().isrc);
    await isrcDoc.ref.update({ used: true });
  }
  return isrcs;
}

module.exports = {
  createISRCsBatchInFS, deleteISRCsBatchInFS, updateISRCsInFS, getIsrcByUsesStateAndLimitFS, getIsrcDocByIsrcCodeFS,
  createCapifIsrcs, getCapifISRCs, getNotUsedIsrcAndMark
};