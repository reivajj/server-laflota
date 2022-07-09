var router = require("express-promise-router")();
const createError = require('http-errors');
const { sendRoyaltiesRequestNotification } = require("../mailing/payouts.js");

const { sendWelcome } = require('../mailing/user.js');

// upload.none() se usa para text-only forms data
router.post('/welcome', async (req, res) => {
  const response = await sendWelcome(req.body.text);
  if (!response) {
    res.status(400).send('Error al dar la bienvenida al Usuario con el Mail', { properties: response });
  };

  return res.status(200).send({ response: response });
});

router.post('/requestRoyaties', async (req, res) => {
  const { ownerEmail, userName, currencyText, accountType, accountValue, paymentMethodText,
    currencyRate, totalAskedCurrency, idTransaction } = req.body;
  const response = await sendRoyaltiesRequestNotification(ownerEmail, userName, currencyText,
    accountType, accountValue, paymentMethodText, currencyRate, totalAskedCurrency, idTransaction);
  return res.status(200).send({ response });
})

module.exports = router;