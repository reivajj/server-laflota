const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');
const { v4: uuidv4 } = require('uuid');
const { getAccountingForTableView } = require('../../db/royalties');

const dbFS = admin.firestore();

//==============================================ACCOUNTING=====================================\\

const setAccountingDocFS = async accountingDocWithId => {
  await dbFS.collection("royaltiesAccounting").doc(accountingDocWithId.id).set(accountingDocWithId).catch(error => {
    return { created: "FAIL" }
  });
  return { created: "SUCCESS" };
}

const getAccountingByQueryFS = async (groupBy, fieldName, fieldValue) => {

}

const setAccountingByQueryFS = async (groupBy, fieldName, fieldValue) => {
  let accountingRowsFromDB = await getAccountingForTableView(groupBy, fieldName, fieldValue);
  let accountingDoc = { id: `accounting-all-${groupBy}`, rows: accountingRowsFromDB };
  let resultWrittingFS = await setAccountingDocFS(accountingDoc);
  return resultWrittingFS;
}

module.exports = { getAccountingByQueryFS, setAccountingByQueryFS };