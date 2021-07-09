const axios = require('axios');
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: `${process.env.DASHGO_API_URL}`,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['X-Access-Key'] = `${process.env.DASHGO_API_KEY}`;
instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';

module.exports = instance;
