const { dfSaleTypeToAll, dgStoreNameToAll, dkStoreNameToAll } = require("../utils/royalties.utils");
const { v4: uuidv4 } = require('uuid');

const fugaRoyaltyEquivalenceToDB = {
  ['Sale ID']: "saleId",
  ['Sale Start date']: "saleStartDate",
  ['Sale End date']: "saleEndDate",
  ['DSP']: "dsp",
  ['Sale Store Name']: "storeName",
  ['Sale Type']: "saleType",
  ['Sale User Type']: "saleUserType",
  ['Territory']: "territory",
  ['Product UPC']: "upc",
  ['Product Reference']: "releaseFugaId",
  ['Product Catalog Number']: "releaseCatNumber",
  ['Product Label']: "label",
  ['Product Artist']: "releaseArtist",
  ['Product Title']: "releaseTitle",
  ['Asset Artist']: "assetArtist",
  ['Asset Title']: "assetTitle",
  ['Asset Version']: "assetVersion",
  ['Asset Duration']: "assetDuration",
  ['Asset ISRC']: "isrc",
  ['Asset Reference']: "assetFugaId",
  ['Asset/Product']: "assetOrReleaseSale",
  ['Product Quantity']: "releaseQuantity",
  ['Asset Quantity']: "assetQuantity",
  ['Original Gross Income']: "originalRevenue",
  ['Original currency']: "originalCurrency",
  ['Exchange Rate']: "exchangeRate",
  ['Converted Gross Income']: "convertedRevenue",
  ['Contract deal term']: "shareDeal",
  ['Reported Royalty']: "netRevenue",
  ['Currency']: "netRevenueCurrency",
  ['Report Run ID']: "reportRunId",
  ['Report ID']: "reportId"
}

const mapFugaRoyaltyToDB = csvRoyaltyRow => {
  let dbRoyaltyRow = {};
  Object.keys(csvRoyaltyRow).forEach(key => dbRoyaltyRow[fugaRoyaltyEquivalenceToDB[key]] = csvRoyaltyRow[key]);
  dbRoyaltyRow.distributor = "FUGA";
  dbRoyaltyRow.reportedMonth = "2022-06"
  return dbRoyaltyRow;
}

const mapDgRoyaltyFromDBToDB = dgRoyaltyFromDB => {
  let dbRoyaltyRow = { ...dgRoyaltyFromDB };
  dbRoyaltyRow.upc = dgRoyaltyFromDB.upc.length === 11 ? `0${dgRoyaltyFromDB.upc}` : dgRoyaltyFromDB.upc;
  dbRoyaltyRow.reportedMonth = dgRoyaltyFromDB.reportedDate.slice(0, 7);
  dbRoyaltyRow.distributor = "DASHGO";
  dbRoyaltyRow.saleType = dfSaleTypeToAll(dgRoyaltyFromDB.assetOrReleaseSale);
  dbRoyaltyRow.assetOrReleaseSale = dbRoyaltyRow.isrc === "" ? "Product" : "Asset";
  dbRoyaltyRow.assetQuantity = dbRoyaltyRow.isrc !== "" ? dbRoyaltyRow.quantity : "";
  dbRoyaltyRow.releaseQuantity = dbRoyaltyRow.isrc === "" ? dbRoyaltyRow.quantity : "";
  dbRoyaltyRow.netRevenueCurrency = "USD";
  dbRoyaltyRow.shareDeal = "93%";
  dbRoyaltyRow.reportId = "";
  dbRoyaltyRow.reportRunId = "";
  dbRoyaltyRow.dsp = dgStoreNameToAll(dbRoyaltyRow.dsp);
  dbRoyaltyRow.saleEndDate = dbRoyaltyRow.saleStartDate;
  dbRoyaltyRow.storeName = dbRoyaltyRow.dsp;
  dbRoyaltyRow.releaseFugaId = "";
  dbRoyaltyRow.releaseCatNumber = "";
  dbRoyaltyRow.assetFugaId = "";
  dbRoyaltyRow.assetVersion = "";
  dbRoyaltyRow.assetDuration = "";
  delete dbRoyaltyRow.quantity;
  delete dbRoyaltyRow.reportedDate;

  return dbRoyaltyRow;
}

