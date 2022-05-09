var router = require("express-promise-router")();
const multer = require('multer');
const createError = require('http-errors');
const { getAllTracks, getTrackAssetById, uploadTrack, uploadTrackAssetWithFile, updateTrackAssetWithId
  , getTrackContributors, addContributorToAsset, uploadTrackTest, createTrackAssetNew, uploadTrackFileInAssetNew } = require('../services/providers/tracks');

const upload = multer({ limits: { fileSize: 10000000000 } });

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
  const response = await uploadTrackAssetWithFile(req.body, req.file);
  return res.status(200).send({ response: response.data });
});

router.post('/new', upload.single('track'), async (req, res) => {
  const response = await createTrackAssetNew(req.body);
  return res.status(200).send({ response: response.data });
});

router.post('/audio_file', upload.single('track'), async (req, res) => {
  const response = await uploadTrackFileInAssetNew(req.body.trackId, req.file);
  return res.status(200).send({ response: response.data });
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