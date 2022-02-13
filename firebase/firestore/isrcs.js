const admin = require('firebase-admin');
const { readISRCsCsv } = require('../../csv/csvActions');
const firebaseApp = require('../../loaders/firebase');
const { batchActions } = require('../utils');

// Firebase App lo necesito aca..
const dbFS = admin.firestore();

const createISRCsBatchInFS = async csvFileName => {
  const isrcsFromCSV = await readISRCsCsv(csvFileName);
  // const elementsSliced = isrcsFromCSV.slice(0,10);
  const batchSize = 100;

  const docRefs = [];
  isrcsFromCSV.forEach(elem =>  docRefs.push(dbFS.collection("isrcs").doc(elem.id)));

  const result = await batchActions(docRefs, "set", isrcsFromCSV, "totalIsrcs", "isrcs", batchSize);
  return result;
}

const deleteISRCsBatchInFS = async csvFileName => {
  const isrcsFromCSV = await readISRCsCsv(csvFileName);
  // const elementsSliced = isrcsFromCSV.slice(0,10);
  const batchSize = 200;

  const docRefs = [];
  elementsSliced.forEach(elem =>  docRefs.push(dbFS.collection("isrcs").doc(elem.id)));

  const result = await batchActions(docRefs, "delete", elementsSliced, "totalIsrcs", "isrcs", batchSize);
  return result;
}


module.exports = { createISRCsBatchInFS, deleteISRCsBatchInFS };