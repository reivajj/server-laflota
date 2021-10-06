var router = require("express-promise-router")();

const multer  = require('multer');
const upload = multer();

const { getAllProducts, createProduct, getProductById } = require('../services/providers/products');

router.get('/', async (_, res, next) => {
  const response = await getAllProducts();
  return res.status(200).send({ response: response.data });
});

router.get('/:productId', async (req, res, next) => {
  const response = await getProductById(req.params.productId);
  return res.status(200).send({ response: response.data });
});

router.post('/', upload.none(), async (req, res) => {
  const response = await createProduct(req.body);
  return res.status(200).send({ response: response.data });
});

module.exports = router;