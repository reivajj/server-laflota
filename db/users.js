const createHttpError = require("http-errors");

const getAllUsersFromPrismaDB = async () => {
  const allUsers = ["USER 1", "User 2"];
  if (!allUsers) throw createHttpError(400, 'DB Error retrieving all users:', { id: albumId, properties: response });

  return allUsers;
}

module.exports = getAllUsersFromPrismaDB;