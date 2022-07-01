const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');

const { readPayoutFromCsvAndMapToFS } = require("../../csv/royalties");
const { getUserInFSByEmail } = require('./user');

const dbFS = admin.firestore();

const createPayoutDocFS = async withdrawWithId => {
  await dbFS.collection("withdrawals").doc(withdrawWithId.id).set(withdrawWithId).catch(error => {
    console.log(error);
    return { created: "FAIL" }
  });
  return { created: "SUCCESS" };
}

const getPayoutsFromFS = async () => {
  let payoutsFsSnap = await dbFS.collection("withdrawals").get();
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
    let addUserEmail = mappedValuesFromCsv.slice(batch * batchSize, (batch + 1) * batchSize).map(async withdraw => {
      let userDoc = await getUserInFSByEmail(withdraw.userEmail.trim());
      withdraw.userId = userDoc.exist ? userDoc.user.id : "NOT FOUNDED";
      let createResult = await createPayoutDocFS(withdraw);
      if (createResult.created !== "SUCCESS") return false;
      rowsCompleted++;
    })
    await Promise.all(addUserEmail);
    console.log("Rows Completed: ", rowsCompleted);
  }

  // return `SUCCES UPLOADED ${rowsAdded} ROYALTIES`;
  return mappedValuesFromCsv;
}

module.exports = { loadPayoutsFromLocalCSV, getPayoutsFromFS }