const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");
const sequelize = require("sequelize");

const getDashGoRoyaltiesQuery = async (fieldName, fieldValue) => {
  const filteredRoyalties = await db.RegaliasDashgo.findAll({ where: { [fieldName]: fieldValue } }, { raw: true });
  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

const getDashGoRoyaltiesQueryCount = async (fieldName, fieldValue) => {
  // const filteredRoyalties = await db.RegaliasDashgo.findAll({ where: { [fieldName]: fieldValue } }, { raw: true });
  const filteredRoyalties = await db.RegaliasDashgo.findAll({
    where: { [fieldName]: fieldValue },
    attributes: [fieldName, [sequelize.fn('count', sequelize.col(fieldName)), 'count']],
    group: [`RegaliasDashgo.${fieldName}`],
    raw: true,
    order: sequelize.literal('count DESC')
  })

  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

module.exports = { getDashGoRoyaltiesQuery, getDashGoRoyaltiesQueryCount };