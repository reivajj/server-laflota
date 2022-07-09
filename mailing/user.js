const { transporter } = require('../config/emailServer');
const createError = require('http-errors');
const { handleEmailErrors } = require('./handleEmailsError');

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const sendWelcome = async text => {
  const dest = "javi.petri.jp@gmail.com";

  const mailOptions = {
    from: '"La Flota" <info@laflota.com.ar>',
    to: dest,
    subject: `Javi Bienvenido a La Flota`,
    html: `<b>${text}</b>`
  };

  let [errorSendingWelcomeEmail, infoSuccessWelcome] = await to(transporter.sendMail(mailOptions));
  let emailsResponse = handleEmailErrors(errorSendingWelcomeEmail, infoSuccessWelcome);
  if (!emailsResponse !== "OK") return emailsResponse;

  return emailsResponse;
}

module.exports = { sendWelcome };