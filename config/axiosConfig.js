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

// Where you would set stuff like your 'Authorization' header, etc ...
// instanceDashGo.defaults.headers.common['X-Access-Key'] = `${process.env.DASHGO_API_KEY}`;
// instanceDashGo.defaults.headers.post['Content-Type'] = 'multipart/form-data';

axiosFugaInstance.defaults.headers.post['Content-Type'] = 'application/json';
axiosFugaInstance.defaults.headers.post['Accept'] = 'application/json';

module.exports = axiosFugaInstance;
