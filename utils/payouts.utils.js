const getAccountTypeFromPayout = payout => {
  if (payout.cbuCvuAlias !== "") return "CBU/CVU";
  if (payout.paypalEmail !== "") return "PayPal";
  if (payout.payoneerEmail !== "") return "Payoneer";
  if (payout.cupon) return "Cupón de Crédito";
  return "CBU/CVU";
}

const getAccountValueFromPayout = payout => {
  if (payout.cbuCvuAlias !== "") return payout.cbuCvuAlias;
  if (payout.paypalEmail !== "") return payout.paypalEmail;
  if (payout.payoneerEmail !== "") return payout.payoneerEmail;
  return "";
}

const getAccountPayId = (account, payoutRecord) => {
  if (payoutRecord.currency === "ARS") return payoutRecord.otherPayId;
  if (account === "PayPal") return payoutRecord.paypalId;
  if (account === "Payoneer") return payoutRecord.payoneerId;
  return "";
}

module.exports = { getAccountTypeFromPayout, getAccountValueFromPayout, getAccountPayId };