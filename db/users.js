const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");

const getAllUsersFromDB = async () => {
  const allUsers = await db.User.findAll();
  if (!allUsers) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });

  return allUsers;
}

const getUserByEmailFromDB = async (email) => {
  const userByEmail = await db.User.findOne({ where: { userEmail: email }});
  if (!userByEmail || !userByEmail.id) throw createHttpError(400, `DB Error retrieving the user with email: ${email}`, { email, properties: userByEmail });

  return userByEmail;
}

module.exports = { getAllUsersFromDB, getUserByEmailFromDB };