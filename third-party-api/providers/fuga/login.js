const axiosFugaInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');
const config = require('../../../config');

const { post } = axiosFugaInstance;

const loginToFuga = async () => {
  const loginData = {
    "name": config.fuga.apiUserLaFlota,
    "password": config.fuga.apiPasswordLaFlota,
    "secure": false,
    "authType": "session"
  };

  const response = await post('/login', loginData);
  if (!response) throw createError(400, 'Error al realizar el Login en Fuga');

  const rawCookies = response.headers['set-cookie'][0].split('; ');
  response.cookie = rawCookies[0].split('=');

  return response;
}

module.exports = loginToFuga;