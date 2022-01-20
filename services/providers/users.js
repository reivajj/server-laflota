const hasher = require('wordpress-hash-node');
const { getAllUsersFromDB, getUserByEmailFromDB, getCountUsersFromDB } = require("../../db/users");

const getAllUsersWP = async () => {
  const response = await getAllUsersFromDB();
  return response;
}

const getCountUsersWP = async () => {
  const response = await getCountUsersFromDB();
  return response;
}

const getUserByEmailWP = async (email) => {
  const response = await getUserByEmailFromDB(email);
  return response;
}

const loginUserWithEmailAndPwWP = async (email, password) => {
  const userByEmailResponse = await getUserByEmailWP(email);
  const passwordHashInDB = userByEmailResponse.user.userPass;
  const checked = hasher.CheckPassword(password, passwordHashInDB);

  return checked;
}

module.exports = { getAllUsersWP, getUserByEmailWP, loginUserWithEmailAndPwWP, getCountUsersWP };