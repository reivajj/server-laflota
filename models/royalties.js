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
  return dbRoyaltyRow;
}

module.exports = { mapFugaRoyaltyToDB }
