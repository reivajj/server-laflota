const { axiosFugaV2Instance } = require("../../../config/axiosConfig");

const { get, post, put } = axiosFugaV2Instance;

const getAllDspGroupsFuga = async pageSize => {
  const response = await get(`/contracts?page_size=${pageSize}`);
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

const getSubgenresByNameFuga = async subgenreName => {
  const response = await get(`/miscellaneous/subgenres?search=${encodeURI(subgenreName)}`);
  console.log("RESPONSE: ", response);
  return response;
}

const getIdOfSubgenreNotCreated = async (errorCreatingSubgenre, rawDataSubgenreName) => {
  console.log("ERROR SUBGENRE: ", errorCreatingSubgenre.data)
  if (errorCreatingSubgenre.data.code === "DUPLICATE_SUBGENRE_NAME") {
    const allSubgenresResponse = await getSubgenresByNameFuga(rawDataSubgenreName.name);
    return { data: allSubgenresResponse.data.subgenre.find(subgenre => subgenre.name.toLowerCase() === rawDataSubgenreName.name.toLowerCase()) };
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