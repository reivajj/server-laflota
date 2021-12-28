const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");

const getAllUsersFromDB = async () => {
  const allUsers = await db.User.findAll({ raw: true });
  if (!allUsers) throw createHttpError(400, 'DB Error retrieving all users:', { properties: allUsers });

  return allUsers;
}

const getCountUsersFromDB = async () => {
  const allUsersCount = await db.User.count();
  if (!allUsersCount) throw createHttpError(400, 'DB Error retrieving all users count:', { properties: allUsers });

  return allUsersCount;
}

const getUserByEmailFromDB = async (email) => {
  const userByEmail = await db.User.findOne({ where: { userEmail: email }, raw: true });
  if (!userByEmail || !userByEmail.id) return { exist: false };

  return { exist: true, user: userByEmail };
}

module.exports = { getAllUsersFromDB, getUserByEmailFromDB, getCountUsersFromDB };