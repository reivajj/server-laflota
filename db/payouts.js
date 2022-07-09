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
  
  const payoutsArray = await db.Payout.findAll({
    where: whereClause,
    attributes: attributesToReturn,
    group: groupByClause,
    order: sequelize.literal(orderClause)
  },
    { raw: true });
  if (!payoutsArray) return "Error buscando los pagos.";

  return payoutsArray;
}

const getLastPayoutForUserDB = async ownerEmail => {
  const lastPayout = await db.Payout.findOne({
    where: { 'ownerEmail': ownerEmail },
    order: [['transferDate', 'DESC']]
  },
    { raw: true });

  return lastPayout;
}

const createPayoutDB = async payoutRecord => {
  let payoutWithId = payoutRecord.id === "" ? { id: uuidv4(), ...payoutRecord } : payoutRecord;
  const newPayout = await db.Payout.create(payoutWithId);
  return newPayout;
}

const updatePayoutDB = async newValuesPayout => {
  const newPayout = await db.Payout.update({ ...payoutRecord });
  return newPayout;
}

const deletePayoutDB = async payoutId => {
  const destroyResponse = await db.Payout.delete({ where: { id: payoutId } });
  return destroyResponse;
}

//=======================================================MIGRATE=======================================\\

const loadPayoutsFromArrayDB = async payoutsArray => {

  const createOptions = { logging: false, benchmark: true, ignoreDuplicates: true }
  payoutsCreatedInDB = await db.Payout.bulkCreate(payoutsArray, createOptions);

  return payoutsCreatedInDB;
}

module.exports = {
  loadPayoutsFromArrayDB, getPayoutsByQueryDB, getPayoutsByGroupByAndOpsDB, getLastPayoutForUserDB,
  createPayoutDB, updatePayoutDB, deletePayoutDB
}