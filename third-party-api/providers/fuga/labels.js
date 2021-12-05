const axiosInstance = require('../../../config/axiosConfig');
const createHttpError = require('http-errors');

const { get, post } = axiosInstance;

const getAllLabelsFromFuga = async () => {
  const response = await get('/labels');

  if (!response.data) throw createHttpError(400, 'Error al buscar los Labels', { properties: response });
  return response;
}

const uploadLabelToProvider = async rawDataLabel => {
  const response = await post('/labels', rawDataLabel);

  if (!response.data) throw createHttpError(400, 'Error al subir un label en FUGA', { properties: { response, formData: rawDataLabel } });
  return response;
}

const deleteLabelFuga = async idToDelete => {
  const response = await axiosInstance.delete(`/labels/${idToDelete}`).catch((error) => {
    throw createHttpError(400, 'Error to delete a label in FUGA', { properties: { msgFromFuga: error.response.data } });
  });

  if (!response.data) createHttpError(400, 'Error to delete a label in FUGA', { properties: { response, formData: idToDelete } });
  return response;
}

module.exports = { getAllLabelsFromFuga, uploadLabelToProvider, deleteLabelFuga };