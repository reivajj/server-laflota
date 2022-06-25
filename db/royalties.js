const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");
const sequelize = require("sequelize");
const { readRoyaltiesFromCsvAndMapToDB } = require("../csv/royalties");
const { Op } = require("sequelize");
const { mapDgRoyaltyToDB } = require("../models/royalties");

const companyTableNameInDB = {
  "dashgo": "RegaliasDashgo",
  "fuga": "Royalty",
  "distroKid": "RoyaltyDK"
}

const operationsToProps = (op, fieldOp, filterValue, currency) => {
  if (op === "sum" && fieldOp === "assetQuantity") return "streams";
  if (op === "sum" && fieldOp === "netRevenue") return "revenues" + currency;
  if (op === "count" && fieldOp === "upc" && filterValue === "Download") return "downloads";
  return fieldOp + op;
}

const royaltiesFieldsToSentToFrontEnd = ["saleId", "upc", "saleStartDate", "dsp", "storeName", "saleUserType",
  "territory", "releaseArtist", "releaseTitle", "assetTitle", "saleType",
  "isrc", "assetOrReleaseSale", "assetQuantity", "originalRevenue",
  "netRevenue", "netRevenueCurrency"]


const dgAttributes = ["saleId", "reportedDate", "upc", "saleStartDate", "dsp", "saleUserType", "territory", "releaseArtist", "releaseTitle",
  "assetTitle", "isrc", "assetOrReleaseSale", "quantity", "originalRevenue", "originalCurrency", "convertedRevenue", "netRevenue",
  "exchangeRate", "shareDeal", "label", "assetArtist"]

const getAllRoyaltiesFromDB = async (companyName, limit, offset, order) => {
  const allStreams = await db[companyTableNameInDB[companyName]].findAll({
    limit: limit,
    attributes: companyName === "fuga" ? royaltiesFieldsToSentToFrontEnd : dgAttributes,
    offset: offset,
    order: sequelize.literal(order)
  },
    { raw: true });
  if (!allStreams) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allStreams });

  return allStreams;
}

const getRoyaltiesByQuery = async (companyName, fieldName, fieldValue, limit, offset) => {
  const filteredRoyalties = await db[companyTableNameInDB[companyName]].findAll({
    where: fieldValue.length > 0 ? { [fieldName]: fieldValue } : {},
    limit: limit,
    offset: offset,
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

const getRoyaltiesGroupedWithOp = async (companyName, currency, fieldName, fieldValue, op, fieldOp, groupByArray) => {
  let groupClause = ""; let operationToName = operationsToProps(op, fieldOp, fieldValue[0] || "", currency);

  let whereClause = fieldValue.length > 0 ? { [fieldName]: fieldValue } : {};
  if (currency !== "") whereClause = { ...whereClause, "netRevenueCurrency": currency };

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
  let sumUsdRevenues = await getRoyaltiesGroupedWithOp('fuga', "USD", fieldName, fieldValues, "sum", "netRevenue", [groupByField]);
  let sumEurRevenues = await getRoyaltiesGroupedWithOp('fuga', "EUR", fieldName, fieldValues, "sum", "netRevenue", [groupByField]);
  let countStreams = await getRoyaltiesGroupedWithOp('fuga', "", fieldName, fieldValues, "sum", "assetQuantity", [groupByField]);
  let countDownloads = await getDownloadsGroupedBy('fuga', fieldName, fieldValues, [groupByField]);

  return countStreams.map(groupByValueAndStream => {
    let usdRevenuesByGroupByField = sumUsdRevenues.find(groupByValueAndUsdRevenue => groupByValueAndStream[groupByField] === groupByValueAndUsdRevenue[groupByField]);
    let downloadsByGroupByField = countDownloads.find(groupByValueAndDownload => groupByValueAndStream[groupByField] === groupByValueAndDownload[groupByField]);
    let eurRevenuesByGroupByField = sumEurRevenues.find(groupByValueAndEurRevenue => groupByValueAndStream[groupByField] === groupByValueAndEurRevenue[groupByField])
    groupByValueAndStream.revenuesUSD = usdRevenuesByGroupByField ? usdRevenuesByGroupByField.revenuesUSD : 0;
    groupByValueAndStream.downloads = downloadsByGroupByField ? downloadsByGroupByField.downloads : 0;
    groupByValueAndStream.revenuesEUR = eurRevenuesByGroupByField ? eurRevenuesByGroupByField.revenuesEUR : 0;
    return groupByValueAndStream;
  })
}

const loadRoyaltiesFromLocalCSV = async (companyName, csvPath) => {
  let mappedValuesFromCsv = await readRoyaltiesFromCsvAndMapToDB(companyName, csvPath);
  let batchSize = 20000;
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

//==============================================================DG==============================================================================\\

const loadDgRoyaltiesFromDB = async () => {

  let totalCount = 4841485;
  let batchSize = 20000;
  let batches = Math.ceil(totalCount / batchSize);
  let batchesArray = [...Array(batches).keys()];

  const createOptions = { logging: false, benchmark: true, ignoreDuplicates: true }
  let rowsAdded = 0; let royaltiesCreatedInDB = [];
  console.time("ALL PROCCES");

  for (const batch of batchesArray) {
    console.time(`Batch: ${batch}`);
    let royaltiesFromDB = await getAllRoyaltiesFromDB("dashgo", batchSize, batch * batchSize, 'saleId ASC');
    let mappedRoyaltiesToDB = royaltiesFromDB.map(dgRoyalty => mapDgRoyaltyToDB(dgRoyalty.dataValues));

    royaltiesCreatedInDB = await db.Royalty.bulkCreate(mappedRoyaltiesToDB, createOptions);
    rowsAdded += royaltiesCreatedInDB.length;

    console.log("Batch number: ", batch);
    console.log("Rows added: ", rowsAdded);
    console.log("Porcentaje: ", (rowsAdded / totalCount) * 100);
    console.timeEnd(`Batch: ${batch}`);
  }
  console.timeEnd("ALL PROCCES")

  return `SUCCES UPLOADED ${rowsAdded} ROYALTIES`;
}



module.exports = {
  getAllRoyaltiesFromDB, getRoyaltiesByQuery, getRoyaltiesGroupedWithOp, getDownloadsGroupedBy, getAccountingForTableView,
  loadRoyaltiesFromLocalCSV, loadDgRoyaltiesFromDB
};
