const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getUploadUuid = async rawDataUploadStart => {
  console.log("rawDataAlbum: ", rawDataUploadStart);
  const response = await post('upload/start', rawDataUploadStart);
  console.log("Response: ", response);

  if (!response.data) throw createError(400, 'Error to get the upload UUID', { properties: response });
  return response;
}

const uploadFile = async formDataFile => {
  const response = await post('upload', formDataFile, {
    headers: { ...formDataFile.getHeaders() }
  });

  if (!response.data.success) throw createError(400, 'Error to upload a file to FUGA:', { properties: { response, formData: formDataFile } });
  return response;
}

module.exports = { getUploadUuid, uploadFile };