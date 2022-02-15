var router = require("express-promise-router")();
const multer = require('multer');
const createError = require('http-errors');
const { getAllTracks, getTrackAssetById, uploadTrack, uploadTrackAssetWithFile, updateTrackAssetWithId
  , getTrackContributors, addContributorToAsset, uploadTrackTest } = require('../services/providers/tracks');

const upload = multer({ limits: { fileSize: 1000000000 } });

router.get('/', async (_, res) => {
  const response = await getAllTracks();
  return res.status(200).send({ response: response.data });
});

router.get('/:trackId', async (req, res, next) => {
  const response = await getTrackAssetById(req.params.trackId);
  return res.status(200).send({ response: response.data });
});

router.put('/:trackId', upload.none(), async (req, res, next) => {
  const response = await updateTrackAssetWithId(req.params.trackId, req.body);
  return res.status(200).send({ response: response.data });
});

router.post('/', upload.single('track'), async (req, res) => {
  console.log("MetaData: ", req.body);
  const response = await uploadTrackAssetWithFile(req.body, req.file);
  return res.status(200).send({ response: response.data });
});

// router.post('/upload', upload.single('track'), async (req, res) => {
//   const response = await uploadTrack(req.body, req.file);

//   if (!response.data.success) throw createError(400, 'Error uploading a track to an Album', { properties: response });
//   return res.status(200).send({ response: response.data });
// });

router.post('/uploadTest', upload.single('track'), async (req, res) => {
  const response = await uploadTrackTest(req.body, req.file);
  // if (!response.data.success) throw createError(400, 'Error uploading a track to an Album', { properties: response });
  return res.status(200).send({ response: response });
});

// =================================CONTRIBUTORS================================\\

router.get('/:trackId/contributors', async (req, res, next) => {
  const response = await getTrackContributors(req.params.trackId);
  return res.status(200).send({ response: response.data });
});

router.post('/:trackId/contributors', async (req, res) => {
  const response = await addContributorToAsset(req.params.trackId, req.body);
  return res.status(200).send({ response: response.data });
});


module.exports = router;