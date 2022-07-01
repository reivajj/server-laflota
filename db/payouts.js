const db = require("../loaders/sequelize");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

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

//=======================================================MIGRATE=======================================\\

const loadPayoutsFromArrayDB = async payoutsArray => {

  const createOptions = { logging: false, benchmark: true, ignoreDuplicates: true }
  payoutsCreatedInDB = await db.Payout.bulkCreate(payoutsArray, createOptions);

  return payoutsCreatedInDB;
}

module.exports = { loadPayoutsFromArrayDB, getPayoutsByQueryDB, getPayoutsByGroupByAndOpsDB }