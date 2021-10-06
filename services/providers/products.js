const { uploadProductToProvider, getAllProductsFromFuga, getProductByIDFromFuga } = require('../../third-party-api/providers/fuga/products');
const createFugaProduct = require('../../models/products');

const getAllProducts = async () => {
  const response = await getAllProductsFromFuga();
  return response;
}

const getProductById = async productId => {
  const response = await getProductByIDFromFuga(productId);
  return response;
}

const createProduct = async productMetadata => {
  const rawDataProduct = createFugaProduct(productMetadata);
  const response = await uploadProductToProvider(rawDataProduct);

  return response;
}

module.exports = { getAllProducts, createProduct, getProductById };