const mapDgCsvRoyaltyToDB = dgRoyaltyFromCSV => {
  let dbRoyaltyAll = {};
  dbRoyaltyAll.saleStartDate = dgRoyaltyFromCSV['Transaction Date'] || "";
  dbRoyaltyAll.dsp = dgStoreNameToAll(dgRoyaltyFromCSV['Store']) || "";
  dbRoyaltyAll.storeName = dbRoyaltyAll.dsp || "";
  dbRoyaltyAll.saleEndDate = dbRoyaltyAll.saleStartDate || "";
  dbRoyaltyAll.reportedMonth = dbRoyaltyAll.saleStartDate.slice(0, 8) + '01';
  dbRoyaltyAll.isrc = dgRoyaltyFromCSV['ISRC'] || "";
  dbRoyaltyAll.assetOrReleaseSale = dbRoyaltyAll.isrc === "" ? "Product" : "Asset";
  dbRoyaltyAll.assetQuantity = dbRoyaltyAll.isrc !== "" ? dgRoyaltyFromCSV['Units'] : "";
  dbRoyaltyAll.releaseQuantity = dbRoyaltyAll.isrc === "" ? dgRoyaltyFromCSV['Units'] : "";
  dbRoyaltyAll.saleType = dfSaleTypeToAll(dgRoyaltyFromCSV['Product Type']) || "";
  dbRoyaltyAll.saleUserType = dgRoyaltyFromCSV['Use Type'] || "";
  dbRoyaltyAll.territory = dgRoyaltyFromCSV['Region'] || "";
  dbRoyaltyAll.upc = dgRoyaltyFromCSV['UPC'].length === 11 ? `0${dgRoyaltyFromCSV['UPC']}` || "" : dgRoyaltyFromCSV['UPC'] || "";
  dbRoyaltyAll.releaseCatNumber = dbRoyaltyAll.upc || "";
  dbRoyaltyAll.label = dgRoyaltyFromCSV['Label Name'] || "";
  dbRoyaltyAll.releaseArtist = dgRoyaltyFromCSV['Artist Name'] || "";
  dbRoyaltyAll.releaseTitle = dgRoyaltyFromCSV['Album Name'] || "";
  dbRoyaltyAll.assetArtist = dgRoyaltyFromCSV['Track Artist'] || "";
  dbRoyaltyAll.assetTitle = dgRoyaltyFromCSV['Track Title'] || "";
  dbRoyaltyAll.netRevenue = parseFloat(dgRoyaltyFromCSV['Payable']) || "";
  dbRoyaltyAll.originalRevenue = parseFloat(dgRoyaltyFromCSV['Revenue']) || "";
  dbRoyaltyAll.originalCurrency = dgRoyaltyFromCSV['Currency'] || "";
  dbRoyaltyAll.exchangeRate = parseFloat(dgRoyaltyFromCSV['Exchange Rate']) || "";
  dbRoyaltyAll.netRevenueCurrency = "USD";
  dbRoyaltyAll.shareDeal = "93%";
  dbRoyaltyAll.releaseFugaId = "";
  dbRoyaltyAll.releaseCatNumber = "";
  dbRoyaltyAll.assetFugaId = "";
  dbRoyaltyAll.assetVersion = "";
  dbRoyaltyAll.assetDuration = "";
  dbRoyaltyAll.distributor = "DASHGO";
  dbRoyaltyAll.reportRunId = "";
  dbRoyaltyAll.reportId = "";
  return dbRoyaltyAll;
}

const isDownload = csvRoyalryRow => {
  const { assetOrReleaseSale, quantity, netRevenue, dsp } = csvRoyalryRow;
  if (assetOrReleaseSale === "Album") return true;
  if (dsp === "iTunes") return true;
  else if ((parseFloat(netRevenue) / quantity) > 0.09) return true;
  return false;
}

const mapDkRoyaltyToDB = csvRoyaltyRow => {
  let dbRoyaltyRow = {};
  Object.keys(csvRoyaltyRow).forEach(key => dbRoyaltyRow[key] = csvRoyaltyRow[key]);
  dbRoyaltyRow.distributor = "DK";
  dbRoyaltyRow.saleId = (parseInt(dbRoyaltyRow.saleId) + 700000000).toString()
  dbRoyaltyRow.upc = csvRoyaltyRow.upc.length === 11 ? `0${csvRoyaltyRow.upc}` : csvRoyaltyRow.upc;
  dbRoyaltyRow.reportedMonth = csvRoyaltyRow.reportedDate.slice(0, 7);
  dbRoyaltyRow.saleStartDate = csvRoyaltyRow.saleStartDate + "-01";
  dbRoyaltyRow.saleType = isDownload(csvRoyaltyRow) ? "Download" : "Stream";
  dbRoyaltyRow.assetOrReleaseSale = dbRoyaltyRow.isrc === "" ? "Product" : "Asset";
  dbRoyaltyRow.assetQuantity = dbRoyaltyRow.isrc !== "" ? dbRoyaltyRow.quantity : "";
  dbRoyaltyRow.releaseQuantity = dbRoyaltyRow.isrc === "" ? dbRoyaltyRow.quantity : "";
  dbRoyaltyRow.releaseTitle = dbRoyaltyRow.assetOrReleaseSale === "Product" ? csvRoyaltyRow.releaseTitle : "",
    dbRoyaltyRow.assetTitle = dbRoyaltyRow.assetOrReleaseSale === "Asset" ? csvRoyaltyRow.releaseTitle : "",
    dbRoyaltyRow.assetArtist = csvRoyaltyRow.releaseArtist,
    dbRoyaltyRow.netRevenueCurrency = "USD";
  dbRoyaltyRow.shareDeal = "DK DEAL";
  dbRoyaltyRow.reportId = "";
  dbRoyaltyRow.reportRunId = "";
  dbRoyaltyRow.dsp = dkStoreNameToAll(dbRoyaltyRow.dsp);
  dbRoyaltyRow.saleEndDate = dbRoyaltyRow.saleStartDate;
  dbRoyaltyRow.storeName = dbRoyaltyRow.dsp;
  dbRoyaltyRow.releaseFugaId = "";
  dbRoyaltyRow.releaseCatNumber = "";
  dbRoyaltyRow.assetFugaId = "";
  dbRoyaltyRow.assetVersion = "";
  dbRoyaltyRow.assetDuration = "";
  dbRoyaltyRow.label = "";
  dbRoyaltyRow.saleUserType = "DK Stream";

  delete dbRoyaltyRow.reportedDate; delete dbRoyaltyRow.quantity;
  delete dbRoyaltyRow.anotherShareDeal; delete dbRoyaltyRow.songwriterRights;
  return dbRoyaltyRow;
}

module.exports = { mapFugaRoyaltyToDB, mapDgCsvRoyaltyToDB, mapDkRoyaltyToDB }
