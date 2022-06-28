const { mapFugaRoyaltyToDB, mapDkRoyaltyToDB } = require('../models/royalties');
const { readCsv } = require('../utils/csv.utils');

const readRoyaltiesFromCsvAndMapToDB = async (royaltiesCompany, csvFileName) => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    royaltiesCompany === "fuga" ? mapFugaRoyaltyToDB : mapDkRoyaltyToDB,
  );
  return data;
}

module.exports = { readRoyaltiesFromCsvAndMapToDB }