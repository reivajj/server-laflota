const { dfSaleTypeToAll, dgStoreNameToAll } = require("../utils/royalties.utils");
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

const mapDgRoyaltyToDB = dgRoyaltyFromDB => {
  let dbRoyaltyRow = { ...dgRoyaltyFromDB };
  dbRoyaltyRow.upc = dgRoyaltyFromDB.upc.length === 11 ? `0${dgRoyaltyFromDB.upc}` : dgRoyaltyFromDB.upc;
  dbRoyaltyRow.reportedMonth = dgRoyaltyFromDB.reportedDate.slice(0,7);
  dbRoyaltyRow.distributor = "DASHGO";
  dbRoyaltyRow.saleType = dfSaleTypeToAll(dgRoyaltyFromDB.assetOrReleaseSale);
  dbRoyaltyRow.assetOrReleaseSale = dbRoyaltyRow.isrc === "" ? "Product" : "Asset";
  dbRoyaltyRow.assetQuantity =   dbRoyaltyRow.isrc !== "" ? dbRoyaltyRow.quantity : "";
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

module.exports = { mapFugaRoyaltyToDB, mapDgRoyaltyToDB }
