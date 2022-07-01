const { loadPayoutsFromArrayDB, getPayoutsDB, getPayoutsByQueryDB, getPayoutsByGroupByAndOpsDB } = require("../../db/payouts");
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

//================================================MIGRATE==============================================\\
const migratePayoutFromFS = async () => {
  let payoutsElements = await getPayoutsFromFS();
  payoutsElements = payoutsElements.map(pyElem => mapFsPayoutToDB(pyElem));
  let writeInDbResult = await loadPayoutsFromArrayDB(payoutsElements);
  return `SUCCESS CREATED ${writeInDbResult.length} PAYOUTS`;
}

module.exports = { migratePayoutFromFS, getPayoutsByQuery, getPayoutsAndGroupByAndOps }