const e = require('express');
const { v4: uuidv4 } = require('uuid');
const { getUserByEmailFromDB } = require('../db/users');
const { getUserInFSByEmail } = require('../firebase/firestore/user');

const mapDgPayoutToFS = dgPayoutCsvRow => {
  let fsRoyaltyRow = {};

  fsRoyaltyRow.id = uuidv4();
  fsRoyaltyRow.ownerEmail = dgPayoutCsvRow.ownerEmail.trim();
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
  fsRoyaltyRow.state = "Completed";
  fsRoyaltyRow.payoneerEmail = "";
  fsRoyaltyRow.payoneerId = "";
  fsRoyaltyRow.payoneerFee = "";
  fsRoyaltyRow.taxes = "";
  return fsRoyaltyRow;
}


const mapDgPayoutFromDBToDB = async fsPayoutDoc => {
  let dbPayoutRow = {};

  dbPayoutRow.id = uuidv4();
  dbPayoutRow.ownerEmail = fsPayoutDoc.UserEmail;
  dbPayoutRow.requestDate = fsPayoutDoc.request_date;
  dbPayoutRow.transferDate = fsPayoutDoc.transfer_date;
  dbPayoutRow.transferMonth = fsPayoutDoc.transfer_date
    ? fsPayoutDoc.transfer_date.slice(0, 7) + '-01'
    : fsPayoutDoc.request_date ? fsPayoutDoc.request_date.slice(0, 7) + '-01' : '0000-00-00';

  dbPayoutRow.historicTotalUsd = parseFloat(fsPayoutDoc.historic_total) === NaN ? 0 : parseFloat(fsPayoutDoc.historic_total) || 0;
  dbPayoutRow.alreadyPaidUsd = parseFloat(fsPayoutDoc.already_paid) === NaN ? 0 : parseFloat(fsPayoutDoc.already_paid) || 0;
  dbPayoutRow.currency = fsPayoutDoc.currency;
  dbPayoutRow.currencyRateToUsd = parseFloat(fsPayoutDoc.currency_rate) === NaN ? 1 : parseFloat(fsPayoutDoc.currency_rate) || 1;
  dbPayoutRow.transferTotalUsd = parseFloat(fsPayoutDoc.transfer_total) === NaN ? 0 : parseFloat(fsPayoutDoc.transfer_total) || 0;
  dbPayoutRow.transferTotalAskedCurrency = parseFloat(fsPayoutDoc.transfer_total_ars) === NaN ? 0 : parseFloat(fsPayoutDoc.transfer_total_ars) || 0;

  dbPayoutRow.comissionAskedCurrency = parseFloat(fsPayoutDoc.comision_ars_bank) === NaN ? 0 : parseFloat(fsPayoutDoc.comision_ars_bank) || 0;
  dbPayoutRow.comissionCurrency = fsPayoutDoc.currency;
  dbPayoutRow.comissionUsd = 0;

  dbPayoutRow.taxesUsd = 0;
  dbPayoutRow.taxesCurrency = "";
  dbPayoutRow.taxesOtherCurrency = 0;
  dbPayoutRow.cbuCvuAlias = fsPayoutDoc.bank_cbu;
  dbPayoutRow.cupon = fsPayoutDoc.cupon === "NULL" ? "" : fsPayoutDoc.cupon;
  dbPayoutRow.payoneerEmail = "";
  dbPayoutRow.payoneerId = "";
  dbPayoutRow.payoneerFee = "";
  dbPayoutRow.paypalEmail = fsPayoutDoc.paypal_email || "";
  dbPayoutRow.paypalId = fsPayoutDoc['PAYPAL_TRS_ID'] || "";
  dbPayoutRow.paypalFee = fsPayoutDoc['PAYPAL_FEE'] || "";
  dbPayoutRow.mpId = "";
  dbPayoutRow.userCuit = fsPayoutDoc.UserCUIT || "";
  dbPayoutRow.status = 'Migrated DG';

  let userInFS = await getUserInFSByEmail(dbPayoutRow.ownerEmail);
  if (userInFS.exist) dbPayoutRow.ownerId = userInFS.user.id;
  else dbPayoutRow.ownerId = 'NOT_FOUNDED';

  dbPayoutRow.userName = fsPayoutDoc.UserName || "";
  dbPayoutRow.userLastName = fsPayoutDoc.UserLastName || "";
  dbPayoutRow.lastUpdateTS = new Date(fsPayoutDoc.transfer_date !== '0000-00-00' ? fsPayoutDoc.transfer_date : fsPayoutDoc.request_date).getTime() || 0;
  return dbPayoutRow;
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
  dbPayoutRow.ownerEmail = fsPayoutDoc.ownerEmail;
  dbPayoutRow.ownerId = fsPayoutDoc.ownerId;
  dbPayoutRow.taxesUsd = 0;
  dbPayoutRow.taxesOtherCurrency = 0;
  dbPayoutRow.taxesCurrency = "";
  return dbPayoutRow;
}

module.exports = { mapDgPayoutToFS, mapFsPayoutToDB, mapDgPayoutFromDBToDB }