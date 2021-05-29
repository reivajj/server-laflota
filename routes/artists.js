var router = require("express-promise-router")();
const createError = require('http-errors');

const multer  = require('multer');
const upload = multer();

const { getAllArtists, createArtist } = require('../services/providers/artists');

router.get('/', async (_, res) => {
  const response = await getAllArtists();

  if (!response.data) throw createError(400, 'Error al pedir los Artistas', { properties: response });
  return res.status(200).send({ response: response.data });
});

// upload.none() se usa para text-only forms data
router.post('/', upload.none(), async (req, res) => {
  const response = await createArtist(req.body);
  
  if (!response.data.id) {
    throw createError(400, 'Error al subir un Artista', { properties: response })
  };

  return res.status(200).send({ response: response.data });
});

module.exports = router;