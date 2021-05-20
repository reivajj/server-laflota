var router = require('express-promise-router')();
const pkg = require('axios');
const createError = require('http-errors');
const FormData = require('form-data');

const { get, post } = pkg;

router.get('/getAll', async (req, res) => {


  const response = await get('https://api.dashgo.com/api/v1/artists/', {
    // You need to use `getHeaders()` in Node.js because Axios doesn't
    // automatically set the multipart form boundary in Node.
    headers: {
      "X-Access-Key": 'laflota-kladsjf-2229-5582-5222-fkgnnEAD'
    }
  });

  if (!response.data) {
    throw createError(400, 'Error al subir un Track', { dataResponse: response })
  };

  return res.status(200).send({ response: response.data, formDataSend: formData });
});

module.exports = router;