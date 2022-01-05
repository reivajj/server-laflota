var router = require("express-promise-router")();

const multer  = require('multer');
const upload = multer();

const { getAllArtists, createArtist, getArtistById, updateArtistWithId } = require('../services/providers/artists');

router.get('/', async (_, res) => {
  const response = await getAllArtists();
  return res.status(200).send({ response: response.data });
});

router.get('/:artistId', async (req, res) => {
  const response = await getArtistById(req.params.artistId);
  return res.status(200).send({ response: response.data });
});

// upload.none() se usa para text-only forms data
router.post('/', upload.none(), async (req, res) => {
  const response = await createArtist(req.body);
  return res.status(200).send({ response: response.data });
});

router.put('/:artistId', async (req, res) => {
  const response = await updateArtistWithId(req.params.artistId, req.body);
  return res.status(200).send({ response: response.data });
});


module.exports = router;