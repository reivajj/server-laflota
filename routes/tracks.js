var router = require("express-promise-router")();
const multer = require('multer');
const createError = require('http-errors');
const { createTrackAsset, getAllTracks, getTrackAssetById } = require('../services/providers/tracks');

const upload = multer();

router.get('/', async (_, res) => {
  const response = await getAllTracks();

  if (!response.data) throw createError(400, 'Error al pedir los Tracks', { properties: response });
  return res.status(200).send({ response: response.data });
});

router.get('/:assetId', async (req, res, next) => {
  const response = await getTrackAssetById(req.params.assetId);
  return res.status(200).send({ response: response.data });
});

router.post('/', upload.none(), async (req, res) => {
  const response = await createTrackAsset(req.body);
  // const response = await createFugaTrackAsset(req.body, req.file);
  
  if (!response.data.id) {
    throw createError(400, 'Error al subir un track al Album', { properties: response })
  };

  return res.status(200).send({ response: response.data });
});

// router.post('/', upload.single('track'), async (req, res) => {
//   const response = await createFugaTrackAsset(req.body);
//   // const response = await createFugaTrackAsset(req.body, req.file);
  
//   if (!response.data.id) {
//     throw createError(400, 'Error al subir un track al Album', { properties: response })
//   };

//   return res.status(200).send({ response: response.data });
// });

module.exports = router;