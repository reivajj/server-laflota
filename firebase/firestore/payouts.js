const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');

const { readPayoutFromCsvAndMapToFS } = require("../../csv/royalties");
const { getUserInFSByEmail } = require('./user');

const dbFS = admin.firestore();

const createPayoutDocFS = async payoutWithId => {
  await dbFS.collection("payouts").doc(payoutWithId.id).set(payoutWithId).catch(error => {
    console.log(error);
    return { created: "FAIL" }
  });
  return { created: "SUCCESS" };
}

const getPayoutsFromFS = async () => {
  let payoutsFsSnap = await dbFS.collection("payouts").get();
  if (payoutsFsSnap.empty) return "EMPTY";
  let payoutsElements = [];
  payoutsFsSnap.forEach(pyDoc => payoutsElements.push(pyDoc.data()));
  return payoutsElements;
}

const getPayoutsFromFSByOwnerId = async ownerId => {
  let payoutsFsSnap = await dbFS.collection("payouts").where('ownerId', "==", ownerId).get();
  if (payoutsFsSnap.empty) return "EMPTY";
  let payoutsElements = [];
  payoutsFsSnap.forEach(pyDoc => payoutsElements.push(pyDoc.data()));
  return payoutsElements;
}

const loadPayoutsFromLocalCSV = async (companyName, csvPath) => {
  let mappedValuesFromCsv = await readPayoutFromCsvAndMapToFS(companyName, csvPath);

  let batchSize = 30;
  let batches = Math.ceil(mappedValuesFromCsv.length / batchSize);
  let batchesArray = [...Array(batches).keys()];
  console.log({ batches, batchesArray })
  let rowsCompleted = 0;

  for (const batch of batchesArray) {
    let addUserEmail = mappedValuesFromCsv.slice(batch * batchSize, (batch + 1) * batchSize).map(async payout => {
      let createResult = await createPayoutDocFS(payout);
      if (createResult.created !== "SUCCESS") return false;
      rowsCompleted++;
    })
    await Promise.all(addUserEmail);
    console.log("Rows Completed: ", rowsCompleted);
  }

  // return `SUCCES UPLOADED ${rowsAdded} ROYALTIES`;
  return mappedValuesFromCsv;
}

module.exports = { loadPayoutsFromLocalCSV, getPayoutsFromFS, getPayoutsFromFSByOwnerId }