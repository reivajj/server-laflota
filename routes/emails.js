var router = require("express-promise-router")();
const createError = require('http-errors');

const { sendWelcome } = require('../mailing/user.js');

// upload.none() se usa para text-only forms data
router.post('/welcome', async (req, res) => {
  const response = await sendWelcome(req.body);
  if (!response) {
    res.status(400).send('Error al dar la bienvenida al Usuario con el Mail', { properties: response });
  };

  return res.status(200).send({ response: response });
});

module.exports = router;