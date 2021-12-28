const { v4: uuidv4 } = require('uuid');
const { ACTIVE } = require('../../utils/utils');

const createFBUser = userFromHosting => {
  let userInFb = {};
  userInFb.idLaFlota = userFromHosting.id;
  userInFb.apellido = "";
  userInFb.nombre = "";
  userInFb.dni = "";
  userInFb.email = userFromHosting.userEmail;
  userInFb.id = uuidv4();
  userInFb.imagenUrl = "";
  userInFb.lastTimeSignedIn = "";
  userInFb.lastTimeSignedInString = "";
  userInFb.provincia = "";
  userInFb.ciudad = "";
  userInFb.plan = "";
  userInFb.telefono = "";
  userInFb.timestampWhenCreatedUser = "";
  userInFb.state = ACTIVE;
  userInFb.dateRegister = userFromHosting.userRegistrered;
  userInFb.userLogin = userFromHosting.userLogin;

  return userInFb;
}

module.exports = { createFBUser };