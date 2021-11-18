var router = require("express-promise-router")();

const multer  = require('multer');
const upload = multer();

const { getAllAlbums, getAlbumById, attachTrackAssetInAlbumWithId, createCoverImageInAlbum, uploadAlbumAssetWithCover } = require('../services/providers/albums');

router.get('/', async (_, res, __) => {
  const response = await getAllAlbums();
  return res.status(200).send({ response: response.data });
});

router.get('/:albumId', async (req, res, _) => {
  const response = await getAlbumById(req.params.albumId);
  return res.status(200).send({ response: response.data });
});

router.post('/', upload.single('cover'), async (req, res) => {
  const response = await uploadAlbumAssetWithCover(req.body, req.file);  
  return res.status(200).send({ response: response.data });
});

router.post('/uploadCover', upload.single('file'), async (req, res) => {
  const response = await createCoverImageInAlbum(req.body, req.file);
  return res.status(200).send({ response: response.data });
});

router.put('/:albumId/tracks/:trackId', upload.none(), async (req, res) => {
  const response = await attachTrackAssetInAlbumWithId(req.params.albumId, req.params.trackId);
  return res.status(200).send({ response: response.data });
})


module.exports = router;