const { transporter } = require('../config/emailServer');
const createError = require('http-errors');
const { handleEmailErrors } = require('./handleEmailsError');
const { regaliasSolicitadas } = require('./models');

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const sendRoyaltiesRequestNotification = async (ownerEmail, userName, currencyText, accountType, accountValue, paymentMethodText, currencyRate, totalAskedCurrency, idTransaction) => {

  const mailOptions = {
    from: '"La Flota" <info@laflota.com.ar>',
    to: ownerEmail,
    subject: `Regalías solicitadas • ${accountType}`,
    html: regaliasSolicitadas(userName, currencyText, accountType, accountValue, paymentMethodText, currencyRate, totalAskedCurrency, idTransaction),
  };

  let [errorSendingWelcomeEmail, infoSuccessWelcome] = await to(transporter.sendMail(mailOptions));
  let emailsResponse = handleEmailErrors(errorSendingWelcomeEmail, infoSuccessWelcome);
  console.log("EMAILS RESPONSE: ", emailsResponse);
  if (emailsResponse !== "OK") return emailsResponse;

  return infoSuccessWelcome;
}

module.exports = { sendRoyaltiesRequestNotification };