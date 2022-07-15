const { transporter } = require('../config/emailServer');
const createError = require('http-errors');
const { handleEmailErrors } = require('./handleEmailsError');
const { regaliasSolicitadas, regaliasNotification } = require('./models');
const { getAccountTypeFromPayout, getAccountValueFromPayout, getAccountPayId } = require('../utils/payouts.utils');

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const sendRoyaltiesNotification = async (payoutRecord, requestedOrPayed) => {
  let ownerEmail = payoutRecord.ownerEmail;
  let userName = payoutRecord.userName;
  let cupon = payoutRecord.cupon || "";
  let currencyText = payoutRecord.currency.toUpperCase();
  let accountType = getAccountTypeFromPayout(payoutRecord);
  let accountValue = getAccountValueFromPayout(payoutRecord);
  let paymentMethodText = accountType === "CBU/CVU" ? "Transferencia Bancaria" : accountType;
  let currencyRate = payoutRecord.currencyRateToUsd;
  let transferTotalAskedCurrency = payoutRecord.transferTotalAskedCurrency || 0;
  let transferTotalUsd = payoutRecord.transferTotalUsd;
  let idTransactionApp = payoutRecord.id;
  let idPayAccount = requestedOrPayed === "requested" ? "" : getAccountPayId(accountType, payoutRecord); 

  const mailOptions = {
    from: '"La Flota" <info@laflota.com.ar>',
    to: ownerEmail,
    subject: requestedOrPayed === "requested" ? `Regalías solicitadas • ${accountType}` : `Regalías pagadas • ${accountType}`,
    html: regaliasNotification(requestedOrPayed, userName, currencyText, accountType, accountValue, paymentMethodText
      , currencyRate, transferTotalUsd, transferTotalAskedCurrency, idTransactionApp, idPayAccount),
  };

  let [errorSendingWelcomeEmail, infoSuccessWelcome] = await to(transporter.sendMail(mailOptions));
  let emailsResponse = handleEmailErrors(errorSendingWelcomeEmail, infoSuccessWelcome);
  if (emailsResponse !== "OK") return emailsResponse;
  return infoSuccessWelcome;
}

module.exports = { sendRoyaltiesNotification };