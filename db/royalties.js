const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");
const sequelize = require("sequelize");
const { readRoyaltiesFromCsvAndMapToDB } = require("../csv/royalties");
const { Op } = require("sequelize");

const companyTableNameInDB = {
  "dashgo": "RegaliasDashgo",
  "fuga": "Royalty",
  "distroKid": "RoyaltyDK"
}

const operationsToProps = (op, fieldOp, filterValue) => {
  if (op === "sum" && fieldOp === "assetQuantity") return "streams";
  if (op === "sum" && fieldOp === "netRevenue") return "revenues";
  if (op === "count" && fieldOp === "upc" && filterValue === "Download") return "downloads";
  return fieldOp + op;
}

const royaltiesFieldsToSentToFrontEnd = ["saleId", "upc", "saleStartDate", "saleEndDate", "dsp", "storeName", "saleUserType",
  "territory", "releaseArtist", "releaseTitle", "assetTitle", "saleType",
  "isrc", "assetOrReleaseSale", "assetQuantity", "originalRevenue",
  "netRevenue", "netRevenueCurrency", "distributor"]

const getRoyaltiesByQuery = async (companyName, fieldName, fieldValue, limit, offset) => {
  const filteredRoyalties = await db[companyTableNameInDB[companyName]].findAll({
    where: fieldValue.length > 0 ? { [fieldName]: fieldValue } : {},
    limit: limit,
    offset: offset,
    attributes: royaltiesFieldsToSentToFrontEnd,
    order: sequelize.literal('saleStartDate DESC')
  },
    { raw: true });
  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });

  let total = 0;
  total = fieldValue.length > 0
    ? await db[companyTableNameInDB[companyName]].count({ where: { [fieldName]: fieldValue } })
    : await db[companyTableNameInDB[companyName]].count();

  return { total, royalties: filteredRoyalties };
}

const getRoyaltiesGroupedWithOp = async (companyName, fieldName, fieldValue, op, fieldOp, groupByArray) => {
  let groupClause = ""; let operationToName = operationsToProps(op, fieldOp, fieldValue[0] || "");

  let whereClause = fieldValue.length > 0 ? { [fieldName]: fieldValue } : {};
  if (operationToName === "streams") whereClause = { ...whereClause, "saleType": { [Op.ne]: "Download" } };

  let attributesClause = [[sequelize.fn(op, sequelize.col(fieldOp)), operationToName]];

  if (groupByArray.length > 0) {
    groupClause = groupByArray.map(groupByField => `${companyTableNameInDB[companyName]}.${groupByField}`);
    attributesClause.push(...groupByArray.map(groupByField => groupByField));
  }

  const filteredRoyalties = await db[companyTableNameInDB[companyName]].findAll({
    where: whereClause,
    attributes: attributesClause,
    group: groupClause,
    raw: true,
    order: sequelize.literal(`${operationToName} DESC`)
  })

  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

const getDownloadsGroupedBy = async (companyName, fieldName, fieldValue, groupByArray) => {
  let groupClause = ""; let operationToName = operationsToProps('count', 'upc', "Download");
  let attributesClause = [[sequelize.fn('count', sequelize.col('upc')), operationToName]];
  let whereClause = fieldValue.length > 0 ? { [fieldName]: fieldValue } : {};

  if (groupByArray.length > 0) {
    groupClause = groupByArray.map(groupByField => `${companyTableNameInDB[companyName]}.${groupByField}`);
    attributesClause.push(...groupByArray.map(groupByField => groupByField));
  }

  const filteredRoyalties = await db[companyTableNameInDB[companyName]].findAll({
    where: { ...whereClause, "saleType": "Download" },
    attributes: attributesClause,
    group: groupClause,
    raw: true,
    order: sequelize.literal(`${operationToName} DESC`)
  })

  if (!filteredRoyalties) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });
  return filteredRoyalties;
}

const getAccountingForTableView = async (groupByField, fieldName, fieldValues) => {
  let sumRevenues = await getRoyaltiesGroupedWithOp('fuga', fieldName, fieldValues, "sum", "netRevenue", [groupByField]);
  let countStreams = await getRoyaltiesGroupedWithOp('fuga', fieldName, fieldValues, "sum", "assetQuantity", [groupByField]);
  let countDownloads = await getDownloadsGroupedBy('fuga', fieldName, fieldValues, [groupByField]);

  return sumRevenues.map(groupByValueAndRevenue => {
    let streamsByGroupByField = countStreams.find(groupByValueAndStream => groupByValueAndRevenue[groupByField] === groupByValueAndStream[groupByField]);
    let downloadsByGroupByField = countDownloads.find(groupByValueAndDownload => groupByValueAndRevenue[groupByField] === groupByValueAndDownload[groupByField]);
    if (streamsByGroupByField) groupByValueAndRevenue.streams = streamsByGroupByField.streams;
    else groupByValueAndRevenue.streams = 0;
    if (downloadsByGroupByField) groupByValueAndRevenue.downloads = downloadsByGroupByField.downloads;
    else groupByValueAndRevenue.downloads = 0;
    return groupByValueAndRevenue;
  })
}

const loadRoyaltiesFromLocalCSV = async (companyName, csvPath) => {
  let mappedValuesFromCsv = await readRoyaltiesFromCsvAndMapToDB(companyName, csvPath);
  let batchSize = 10000;
  let batches = Math.ceil(mappedValuesFromCsv.length / batchSize);
  let batchesArray = [...Array(batches).keys()];
  const createOptions = { logging: true, benchmark: true, ignoreDuplicates: true }
  let rowsAdded = 0; let royaltiesCreatedInDB = {};

  for (const batch of batchesArray) {
    royaltiesCreatedInDB = await db.Royalty.bulkCreate(mappedValuesFromCsv.slice(batch * batchSize, (batch + 1) * batchSize), createOptions);
    rowsAdded += royaltiesCreatedInDB.length;
    console.log("Batch number: ", batch);
    console.log("Rows added: ", rowsAdded);
  }

  return `SUCCES UPLOADED ${rowsAdded} ROYALTIES`;
}

module.exports = {
  getRoyaltiesByQuery, getRoyaltiesGroupedWithOp, getDownloadsGroupedBy, getAccountingForTableView,
  loadRoyaltiesFromLocalCSV
};