const createHttpError = require('http-errors');
const { axiosFugaInstance } = require('../../../config/axiosConfig');
const { handleLabelErrorsMessage } = require('../errors/handleFugaErrors');

const { get, post } = axiosFugaInstance;

const getAllLabelsFromFuga = async () => {
  const response = await get('/labels');
  if (!response.data) throw createHttpError(400, 'Error al buscar los Labels', { properties: response });
  return response;
}

const getLabelByIdFuga = async labelId => {
  const response = await get(`/labels/${labelId}`);
  return response;
}

const getLabelByNameFuga = async labelName => {
  const response = await get(`/labels?name=${labelName}`);
  return response;
}

const checkIfErrorIsDuplicateLabelAndAct = async (errorCreatingLabel, labelName) => {
  if (errorCreatingLabel.data.code === "DUPLICATE_LABEL_NAME") {
    const labelSearched = await getLabelByNameFuga(labelName);
    if (labelSearched.data.length === 0) return { data: "Hubo un problema al buscar si el Sello estaba creado." }
    return { data: labelSearched.data[0] };
  }
  else throw createError(400, errorCreatingLabel.data.message, { config: { url: "/labels" }, response: { data: { unexpectedError: true } } });
}

// Si hay un error lo toma el handler. Probar bien esto cuando podria fallar! Pensando en porque tenes un CATCH en el delete.
const uploadLabelToProvider = async rawDataLabel => {
  const response = await post('/labels', rawDataLabel)
    .catch(async error => await checkIfErrorIsDuplicateLabelAndAct(error.response, rawDataLabel.name));
  return response;
}

const deleteLabelFuga = async idToDelete => {
  const response = await axiosFugaInstance.delete(`/labels/${idToDelete}`).catch((error) => {
    throw createHttpError(400, 'Error to delete a label in FUGA', { properties: { msgFromFuga: error.response.data } });
  });

  if (!response.data) throw createHttpError(400, 'Error to delete a label in FUGA', { properties: { response, formData: idToDelete } });
  return response;
}

module.exports = { getAllLabelsFromFuga, uploadLabelToProvider, deleteLabelFuga, getLabelByIdFuga };