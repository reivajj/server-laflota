const { mapFugaRoyaltyToDB, mapDkRoyaltyToDB, mapDgCsvRoyaltyToDB } = require('../models/royalties');
const { mapDgPayoutToFS, mapDkPayoutToFS } = require('../models/payouts');
const { readCsv } = require('../utils/csv.utils');

const readRoyaltiesFromCsvAndMapToDB = async (royaltiesCompany, csvFileName) => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    royaltiesCompany === "fuga" ? mapFugaRoyaltyToDB : mapDgCsvRoyaltyToDB,
  );
  return data;
}

const readPayoutFromCsvAndMapToFS = async (royaltiesCompany, csvFileName) => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    (csvRow) => csvRow 
  );
  return data;
}

module.exports = { readRoyaltiesFromCsvAndMapToDB, readPayoutFromCsvAndMapToFS }