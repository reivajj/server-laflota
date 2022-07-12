const { loadPayoutsFromArrayDB, getPayoutsDB, getPayoutsByQueryDB, getPayoutsByGroupByAndOpsDB,
  getLastPayoutForUserDB, updatePayoutDB, createPayoutDB, deletePayoutDB } = require("../../db/payouts");
const { getPayoutsFromFS, createPayoutFS, deletePayoutFS, updatePayoutFS } = require("../../firebase/firestore/payouts");
const { sendRoyaltiesNotification } = require("../../mailing/payouts");
const { mapFsPayoutToDB } = require("../../models/payouts");

//================================================CRUD=================================================\\

const getPayoutsByQuery = async (limit, offset, order, whereClause) => {
  let orderClause = order.split('.').length === 2 ? `${order.split('.')[0]} ${order.split('.')[1]}` : "";
  let payoutsFilteredAndTotal = await getPayoutsByQueryDB(parseInt(limit), parseInt(offset), orderClause
    , whereClause ? JSON.parse(whereClause) : {});
  return payoutsFilteredAndTotal;
}

const getPayoutsAndGroupByAndOps = async (order, whereClause, groupByClause, opsArrayClause, attributesArrayClause) => {
  let orderClause = order.split('.').length === 2 ? `${order.split('.')[0]} ${order.split('.')[1]}` : "";
  let payoutsFilteredAndTotal = await getPayoutsByGroupByAndOpsDB(orderClause, whereClause ? JSON.parse(whereClause) : {}
    , groupByClause, opsArrayClause ? JSON.parse(opsArrayClause) : [], attributesArrayClause ? JSON.parse(attributesArrayClause) : []);
  return payoutsFilteredAndTotal;
}

const getTotalPayedPayouts = async ownerEmail => {
  let lastPayout = await getLastPayoutForUserDB(ownerEmail);
  return lastPayout;
}

const createPayout = async (payoutRecord, sendNotification) => {
  let newPayoutDB = await createPayoutDB(payoutRecord);
  let newPayoutFS = await createPayoutFS(payoutRecord);
  if (newPayoutFS.created !== "SUCCESS") return { created: false };
  let responseNotification = sendNotification ? await sendRoyaltiesNotification(payoutRecord, "requested") : "";
  return newPayoutDB;
}

const updatePayout = async (payoutRecord, sendNotification) => {
  let newPayoutDB = await updatePayoutDB(payoutRecord, payoutRecord.id);
  let newPayoutFS = await updatePayoutFS(payoutRecord, payoutRecord.id);
  if (newPayoutFS.updated !== "SUCCESS") return { created: false };
  let responseNotification = sendNotification ? await sendRoyaltiesNotification(payoutRecord, "payed") : "";
  return "SUCCESS";
}


const deletePayout = async payoutId => {
  let deleteDbResponse = await deletePayoutDB(payoutId);
  let deleteFsResponse = await deletePayoutFS(payoutId);
  return deleteFsResponse;
}

//================================================MIGRATE==============================================\\
const migratePayoutFromFS = async () => {
  let payoutsElements = await getPayoutsFromFS();
  payoutsElements = payoutsElements.map(pyElem => mapFsPayoutToDB(pyElem));
  let writeInDbResult = await loadPayoutsFromArrayDB(payoutsElements);
  return `SUCCESS CREATED ${writeInDbResult.length} PAYOUTS`;
}

module.exports = {
  migratePayoutFromFS, getPayoutsByQuery, getPayoutsAndGroupByAndOps, getTotalPayedPayouts,
  createPayout, updatePayout, deletePayout
}