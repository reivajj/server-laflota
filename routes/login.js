var router = require("express-promise-router")();
const createError = require('http-errors');
const loginToFuga = require("../third-party-api/providers/fuga/login");

const multer  = require('multer');
const upload = multer();

router.post('/', upload.none(), async (req, res) => {
  const response = await loginToFuga();
  
  if (response.status !== 200) {
    throw createError(400, 'Error al realizar el Login en Fuga', { properties: response });
  };

  res.cookie(response.cookie[0], response.cookie[1]);
  return res.status(200).send({ response: response.data });
});

module.exports = router;