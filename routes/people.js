var router = require("express-promise-router")();
const { getAllPeopleFuga, getPeopleByIdFuga, createPersonFuga, createMultiplePersonsFuga } = require("../third-party-api/providers/fuga/people");

const multer  = require('multer');
const upload = multer();

router.get('/', async (_, res, __) => {
  const response = await getAllPeopleFuga();
  return res.status(200).send({ response: response.data });
});

router.get('/:personId', async (req, res, _) => {
  const response = await getPeopleByIdFuga(req.params.personId);
  return res.status(200).send({ response: response.data });
});

router.post('/', async (req, res, _) => {
  const response = await createPersonFuga(req.body);
  return res.status(200).send({ response: response.data });
});

router.post('/addAll', upload.none(), async (req, res, _) => {
  console.log("PERSONS I NROUTE: ", req.body);
  const response = await createMultiplePersonsFuga(req.body);
  return res.status(200).send({ response });
});


module.exports = router;