const db = require("../loaders/sequelize");
const sequelize = require("sequelize");
const { Op, Sequelize } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

const getPayoutsByQueryDB = async (limit, offset, orderClause, whereClause) => {
  const payoutsArray = await db.Payout.findAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: sequelize.literal(orderClause)
  },
    { raw: true });
  if (!payoutsArray) return "Error buscando los pagos.";

  let total = await db.Payout.count({ where: whereClause });

  return { total, payouts: payoutsArray };
}

const getPayoutsByGroupByAndOpsDB = async (orderClause, whereClause, groupByClause, opsArray, attributesNoOps) => {
  let opClauseAsArrays = opsArray.map(opClause => [sequelize.fn(opClause.op, sequelize.col(opClause.field)), opClause.name]);
  let attributesToReturn = [...attributesNoOps.map(att => att.name), ...opClauseAsArrays];

  console.log("ATT TO RETURN: ", attributesToReturn);

  const payoutsArray = await db.Payout.findAll({
    where: whereClause,
    attributes: attributesToReturn,
    group: groupByClause,
    order: sequelize.literal(orderClause),
    raw: true
  });
  if (!payoutsArray) return "Error buscando los pagos.";

  return payoutsArray;
}

const getPayoutsSumToFixPayouts = async (atDate, userEmail) => {
  const payoutsArray = await db.Payout.findOne({
    where: {
      requestDate: { [Op.lte]: atDate },
      ownerEmail: userEmail
    },
    attributes: [[sequelize.fn('SUM', sequelize.col('transferTotalUsd')), 'total']],
    raw: true
  });
  if (!payoutsArray) return "Error buscando los pagos.";
  return payoutsArray.total;
}

const getPayoutsToFixDatePayouts = async () => {
  const payoutsArray = await db.Payout.findAll({
    where: { transferDate: '0000-00-00' },
    attributes: ['id', 'requestDate'],
    raw: true
  });
  if (!payoutsArray) return "Error buscando los pagos.";

  return payoutsArray;
}



const getLastPayoutForUserDB = async ownerEmail => {
  const lastPayout = await db.Payout.findOne({
    where: { 'ownerEmail': ownerEmail },
    order: [['requestDate', 'DESC']]
  },
    { raw: true });

  return lastPayout;
}

const createPayoutDB = async payoutRecord => {
  let payoutWithId = payoutRecord.id === "" ? { id: uuidv4(), ...payoutRecord } : payoutRecord;
  const newPayout = await db.Payout.create(payoutWithId);
  return newPayout;
}

const updatePayoutDB = async (newValuesPayout, payoutId) => {
  const newPayout = await db.Payout.update({ ...newValuesPayout }, { where: { id: payoutId } });
  return newPayout;
}

const deletePayoutDB = async payoutId => {
  const destroyResponse = await db.Payout.destroy({ where: { id: payoutId } });
  return destroyResponse;
}

//=======================================================MIGRATE=======================================\\

const loadPayoutsFromArrayDB = async payoutsArray => {
  const createOptions = { logging: false, benchmark: true, ignoreDuplicates: true }
  payoutsCreatedInDB = await db.Payout.bulkCreate(payoutsArray, createOptions);

  return payoutsCreatedInDB;
}

//=======================================OLDS===========================================\\
// const getPayoutsByQueryDgDB = async (limit, offset, whereClause) => {
//   const payoutsArray = await db.RegaliasDgPayouts.findAll({
//     limit: limit,
//     offset: offset,
//     order: sequelize.literal('request_date DESC')
//   },
//     { raw: true });
//   if (!payoutsArray) return "Error buscando los pagos.";

//   return payoutsArray;
// }

module.exports = {
  loadPayoutsFromArrayDB, getPayoutsByQueryDB, getPayoutsByGroupByAndOpsDB, getLastPayoutForUserDB,
  createPayoutDB, updatePayoutDB, deletePayoutDB, getPayoutsToFixDatePayouts, getPayoutsSumToFixPayouts
}