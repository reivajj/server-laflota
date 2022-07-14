const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');

const { readPayoutFromCsvAndMapToFS } = require("../../csv/royalties");
const { getUserInFSByEmail } = require('./user');
const { deleteElementFromFS } = require('./elements');

const dbFS = admin.firestore();

const createPayoutFS = async payoutWithId => {
  let dbPayoutRow = {...payoutWithId};
  dbPayoutRow.historicTotalUsd = parseFloat(payoutWithId.historicTotalUsd);
  dbPayoutRow.alreadyPaidUsd = parseFloat(payoutWithId.alreadyPaidUsd);
  dbPayoutRow.currencyRateToUsd = parseFloat(payoutWithId.currencyRateToUsd);
  dbPayoutRow.transferTotalUsd = parseFloat(payoutWithId.transferTotalUsd);
  dbPayoutRow.transferTotalAskedCurrency = parseFloat(payoutWithId.transferTotalAskedCurrency);
  dbPayoutRow.comissionAskedCurrency = parseFloat(payoutWithId.comissionAskedCurrency);
  dbPayoutRow.payoneerFee = parseFloat(payoutWithId.payoneerFee);
  dbPayoutRow.paypalFee = parseFloat(payoutWithId.paypalFee);
  dbPayoutRow.taxesOtherCurrency = parseFloat(payoutWithId.taxesOtherCurrency);
  dbPayoutRow.taxesUsd = parseFloat(payoutWithId.taxesUsd);
  dbPayoutRow.comissionUsd = parseFloat(payoutWithId.comissionUsd);  
  
  await dbFS.collection("payouts").doc(payoutWithId.id).set(dbPayoutRow).catch(error => {
    console.log(error);
    return { created: "FAIL" }
  });
  return { created: "SUCCESS" };
}

const updatePayoutFS = async (payoutNewValues, payoutId) => {
  await dbFS.collection("payouts").doc(payoutId).update({ ...payoutNewValues }).catch(error => {
    console.log(error);
    return { updated: "FAIL" }
  });
  return { updated: "SUCCESS" };
}

const deletePayoutFS = async payoutId => {
  let deleteResult = await deleteElementFromFS("payouts", payoutId);
  return deleteResult.deleted;
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
      let createResult = await createPayoutFS(payout);
      if (createResult.created !== "SUCCESS") return false;
      rowsCompleted++;
    })
    await Promise.all(addUserEmail);
    console.log("Rows Completed: ", rowsCompleted);
  }

  // return `SUCCES UPLOADED ${rowsAdded} ROYALTIES`;
  return mappedValuesFromCsv;
}

module.exports = {
  loadPayoutsFromLocalCSV, getPayoutsFromFS, getPayoutsFromFSByOwnerId,
  createPayoutFS, deletePayoutFS, updatePayoutFS
}