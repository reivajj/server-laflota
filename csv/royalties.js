const { mapFugaRoyaltyToDB, mapDkRoyaltyToDB } = require('../models/royalties');
const { mapDgPayoutToFS, mapDkPayoutToFS } = require('../models/payouts');
const { readCsv } = require('../utils/csv.utils');

const readRoyaltiesFromCsvAndMapToDB = async (royaltiesCompany, csvFileName) => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    royaltiesCompany === "fuga" ? mapFugaRoyaltyToDB : mapDkRoyaltyToDB,
  );
  return data;
}

const readPayoutFromCsvAndMapToFS = async (royaltiesCompany, csvFileName) => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    royaltiesCompany === "dashgo" ? mapDgPayoutToFS : mapDkPayoutToFS,
  );
  return data;
}

module.exports = { readRoyaltiesFromCsvAndMapToDB, readPayoutFromCsvAndMapToFS }