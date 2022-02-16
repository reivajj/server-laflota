const axios = require('axios');
const config = require('../config');

const axiosDGInstance = axios.create({
  // .. where we make our configurations
  baseURL: `${process.env.DASHGO_API_URL}`,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

axiosDGInstance.defaults.headers.common['X-Access-Key'] = `${process.env.DASHGO_API_KEY}`;

const axiosFugaInstance = axios.create({
  // .. where we make our configurations
  baseURL: config.fuga.apiUrl,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

axiosFugaInstance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axiosFugaInstance.defaults.headers.post['Accept'] = 'application/json';

module.exports = { axiosFugaInstance, axiosDGInstance };
