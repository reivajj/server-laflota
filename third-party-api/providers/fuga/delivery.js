const { axiosFugaInstance } = require("../../../config/axiosConfig");

const { get, post, put } = axiosFugaInstance;

const getAlbumDeliveryInstructionsFuga = async albumId => {
  const response = await get(`/products/${albumId}/delivery_instructions`);
  return response;
}

const addArrayOfDspsToDeliverFuga = async (albumId, arrayOfDspsRawData) => {
  const response = await put(`/products/${albumId}/delivery_instructions/edit`, arrayOfDspsRawData);
  return response;
}

const deliverAlbumForArrayOfDspsFuga = async (albumId, arrayOfDspsRawData) => {
  const response = await post(`/products/${albumId}/delivery_instructions/deliver`, arrayOfDspsRawData);
  return response;
}

const takedownAlbumForArrayOfDspsFuga = async (albumId, arrayOfDspsRawData) => {
  const response = await post(`/products/${albumId}/delivery_instructions/takedown`, arrayOfDspsRawData);
  return response;
}

const deleteAlbumForArrayOfDspsFuga = async (albumId, arrayOfDspsRawData) => {
  const response = await axiosFugaInstance.delete(`/products/${albumId}/delivery_instructions/`, arrayOfDspsRawData);
  return response;
}

const redeliverAlbumForArrayOfDspsFuga = async (albumId, arrayOfDspsRawData) => {
  const response = await post(`/products/${albumId}/delivery_instructions/redeliver`, arrayOfDspsRawData);
  return response;
}


const redeliverAllAlbumDspsFuga = async albumId => {
  const response = await post(`/products/${albumId}/delivery_instructions/redeliver_all`);
  return response;
}

module.exports = {
  getAlbumDeliveryInstructionsFuga, addArrayOfDspsToDeliverFuga, deliverAlbumForArrayOfDspsFuga,
  takedownAlbumForArrayOfDspsFuga, deleteAlbumForArrayOfDspsFuga, redeliverAllAlbumDspsFuga, redeliverAlbumForArrayOfDspsFuga
}