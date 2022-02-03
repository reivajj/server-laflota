const axiosFugaInstance = require("../../../config/axiosConfig");

const { get, post } = axiosFugaInstance;

const getAllDspGroupsFuga = async () => {
  const response = await get('/contracts');
  return response;
};

const getAllLanguagesFuga = async () => {
  const response = await get('/miscellaneous/languages');
  return response;
}

const getCatalogTiersFuga = async () => {
  const response = await get('/miscellaneous/catalog-tiers');
  return response;
}

const getTerritoriesFuga = async () => {
  const response = await get('/miscellaneous/territories');
  return response;
}

const getContributorRolesFuga = async () => {
  const response = await get('/miscellaneous/contributor_roles');
  return response;
}

const getAudioLocalesFuga = async () => {
  const response = await get('/miscellaneous/audio_locales');
  return response;
}

const getGenresFuga = async () => {
  const response = await get('/miscellaneous/genres');
  return response;
}

const getSubgenresFuga = async () => {
  const response = await get('/miscellaneous/subgenres');
  return response;
}

const addSubgenreFuga = async rawDataSubgenreName => {
  const response = await post('/miscellaneous/subgenres', rawDataSubgenreName);
  return response;
}

module.exports = {
  getAllDspGroupsFuga, getAllLanguagesFuga, getCatalogTiersFuga, getTerritoriesFuga,
  getContributorRolesFuga, getAudioLocalesFuga, getGenresFuga, getSubgenresFuga, addSubgenreFuga
}