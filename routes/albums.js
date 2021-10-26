var router = require("express-promise-router")();

const multer  = require('multer');
const upload = multer();

const { getAllAlbums, createAlbum, getAlbumById, createTrackAssetInAlbumWithId, createCoverImageInAlbum } = require('../services/providers/albums');

router.get('/', async (_, res, __) => {
  const response = await getAllAlbums();
  return res.status(200).send({ response: response.data });
});

router.get('/:albumId', async (req, res, _) => {
  const response = await getAlbumById(req.params.albumId);
  return res.status(200).send({ response: response.data });
});

router.post('/:albumId/assets', upload.none(), async (req, res) => {
  const response = await createTrackAssetInAlbumWithId(req.body, req.params.albumId);
  return res.status(200).send({ response: response.data });
});

router.post('/', upload.none(), async (req, res) => {
  const response = await createAlbum(req.body);
  return res.status(200).send({ response: response.data });
});

router.post('/uploadCover', upload.single('file'), async (req, res) => {
  console.log("Filename: ", req.file)
  const response = await createCoverImageInAlbum(req.body, req.file);
  return res.status(200).send({ response: response.data });
});


module.exports = router;