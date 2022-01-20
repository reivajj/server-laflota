var router = require("express-promise-router")();

const multer = require('multer');
const upload = multer();

const { getAllAlbums, getAlbumById, attachTrackAssetInAlbumWithId, createCoverImageInAlbum,
  uploadAlbumAssetWithCover, changeTrackPositionInAlbum, changeMultipleTracksPositionsInAlbum, publishAlbumWithId, updateAlbumWithId, deleteAlbumAndAssetsWithId, generateUPCAlbumWithId } = require('../services/providers/albums');

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

router.post('/uploadCover', upload.single('cover'), async (req, res) => {
  const response = await createCoverImageInAlbum(req.body, req.file);
  return res.status(200).send({ response: response.data });
});

router.put('/:albumId/tracks/:trackId', upload.none(), async (req, res) => {
  const response = await attachTrackAssetInAlbumWithId(req.params.albumId, req.params.trackId);
  return res.status(200).send({ response: response.data });
})

router.put('/:albumId/tracks/:trackId/position/:newPosition', upload.none(), async (req, res) => {
  const { albumId, trackId, newPosition } = req.params;
  const response = await changeTrackPositionInAlbum(albumId, trackId, newPosition);
  return res.status(200).send({ response: response.data });
})

router.put('/:albumId/rearrenge', upload.none(), async (req, res) => {
  const response = await changeMultipleTracksPositionsInAlbum(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
})

router.post('/:albumId/publish', upload.none(), async (req, res) => {
  const response = await publishAlbumWithId(req.params.albumId);
  return res.status(200).send({ response: response.data });
})

router.put('/:albumId', upload.none(), async (req, res) => {
  const response = await updateAlbumWithId(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
})

router.delete('/:albumId', async (req, res, _) => {
  const response = await deleteAlbumAndAssetsWithId(req.params.albumId, req.query.delete_assets);
  return res.status(200).send({ response: response.data });
});

router.post('/:albumId/barcode', async (req, res) => {
  const response = await generateUPCAlbumWithId(req.params.albumId);
  return res.status(200).send({ response: response.data });
})

module.exports = router;