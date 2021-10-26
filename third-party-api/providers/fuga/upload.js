const axiosInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');

const { get, post } = axiosInstance;

const getUploadUuid = async rawDataUploadStart => {
  console.log("rawDataCover: ", rawDataUploadStart);
  const response = await post('upload/start', rawDataUploadStart);

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

const finishUpload = async uploadUuid => {
  console.log("rawDataCover: ", uploadUuid);
  const response = await post('upload/finish', { uuid: uploadUuid });

  if (!response.data.success) throw createError(400, 'Error to finish the uplaod', { properties: response });
  return response;
}

module.exports = { getUploadUuid, uploadFile, finishUpload };