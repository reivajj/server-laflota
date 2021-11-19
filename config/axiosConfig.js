const axios = require('axios');
const config = require('../config');
// Next we make an 'instance' of it
// const instanceDashGo = axios.create({
// // .. where we make our configurations
//     baseURL: `${process.env.DASHGO_API_URL}`,
//     maxContentLength: Infinity,
//     maxBodyLength: Infinity,
// });

const axiosFugaInstance = axios.create({
  // .. where we make our configurations
  baseURL: config.fuga.apiUrl,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

axiosFugaInstance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axiosFugaInstance.defaults.headers.post['Accept'] = 'application/json';

module.exports = axiosFugaInstance;
