const createHttpError = require("http-errors");
const prisma = require("../loaders/prisma");

const getAllUsersFromPrismaDB = async () => {
  const allUsers = await prisma.user.findMany();
  if (!allUsers) throw createHttpError(400, 'DB Error retrieving all users:', { id: albumId, properties: response });

  return allUsers;
}

module.exports = getAllUsersFromPrismaDB;