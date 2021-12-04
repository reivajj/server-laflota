const hasher = require('wordpress-hash-node');
const { getAllUsersFromDB, getUserByEmailFromDB } = require("../../db/users");

const getAllUsers = async () => {
  const response = await getAllUsersFromDB();
  return response;
}

const getUserByEmail = async (email) => {
  const response = await getUserByEmailFromDB(email);
  return response;
}

const loginUserWithEmailAndPw = async (email, password) => {
  const userByEmail = await getUserByEmail(email);

  const passwordHashInDB = userByEmail.userPass;
  const checked = hasher.CheckPassword(password, passwordHashInDB);

  return checked;
}

module.exports = { getAllUsers, getUserByEmail, loginUserWithEmailAndPw };