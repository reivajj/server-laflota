const axios = require('axios');
const config = require('../config');

const axiosDGInstance = axios.create({
  // .. where we make our configurations
  baseURL: `${process.env.DASHGO_API_URL}`,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

const axiosSpotifyInstance = axios.create({
  baseURL: config.spotify.spotifyApiUrl,
})

const axiosLoginSpotifyInstance = axios.create({
  baseURL: 'https://accounts.spotify.com/api',
})

axiosDGInstance.defaults.headers.common['X-Access-Key'] = `${process.env.DASHGO_API_KEY}`;

const axiosFugaInstance = axios.create({
  // .. where we make our configurations
  baseURL: config.fuga.apiUrl,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

const axiosFugaV2Instance = axios.create({
  // .. where we make our configurations
  baseURL: config.fuga.apiUrlV2,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

axiosFugaV2Instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axiosFugaV2Instance.defaults.headers.post['Accept'] = 'application/json';

axiosFugaInstance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axiosFugaInstance.defaults.headers.post['Accept'] = 'application/json';

// axiosSpotifyInstance.defaults.headers.common['Authorization'] = `Bearer ${config.spotify.spotifySecretCode}`;

module.exports = { axiosFugaInstance, axiosDGInstance, axiosFugaV2Instance, axiosSpotifyInstance, axiosLoginSpotifyInstance };
