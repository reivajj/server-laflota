const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllLabelsFromFuga = async () => {
  const response = await get('/labels');

  if (!response.data) throw createError(400, 'Error al buscar los Labels', { properties: response });
  return response;
}

const uploadLabelToProvider = async rawDataLabel => {
  const response = await post('/labels', rawDataLabel);

  if (!response.data) throw createError(400, 'Error al subir un label en FUGA', { properties: { response, formData: rawDataLabel } });
  return response;
}

module.exports = { getAllLabelsFromFuga, uploadLabelToProvider };