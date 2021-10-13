const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getAllProductsFromFuga = async () => {
  const response = await get('/products');

  if (!response.data) throw createError(400, 'Error al buscar los Products', { properties: response });
  return response;
}

const getProductByIDFromFuga = async productId => {
  const response = await get(`/products/${productId}`);

  if (!response.data) throw createError(400, 'Error al buscar el Product con ID', { id: productId, properties: response });
  return response;
}

const uploadProductToProvider = async rawDataProduct => {
  const response = await post('/products', rawDataProduct);

  if (!response.data) throw createError(400, 'Error al subir un product en FUGA', { properties: { response, formData: rawDataProduct } });
  return response;
}

module.exports = { getAllProductsFromFuga, uploadProductToProvider, getProductByIDFromFuga };