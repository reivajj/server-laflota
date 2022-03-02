// Handlers error should go at the END
const config = require('../config');
const axios = require('axios');
const { axiosFugaInstance, axiosFugaV2Instance } = require('../config/axiosConfig');

// REVEER: users no usa FUGA entonces, no necesito el Login (ver de chequear efectivamente que solo 
// haga login para las rutas que lo necesiten)
const urlsWithNoLoginToFUGA = ['/filemanagerapp/api/users', '/filemanagerapp/api/firebase', '/filemanagerapp/api/csv']
const urlsNotApiThatNeedLoginToFuga = ['/filemanagerapp/api/firebase/fuga'];
const checkIfNeedLoginToFuga = reqUrl => {
  for (let i = 0; i < urlsWithNoLoginToFUGA.length; i++) {
    if (reqUrl.indexOf(urlsNotApiThatNeedLoginToFuga[i]) === 0) return true;
    if (reqUrl.indexOf(urlsWithNoLoginToFUGA[i]) === 0) return false;
  }
  return true
}

const loginToFugaIfNeeded = async (req, res, next) => {

  if (checkIfNeedLoginToFuga(req.url)) {
    console.log("NEED LOGIN");
    const loginData = {
      "name": config.fuga.apiUserLaFlota,
      "password": config.fuga.apiPasswordLaFlota,
      // "name": config.fuga.apiUser,
      // "password": config.fuga.apiPassword,
      "secure": false,
      "authType": "session"
    };

    const response = await axios.post(`${config.fuga.apiUrl}/login`, loginData);
    if (!response) throw createError(400, 'Error al realizar el Login en Fuga');

    const rawCookies = response.headers['set-cookie'][0].split('; ');
    const cookie = rawCookies[0];

    res.locals = cookie;
    axiosFugaInstance.defaults.headers.Cookie = cookie; // attaching cookie to axiosFugaInstance for future requests
    axiosFugaV2Instance.defaults.headers.Cookie = cookie; // attaching cookie to axiosFugaInstance for future requests
    // axiosFugaInstance.defaults.headers.get['Cookie'] = cookie; // attaching cookie to axiosFugaInstance for future requests
  }
  next();
};

module.exports = loginToFugaIfNeeded;