const { getAlbumDeliveryInstructionsFuga, addArrayOfDspsToDeliverFuga, deliverAlbumForArrayOfDspsFuga, takedownAlbumForArrayOfDspsFuga, deleteAlbumForArrayOfDspsFuga, redeliverAllAlbumDspsFuga, redeliverAlbumForArrayOfDspsFuga } = require("../../third-party-api/providers/fuga/delivery");

const getAlbumDeliveryInstructions = async albumId => {
  const response = await getAlbumDeliveryInstructionsFuga(albumId);
  return response;
}

const addArrayOfDspsToDeliver = async (albumId, arrayOfDspsRawData) => {
  const response = await addArrayOfDspsToDeliverFuga(albumId, arrayOfDspsRawData);
  return response;
}

const deliverAlbumForArrayOfDsps = async (albumId, arrayOfDspsRawData) => {
  const response = await deliverAlbumForArrayOfDspsFuga(albumId, arrayOfDspsRawData);
  return response;
}

const takedownAlbumForArrayOfDsps = async (albumId, arrayOfDspsRawData) => {
  const response = await takedownAlbumForArrayOfDspsFuga(albumId, arrayOfDspsRawData);
  return response;
}

const deleteAlbumForArrayOfDsps = async (albumId, arrayOfDspsRawData) => {
  const response = await deleteAlbumForArrayOfDspsFuga(albumId, arrayOfDspsRawData);
  return response;
}

const redeliverAllAlbumDsps = async albumId => {
  const response = await redeliverAllAlbumDspsFuga(albumId);
  return response;
}

const redeliverAlbumForArrayOfDsps = async (albumId, arrayOfDspsRawData) => {
  const response = await redeliverAlbumForArrayOfDspsFuga(albumId, arrayOfDspsRawData);
  return response;
}

module.exports = {
  getAlbumDeliveryInstructions, addArrayOfDspsToDeliver, deliverAlbumForArrayOfDsps, takedownAlbumForArrayOfDsps,
  deleteAlbumForArrayOfDsps, redeliverAllAlbumDsps, redeliverAlbumForArrayOfDsps
}