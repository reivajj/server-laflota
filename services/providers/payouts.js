const { loadPayoutsFromArrayDB, getPayoutsDB, getPayoutsByQueryDB, getPayoutsByGroupByAndOpsDB,
  getLastPayoutForUserDB, updatePayoutDB, createPayoutDB, deletePayoutDB, getPayoutsToFixDatePayouts, getPayoutsSumToFixPayouts } = require("../../db/payouts");
const { getPayoutsFromFS, createPayoutFS, deletePayoutFS, updatePayoutFS } = require("../../firebase/firestore/payouts");
const { sendRoyaltiesNotification } = require("../../mailing/payouts");
const { mapDgPayoutFromDBToDB } = require("../../models/payouts");

//================================================CRUD=================================================\\

const getPayoutsByQuery = async (limit, offset, order, whereClause) => {
  let orderClause = order.split('.').length === 2 ? `${order.split('.')[0]} ${order.split('.')[1]}` : "";
  let payoutsFilteredAndTotal = await getPayoutsByQueryDB(parseInt(limit), parseInt(offset), orderClause
    , whereClause ? JSON.parse(whereClause) : {});
  return payoutsFilteredAndTotal;
}

const getPayoutsAccounting = async (order, whereClause, groupByClause, opsArrayClause, attributesArrayClause) => {
  let accWithOutPending = await getPayoutsAndGroupByAndOps(order, whereClause, groupByClause, opsArrayClause, attributesArrayClause);
  let accOnlyPending = await getPayoutsAndGroupByAndOps(order, JSON.stringify({ ...JSON.parse(whereClause), status: "REQUESTED" })
    , groupByClause, opsArrayClause, attributesArrayClause);
  return { accWithOutPending, accOnlyPending };
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
const migrateDKPayoutsFromDB = async () => {
  let payoutsElements = await getPayoutsByQuery(100, 0, 'requestDate.DESC', JSON.stringify({ status: 'Migrated DK' }));
  let result = payoutsElements.payouts.map(pyElem => {
    let elem = { ...pyElem.dataValues };
    elem.lastUpdateTS = new Date(elem.requestDate !== '0000-00-00' ? elem.requestDate : elem.transferDate).getTime() || 0;
    return elem;
  });
  let writeInDbResult = await loadPayoutsFromArrayDB(result);
  return { status: `SUCCESS CREATED ${writeInDbResult.length} PAYOUTS`, result };
}

// const migrateDGPayoutsFromDB = async () => {
//   let payoutsElements = await getPayoutsByQueryDgDB(1000, 0);
//   let results = []; let index = 0;

//   for (const payout of payoutsElements) {
//     let payoutMapped = await mapDgPayoutFromDBToDB(payout.dataValues);
//     results.push(payoutMapped);
//     index++;
//     console.log("MIGRADO PAYOUT: ", index);
//   }

//   let writeInDbResult = await loadPayoutsFromArrayDB(results);
//   return `SUCCESS CREATED ${0} PAYOUTS`;
// }

const fixPayoutsFromDB = async () => {
  let allPayouts = await getPayoutsByQueryDB(1000, 0, 'requestDate ASC', {});

  let results = []; let index = 0;

  for (const payout of allPayouts.payouts) {
    let sumAtDate = await getPayoutsSumToFixPayouts(payout.requestDate, payout.ownerEmail);
    sumAtDate = parseFloat(sumAtDate.toFixed(2));
    let resultUpdate = await updatePayoutDB({ historicTotalUsd: sumAtDate, alreadyPaidUsd: sumAtDate }, payout.id);
    results.push(resultUpdate);
    index++;
    console.log(index)
  }

  return results;
}



module.exports = {
  getPayoutsByQuery, getPayoutsAndGroupByAndOps, getTotalPayedPayouts,
  createPayout, updatePayout, deletePayout, migrateDKPayoutsFromDB,
  fixPayoutsFromDB, getPayoutsAccounting
}