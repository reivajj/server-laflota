const { default: axios } = require('axios');

const logToCloudLoggingFS = async (msg, payloadData, payloadError, typeOfLog) => {
  const response = await axios.post('https://us-central1-laflota-dev.cloudfunctions.net/logs-onHttpCallWriteCloudLog', { msg, payloadData, payloadError, typeOfLog })
  return response.data;
}

module.exports = { logToCloudLoggingFS }