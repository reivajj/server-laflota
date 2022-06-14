const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");
const sequelize = require("sequelize");
const { readRoyaltiesFromCsvAndMapToDB } = require("../csv/royalties");

const companyTableNameInDB = {
  "dashgo": "RegaliasDashgo",
  "fuga": "RoyaltyFuga",
  "distroKid": "RoyaltyDK"
}

const royaltiesFieldsToSentToFrontEnd = ["saleId", "upc", "saleStartDate", "dsp", "saleUserType",
  "territory", "releaseArtist", "releaseTitle", "assetTitle",
  "isrc", "assetOrReleaseSale", "assetQuantity", "originalRevenue",
  "netRevenue", "netRevenueCurrency"]

const getRoyaltiesByQuery = async (companyName, fieldName, fieldValue, limit, offset) => {
  const filteredRoyalties = await db[companyTableNameInDB[companyName]].findAll({
    where: { [fieldName]: fieldValue },
    limit: limit,
    offset: offset,
    attributes: royaltiesFieldsToSentToFrontEnd
  },
    { raw: true });
  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

const getRoyaltiesByQueryWithOp = async (companyName, fieldName, fieldValue, fieldToSum) => {
  const filteredRoyalties = await db[companyTableNameInDB[companyName]].findAll({
    where: fieldValue ? { [fieldName]: fieldValue } : {},
    attributes: [fieldName, [sequelize.fn('sum', sequelize.col(fieldToSum)), 'count']],
    group: [`${companyTableNameInDB[companyName]}.${fieldName}`],
    raw: true,
    order: sequelize.literal('count DESC')
  })

  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

const getRoyaltiesByDspsWithOp = async (companyName, fieldName, fieldValue, fieldToSum, groupByArray) => {
  let groupClause = "";
  let attributesClause = [[sequelize.fn('sum', sequelize.col(fieldToSum)), 'totalSum']];
  console.log("GR: ", groupByArray)
  if (groupByArray.length > 0) {
    console.log("ENTRO AL IF")
    groupClause = groupByArray.map(groupByField => `${companyTableNameInDB[companyName]}.${groupByField}`);
    attributesClause.push([...groupByArray.map(groupByField => groupByField)]);
  }
  console.log("AT: ", attributesClause)
  const filteredRoyalties = await db[companyTableNameInDB[companyName]].findAll({
    where: fieldValue ? { [fieldName]: fieldValue } : {},
    attributes: attributesClause,
    group: groupClause,
    raw: true,
    order: sequelize.literal('totalSum DESC')
  })

  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

const loadRoyaltiesFromLocalCSV = async (companyName, csvPath) => {
  let mappedValuesFromCsv = await readRoyaltiesFromCsvAndMapToDB(companyName, csvPath);
  const createOptions = { logging: true, benchmark: true, ignoreDuplicates: true }
  const royaltiesCreatedInDB = await db.RoyaltyFuga.bulkCreate(mappedValuesFromCsv, createOptions);

  return `SUCCES UPLOADED ${royaltiesCreatedInDB.length} ROYALTIES`;
}

module.exports = { getRoyaltiesByQuery, getRoyaltiesByQueryWithOp, getRoyaltiesByDspsWithOp, loadRoyaltiesFromLocalCSV };