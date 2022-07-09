const { loadPayoutsFromArrayDB, getPayoutsDB, getPayoutsByQueryDB, getPayoutsByGroupByAndOpsDB, getLastPayoutForUserDB, updatePayoutDB, createPayoutDB, deletePayoutDB } = require("../../db/payouts");
const { getPayoutsFromFS } = require("../../firebase/firestore/payouts");
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

const createPayout = async payoutRecord => {
  let newPayout = await createPayoutDB(payoutRecord);
  return newPayout;
}

const updatePayout = async payoutRecord => {
  let newPayout = await updatePayoutDB(payoutRecord);
  return newPayout;
}

const deletePayout = async payoutId => {
  let deleteDbResponse = await deletePayoutDB(payoutId);
  return deleteDbResponse;
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