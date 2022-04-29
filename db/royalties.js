const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");

const getDashGoRoyaltiesQuery = async (fieldName, fieldValue) => {
  const filteredRoyalties = await db.RegaliasDashgo.findAll({ where: { [fieldName]: fieldValue } }, { raw: true });
  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

module.exports = { getDashGoRoyaltiesQuery };