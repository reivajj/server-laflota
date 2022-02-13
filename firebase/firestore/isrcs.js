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

const deleteISRCsBatchInFS = async csvFileName => {
  const isrcsFromCSV = await readISRCsCsv(csvFileName);
  // const elementsSliced = isrcsFromCSV.slice(0,10);
  const batchSize = 200;

  const docRefs = [];
  isrcsFromCSV.forEach(elem => docRefs.push(dbFS.collection("isrcs").doc(elem.id)));

  const result = await batchActions(docRefs, "delete", isrcsFromCSV, "totalIsrcs", "isrcs", batchSize);
  return result;
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

module.exports = { createISRCsBatchInFS, deleteISRCsBatchInFS, updateISRCsInFS };