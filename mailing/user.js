const { transporter } = require('../config/emailServer');
const createError = require('http-errors');

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const sendWelcome = async () => {
  const dest = "javi.petri.jp@gmail.com";

  const mailOptions = {
    from: '"La Flota" <info@laflota.com.ar>',
    to: dest,
    subject: `Javi Bienvenido a La Flota`,
    html: "<b>Hola</b>"
  };

  let [errorSendingWelcomeEmail, infoSuccessWelcome] = await to(transporter.sendMail(mailOptions));
  if (errorSendingWelcomeEmail) throw createError(505, 'Error al dar la bienvenida al Usuario con el Mail', { properties: errorSendingWelcomeEmail });

  if (infoSuccessWelcome.rejected.length > 0 && infoSuccessWelcome.accepted.length === 0) {
    return { status: 'total rejected', errorType: 'all emails rejected', info: infoSuccessWelcome }
  }

  if (infoSuccessWelcome.rejected.length > 0 && infoSuccessWelcome.accepted.length > 0) {
    return { status: 'partial success', errorType: 'some emails rejected', info: infoSuccessWelcome }
  }

  return infoSuccessWelcome;
}

module.exports = { sendWelcome };