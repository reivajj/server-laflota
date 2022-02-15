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

const getIdOfSubgenreNotCreated = async (errorCreatingSubgenre, rawDataSubgenreName) => {
  if (errorCreatingSubgenre.data.code === "DUPLICATE_SUBGENRE_NAME") {
    const allSubgenresResponse = await getSubgenresFuga();
    return { data: allSubgenresResponse.data.find(subgenre => subgenre.name === rawDataSubgenreName.name) };
  }
  else throw createError(400, errorCreatingSubgenre.data.message, {
    config: { url: "/miscellaneous/subgenres" }
    , response: { data: { unexpectedError: true } }
  });
}

const addSubgenreFuga = async rawDataSubgenreName => {
  const response = await post('/miscellaneous/subgenres', rawDataSubgenreName)
    .catch(async errorCreatingSubgenre => await getIdOfSubgenreNotCreated(errorCreatingSubgenre.response, rawDataSubgenreName));
  return response;
}

module.exports = {
  getAllDspGroupsFuga, getAllLanguagesFuga, getCatalogTiersFuga, getTerritoriesFuga,
  getContributorRolesFuga, getAudioLocalesFuga, getGenresFuga, getSubgenresFuga, addSubgenreFuga
}