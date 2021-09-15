// import dotenv from 'dotenv';
const dotenv = require('dotenv');

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  port: process.env.PORT,
  emailAddress: process.env.MY_INFO_EMAIL,
  emailPassword: process.env.MY_INFO_EMAIL_PASSWORD,
  inmotionHostName: process.env.INMOTION_HOSTNAME,
  dashGo: {
    apiUrl: process.env.DASHGO_API_URL,
    apiKey: process.env.DASHGO_API_KEY
  },
  fuga: {
    apiUrl: process.env.FUGA_API_URL,
    apiUser: process.env.FUGA_API_USER,
    apiPassword: process.env.FUGA_API_PASSWORD
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  baseApi: process.env.MY_SERVER_BASE_URL,
  albumsApi: process.env.MY_SERVER_ALBUMS_URL,
  artistsApi: process.env.MY_SERVER_ARTISTS_URL,
  tracksApi: process.env.MY_SERVER_TRACKS_URL,
  labelsApi: process.env.MY_SERVER_LABELS_URL,
  emailsApi: process.env.EMAILS_API,
  loginApi: process.env.LOGIN_API,
}