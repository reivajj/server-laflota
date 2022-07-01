const { v4: uuidv4 } = require('uuid');

const mapDgPayoutToFS = dgPayoutCsvRow => {
  let fsRoyaltyRow = {};

  fsRoyaltyRow.id = uuidv4();
  fsRoyaltyRow.userEmail = dgPayoutCsvRow.userEmail.trim();
  fsRoyaltyRow.currency = dgPayoutCsvRow.currency;
  fsRoyaltyRow.currencyRate = parseFloat(dgPayoutCsvRow.currencyRate);
  fsRoyaltyRow.historicTotalUsd = parseFloat(dgPayoutCsvRow.historicTotal);
  fsRoyaltyRow.alreadyPaid = parseFloat(dgPayoutCsvRow.alreadyPaid);
  fsRoyaltyRow.transferTotalUsd = parseFloat(dgPayoutCsvRow.transferTotal);
  fsRoyaltyRow.transferTotalAskedCurrency = parseFloat(dgPayoutCsvRow.transferTotalArs);
  fsRoyaltyRow.comission = parseFloat(dgPayoutCsvRow.comissionArs);
  fsRoyaltyRow.comissionCurrency = "";
  fsRoyaltyRow.requestDate = dgPayoutCsvRow.requestDate;
  fsRoyaltyRow.transferDate = dgPayoutCsvRow.transferDate;
  fsRoyaltyRow.userCuit = dgPayoutCsvRow.userCuit || "";
  fsRoyaltyRow.userName = dgPayoutCsvRow.userName || "";
  fsRoyaltyRow.userLastName = dgPayoutCsvRow.userLastName || "";
  fsRoyaltyRow.cupon = dgPayoutCsvRow.cupon || "";
  fsRoyaltyRow.cbuOrCvu = dgPayoutCsvRow.cbuOrCvu || "";
  fsRoyaltyRow.paypalEmail = dgPayoutCsvRow.paypalEmail || "";
  fsRoyaltyRow.paypalId = dgPayoutCsvRow.paypalId || "";
  fsRoyaltyRow.paypalFee = dgPayoutCsvRow.paypalFee || "";
  fsRoyaltyRow.state = "Migrated DK";
  fsRoyaltyRow.payoneerEmail = "";
  fsRoyaltyRow.payoneerId = "";
  fsRoyaltyRow.payoneerFee = "";
  fsRoyaltyRow.taxes = "";
  return fsRoyaltyRow;
}

const mapFsPayoutToDB = fsPayoutDoc => {
  let dbPayoutRow = {};

  dbPayoutRow.id = fsPayoutDoc.id;
  dbPayoutRow.requestDate = fsPayoutDoc.requestDate;
  dbPayoutRow.transferDate = fsPayoutDoc.transferDate;
  dbPayoutRow.transferMonth = fsPayoutDoc.transferDate
    ? fsPayoutDoc.transferDate.slice(0, 7)
    : fsPayoutDoc.requestDate ? fsPayoutDoc.requestDate.slice(0, 7) : '0000-00';
  dbPayoutRow.alreadyPaidUsd = fsPayoutDoc.alreadyPaid === NaN ? 0 : fsPayoutDoc.alreadyPaid || 0;
  dbPayoutRow.comissionAskedCurrency = fsPayoutDoc.comission === NaN ? 0 : fsPayoutDoc.comission || 0;
  dbPayoutRow.comissionCurrency = fsPayoutDoc.currency;
  dbPayoutRow.comissionUsd = fsPayoutDoc.currency === "USD"
    ? fsPayoutDoc.comission === NaN ? 0 : fsPayoutDoc.comission || 0
    : 0;

  dbPayoutRow.currency = fsPayoutDoc.currency;
  dbPayoutRow.currencyRateToUsd = fsPayoutDoc.currencyRate === NaN ? 0 : fsPayoutDoc.currencyRate || 0;
  dbPayoutRow.historicTotalUsd = fsPayoutDoc.historicTotalUsd === NaN ? 0 : fsPayoutDoc.historicTotalUsd || 0;
  dbPayoutRow.transferTotalUsd = fsPayoutDoc.transferTotalUsd === NaN ? 0 : fsPayoutDoc.transferTotalUsd || 0;
  dbPayoutRow.transferTotalAskedCurrency = fsPayoutDoc.transferTotalAskedCurrency === NaN ? 0 : fsPayoutDoc.transferTotalAskedCurrency || 0;
  dbPayoutRow.userCuit = fsPayoutDoc.userCuit || "";
  dbPayoutRow.userName = fsPayoutDoc.userName || "";
  dbPayoutRow.userLastName = fsPayoutDoc.userLastName || "";
  dbPayoutRow.cupon = fsPayoutDoc.cupon === "NULL" ? "" : fsPayoutDoc.cupon;
  dbPayoutRow.cbuCvuAlias = "";
  dbPayoutRow.paypalEmail = fsPayoutDoc.paypalEmail || "";
  dbPayoutRow.paypalId = fsPayoutDoc.paypalId || "";
  dbPayoutRow.paypalFee = fsPayoutDoc.paypalFee || "";
  dbPayoutRow.status = fsPayoutDoc.state;
  dbPayoutRow.payoneerEmail = "";
  dbPayoutRow.payoneerId = "";
  dbPayoutRow.payoneerFee = "";
  dbPayoutRow.userEmail = fsPayoutDoc.userEmail;
  dbPayoutRow.userId = fsPayoutDoc.userId;
  dbPayoutRow.taxesUsd = 0;
  dbPayoutRow.taxesOtherCurrency = 0;
  dbPayoutRow.taxesCurrency = "";
  return dbPayoutRow;
}

module.exports = { mapDgPayoutToFS, mapFsPayoutToDB }