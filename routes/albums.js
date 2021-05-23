var router = require("express-promise-router")();
// import Router from "express-promise-router";
const multer = require('multer');
const createError = require('http-errors');
const { createAlbum, getAllAlbums } = require('../services/providers/albums');

const upload = multer();

router.get('/', async (_, res) => {
  const response = await getAllAlbums();

  if (!response.data) throw createError(400, 'Error al pedir los Albums', { dataResponse: response });
  return res.status(200).send({ dataResponse: response.data });
});

router.post('/upload', upload.single('cover'), async (req, res) => {
  const response = await createAlbum(req.body, req.file);
  
  if (!response.data.id) {
    throw createError(400, 'Error al subir un Album', { dataResponse: response, req })
  };

  return res.status(200).send({ response: response.data });
});

module.exports = router;