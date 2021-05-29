const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllLabelsFromDashGo = async () => {
  const response = await get('/labels');

  if (!response.data) throw createError(400, 'Error al buscar los Labels');
  return response;
}

const uploadLabelToProvider = async formDataLabel => {
  const response = await post('/labels', formDataLabel, {
    headers: { ...formDataLabel.getHeaders() }
  });

  if (!response.data) throw createError(400, 'Error al subir un label en DashGo', { properties: { response, formData: formDataLabel } });
  return response;
}

module.exports = { getAllLabelsFromDashGo, uploadLabelToProvider };