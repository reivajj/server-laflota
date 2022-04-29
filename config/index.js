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
    apiUrlV2: process.env.FUGA_API_URL_V2,
    apiUser: process.env.FUGA_API_USER,
    apiPassword: process.env.FUGA_API_PASSWORD,
    apiUserLaFlota: process.env.FUGA_API_USER_LA_FLOTA,
    apiPasswordLaFlota: process.env.FUGA_API_PASSWORD_LA_FLOTA,
    cookieName: process.env.FUGA_COOKIE_NAME,
    cookieApidemoValue: process.env.FUGA_COOKIE_VALUE_APIDEMO
  },
  spotify: {
    spotifyId: process.env.SPOTIFY_ID,
    spotifySecretCode: process.env.SPOTIFY_SECRET_CODE,
    spotifyApiUrl: process.env.SPOTIFY_API_URL
  },
  mySqlDb: {
    url: process.env.DATABASE_URL,
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  baseApi: process.env.MY_SERVER_BASE_URL,
  albumsApi: process.env.MY_SERVER_ALBUMS_URL,
  artistsApi: process.env.MY_SERVER_ARTISTS_URL,
  tracksApi: process.env.MY_SERVER_TRACKS_URL,
  labelsApi: process.env.MY_SERVER_LABELS_URL,
  uploadApi: process.env.MY_SERVER_UPLOAD_URL,
  usersApi: process.env.MY_SERVER_USERS_URL,
  royaltiesApi: process.env.MY_SERVER_ROYALTIES_URL,
  peopleApi: process.env.MY_SERVER_PEOPLE_URL,
  miscellaneousApi: process.env.MY_SERVER_MISCELLANEOUS,
  firebaseApi: process.env.FIREBASE_API,
  spotifyApi: process.env.SPOTIFY_API,
  csvApi: process.env.CSV_API,
  emailsApi: process.env.EMAILS_API,
  loginApi: process.env.LOGIN_API,
}