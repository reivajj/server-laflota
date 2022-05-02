const albums = require("express-promise-router")();
const delivery = require('./delivery');
const fs = require("fs");

const multer = require('multer');
const upload = multer();

const { getAllAlbums, getAlbumById, attachTrackAssetInAlbumWithId, createCoverImageInAlbum,
  uploadAlbumAssetWithCover, changeTrackPositionInAlbum, changeMultipleTracksPositionsInAlbum,
  publishAlbumWithId, updateAlbumWithId, deleteAlbumAndAssetsWithId, generateUPCAlbumWithId,
  getAlbumLiveLinksById, getFugaAlbumCoverImage, getAlbumByFieldValue } = require('../services/providers/albums');

albums.get('/', async (_, res, __) => {
  const response = await getAllAlbums();
  return res.status(200).send({ response: response.data });
});

albums.get('/searchByFieldValue', async (req, res, __) => {
  const response = await getAlbumByFieldValue(req.body.fieldValue);
  return res.status(200).send({ response: response.data });
});

albums.get('/:albumId', async (req, res, _) => {
  const response = await getAlbumById(req.params.albumId);
  return res.status(200).send({ response: response.data });
});

albums.get('/:albumId/live_links', async (req, res, _) => {
  const response = await getAlbumLiveLinksById(req.params.albumId);
  return res.status(200).send({ response: response.data });
});

albums.post('/', upload.single('cover'), async (req, res) => {
  const response = await uploadAlbumAssetWithCover(req.body, req.file);
  return res.status(200).send({ response: response.data });
});

albums.post('/uploadCover', upload.single('file'), async (req, res) => {
  console.log("COVER: ", req.file);
  const response = await createCoverImageInAlbum(req.body, req.file);
  return res.status(200).send({ response: response.data });
});

albums.get('/:albumId/image/:size', async (req, res) => {
  await getFugaAlbumCoverImage(req.params.albumId, req.params.size);
  return res.status(200).sendFile(`${req.params.albumId}.png`, { root: "albumImages/" }, error => {
    if (error) {
      console.log("ERROR: ", error);
      res.sendStatus(500)
    }
    fs.unlink(`albumImages/${req.params.albumId}.png`, error => error && console.log(error));
  });
});

albums.post('/tus-demo', upload.single('file'), async (req, res) => {
  console.log("COVER: ", req);
  // const response = await createCoverImageInAlbum(req.body, req.file);
  return res.status(200).send({ response: "DEMO" });
});

albums.put('/:albumId/tracks/:trackId', upload.none(), async (req, res) => {
  const response = await attachTrackAssetInAlbumWithId(req.params.albumId, req.params.trackId);
  return res.status(200).send({ response: response.data });
})

albums.put('/:albumId/tracks/:trackId/position/:newPosition', upload.none(), async (req, res) => {
  const { albumId, trackId, newPosition } = req.params;
  const response = await changeTrackPositionInAlbum(albumId, trackId, newPosition);
  return res.status(200).send({ response: response.data });
})

albums.post('/:albumId/publish', upload.none(), async (req, res) => {
  const response = await publishAlbumWithId(req.params.albumId);
  return res.status(200).send({ response: response.data });
})

albums.put('/:albumId', upload.none(), async (req, res) => {
  const response = await updateAlbumWithId(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
})

albums.delete('/:albumId', async (req, res, _) => {
  const response = await deleteAlbumAndAssetsWithId(req.params.albumId, req.query.delete_assets);
  return res.status(200).send({ response: response.data });
});

albums.post('/:albumId/barcode', async (req, res) => {
  const response = await generateUPCAlbumWithId(req.params.albumId);
  return res.status(200).send({ response: response.data.upc });
})

albums.use('/:albumId/delivery_instructions', delivery)

module.exports = albums;