const miscellaneous = require("express-promise-router")();

const {
  getAllDspGroupsFuga, getAllLanguagesFuga, getCatalogTiersFuga, getGenresFuga, addSubgenreFuga
  , getTerritoriesFuga, getContributorRolesFuga, getAudioLocalesFuga, getSubgenresFuga
} = require("../third-party-api/providers/fuga/miscellaneous");

miscellaneous.get('/contracts', async (_, res) => {
  const response = await getAllDspGroupsFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.get('/languages', async (_, res) => {
  const response = await getAllLanguagesFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.get('/catalog-tiers', async (_, res) => {
  const response = await getCatalogTiersFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.get('/territories', async (_, res) => {
  const response = await getTerritoriesFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.get('/contributor_roles', async (_, res) => {
  const response = await getContributorRolesFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.get('/audio_locales', async (_, res) => {
  const response = await getAudioLocalesFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.get('/genres', async (_, res) => {
  const response = await getGenresFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.get('/subgenres', async (_, res) => {
  const response = await getSubgenresFuga();
  return res.status(200).send({ response: response.data });
});

miscellaneous.post('/subgenres', async (req, res) => {
  const response = await addSubgenreFuga(req.body);
  return res.status(200).send({ response: response.data });
});

module.exports = miscellaneous;