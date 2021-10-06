// Handlers error should go at the END
const config = require('../config');
const axios = require('axios');
const axiosFugaInstance = require('../config/axiosConfig');

const checkIfNeedsLogin = async (req, res, next) => {
  const loginData = {
    "name": config.fuga.apiUser,
    "password": config.fuga.apiPassword,
    "secure": false,
    "authType": "session"
  };

  const response = await axios.post(`${config.fuga.apiUrl}/login`, loginData);
  if (!response) throw createError(400, 'Error al realizar el Login en Fuga');

  const rawCookies = response.headers['set-cookie'][0].split('; ');
  const cookie = rawCookies[0];

  res.locals = cookie;
  axiosFugaInstance.defaults.headers.Cookie = cookie; // attaching cookie to axiosFugaInstance for future requests
  // axiosFugaInstance.defaults.headers.get['Cookie'] = cookie; // attaching cookie to axiosFugaInstance for future requests

  next();
};

module.exports = checkIfNeedsLogin;