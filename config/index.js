// import dotenv from 'dotenv';
const dotenv = require('dotenv');

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  port: process.env.PORT,
  dashGo: {
    apiUrl: process.env.DASHGO_API_URL,
    apiKey: process.env.DASHGO_API_KEY
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  baseApi: process.env.MY_SERVER_BASE_URL,
  albumsApi: process.env.MY_SERVER_ALBUMS_URL,
  artistsApi: process.env.MY_SERVER_ARTISTS_URL,
  tracksApi: process.env.MY_SERVER_TRACKS_URL,
  labelsApi: process.env.MY_SERVER_LABELS_URL
}