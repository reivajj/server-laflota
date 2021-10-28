var router = require("express-promise-router")();
const multer = require('multer');
const createError = require('http-errors');
const { createTrackAsset, getAllTracks, getTrackAssetById, startUploadTrack, uploadTrack, uploadTrackAssetWithFile } = require('../services/providers/tracks');

const upload = multer();

router.get('/', async (_, res) => {
  const response = await getAllTracks();

  if (!response.data) throw createError(400, 'Error al pedir los Tracks', { properties: response });
  return res.status(200).send({ response: response.data });
});

router.get('/:trackId', async (req, res, next) => {
  const response = await getTrackAssetById(req.params.trackId);
  return res.status(200).send({ response: response.data });
});

router.post('/', upload.single('track'), async (req, res) => {
  console.log("MetaData: ", req.body);
  const response = await uploadTrackAssetWithFile(req.body, req.file);  
  return res.status(200).send({ response: response.data });
});

// router.post('/', upload.none(), async (req, res) => {
//   const response = await createTrackAsset(req.body);
//   // const response = await createFugaTrackAsset(req.body, req.file);
  
//   if (!response.data.id) throw createError(400, 'Error al subir un track al Album', { properties: response });
//   return res.status(200).send({ response: response.data });
// });

// router.post('/upload/start',upload.none() , async (req, res) => {
//   const response = await startUploadTrack(req.body);

//   if (!response.data) throw createError(400, 'Error getting the UUID of the upload:', { properties: response });
//   return res.status(200).send({ response: response.data });
// });

router.post('/upload', upload.single('track'), async (req, res) => {
  const response = await uploadTrack(req.body, req.file);
  
  if (!response.data.success) throw createError(400, 'Error uploading a track to an Album', { properties: response });
  return res.status(200).send({ response: response.data });
});

module.exports = router;