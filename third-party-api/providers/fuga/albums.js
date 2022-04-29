const createError = require('http-errors');
const { axiosFugaInstance } = require('../../../config/axiosConfig');
const { albumTrackAssetError, albumGetAllError, albumUpdateFieldsError, albumDeleteError } = require('../../../utils/errors.utils');

const fs = require("fs");
// const sharp = require("sharp");

const { get, post, put } = axiosFugaInstance;

const getAllAlbumsFromFuga = async () => {
  const response = await get('/products')
    .catch((error) => { throw createError(400, albumGetAllError, { properties: error.response.data }) });
  return response;
}

const getAlbumByFieldValueFuga = async fieldValue => {
  const response = await get(`/products?page=0&page_size=20&search=${encodeURI(fieldValue)}`)
    .catch(error => { console.log("ERROR: ", error); return { data: { product: ["ERROR"] } } });
  return { data: response.data.product };
}

const getAlbumByIdFromFuga = async albumId => {
  const response = await get(`/products/${albumId}`);
  return response;
}

const getAlbumLiveLinksByIdFuga = async albumId => {
  const response = await get(`/products/${albumId}/live_links`);
  return response;
}

const checkIfErrorIsDuplicatedUPCandDelete = async (errorCreatingAlbum, rawDataAlbum) => {
  if (errorCreatingAlbum.data.upc === "DUPLICATE_UPC_CODE") {
    rawDataAlbum.upc = "";
    const creatingAlbumResponse = await uploadAlbumToProvider(rawDataAlbum);
    return creatingAlbumResponse;
  }
  else throw createError(400, errorCreatingAlbum.data.message, { config: { url: "/products" }, response: { data: errorCreatingAlbum.data } });
}

const uploadAlbumToProvider = async rawDataAlbum => {
  const response = post('/products', rawDataAlbum)
    .catch(async error => await checkIfErrorIsDuplicatedUPCandDelete(error.response, rawDataAlbum));
  return response;
}

const attachTrackAssetInAlbumFuga = async (albumId, trackId) => {
  const response = await put(`/products/${albumId}/assets/${trackId}`);
  return response;
}

const uploadCoverInAlbumToFuga = async formDataCover => {
  const response = await post('/upload', formDataCover, {
    headers: { ...formDataCover.getHeaders() }
  }).catch(error => error);
  return response;
}

const getFugaAlbumCoverImageFUGA = async (albumId, imageSize) => {
  const response = await get(`products/${albumId}/image/${imageSize}`, { responseType: 'stream' });
  const writer = fs.createWriteStream(`images/${albumId}.png`)

  response.data.pipe(writer)
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

const changeTrackPositionInAlbumInFUGA = async (albumId, trackId, newPosition) => {
  const response = await put(`/products/${albumId}/assets/${trackId}/position/${newPosition}`)
  return response;
}

const updateAlbumWithIdInFuga = async (albumId, newFieldsValues) => {
  const response = await put(`/products/${albumId}`, newFieldsValues)
    .catch((error) => {
      throw createError(400, albumUpdateFieldsError, { properties: { error, formData: newFieldsValues } });
    })
  return response;
}

const deleteAlbumAndAssetsWithIdFromFuga = async (albumId, deleteAllAssetsBoolean) => {
  const response = await axiosFugaInstance.delete(`/products/${albumId}?delete_assets=${deleteAllAssetsBoolean}`);
  return response;
}

const generateUPCAlbumWithIdInFuga = async albumId => {
  const response = await post(`/products/${albumId}/barcode`);
  return response;
}

const publishAlbumWithIdInFuga = async albumId => {
  const response = await post(`/products/${albumId}/publish`);
  return response;
}

module.exports = {
  getAllAlbumsFromFuga, uploadAlbumToProvider, getAlbumByIdFromFuga, attachTrackAssetInAlbumFuga,
  uploadCoverInAlbumToFuga, changeTrackPositionInAlbumInFUGA, publishAlbumWithIdInFuga, updateAlbumWithIdInFuga,
  deleteAlbumAndAssetsWithIdFromFuga, generateUPCAlbumWithIdInFuga, getAlbumLiveLinksByIdFuga, getFugaAlbumCoverImageFUGA,
  getAlbumByFieldValueFuga
};