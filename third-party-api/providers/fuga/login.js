const axiosFugaInstance = require('../../../config/axiosConfig');
const createError = require('http-errors');
const config = require('../../../config');

const { get, post } = axiosFugaInstance;

const loginToFuga = async () => {
  const data = {
    "name": config.fuga.apiUser,
    "password": config.fuga.apiPassword,
    "secure": false,
    "authType": "session"
  };

  const response = await post('/login', data);
  if (!response) throw createError(400, 'Error al realizar el Login en Fuga');

  return response;
}

module.exports = loginToFuga;