const createHttpError = require("http-errors");
const db = require("../loaders/sequelize");

const getAllUsersFromDB = async () => {
  const allUsers = db.User.findAll();
  if (!allUsers) throw createHttpError(400, 'DB Error retrieving all users:', { id: albumId, properties: response });

  return allUsers;
}

module.exports = getAllUsersFromDB;