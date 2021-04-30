// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: `${process.env.DASHGO_API_URL}`,
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['X-Access-Key'] = `${process.env.DASHGO_API_KEY}`;
instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';

export default instance;
