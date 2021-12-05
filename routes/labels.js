var router = require("express-promise-router")();
const createError = require('http-errors');

const multer  = require('multer');
const upload = multer();

const { getAllLabels, createLabel, deleteLabel } = require('../services/providers/labels');

router.get('/', async (_, res, next) => {
  const response = await getAllLabels();
  return res.status(200).send({ response: response.data });
});

router.post('/', upload.none(), async (req, res) => {
  const response = await createLabel(req.body);
  return res.status(200).send({ response: response.data });
});

router.delete('/:labelId', upload.none(), async (req, res) => {
  const response = await deleteLabel(req.params.labelId);
  return res.status(200).send({ response: response.data });
});

module.exports = router;