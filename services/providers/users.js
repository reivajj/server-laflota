const hasher = require('wordpress-hash-node');
const { getAllUsersFromDB, getUserByEmailFromDB, getCountUsersFromDB } = require("../../db/users");

const getAllUsers = async () => {
  const response = await getAllUsersFromDB();
  return response;
}

const getCountUsers = async () => {
  const response = await getCountUsersFromDB();
  return response;
}

const getUserByEmail = async (email) => {
  const response = await getUserByEmailFromDB(email);
  return response;
}

const loginUserWithEmailAndPw = async (email, password) => {
  const userByEmailResponse = await getUserByEmail(email);
  const passwordHashInDB = userByEmailResponse.user.userPass;
  const checked = hasher.CheckPassword(password, passwordHashInDB);

  return checked;
}

module.exports = { getAllUsers, getUserByEmail, loginUserWithEmailAndPw, getCountUsers };