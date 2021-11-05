const getAllUsersFromPrismaDB = require("../../db/users");

const getAllUsers = async () => {
  const response = await getAllUsersFromPrismaDB();
  return response;
}

// const createLabel = async labelMetadata => {
//   const rawDataLabel = createFugaLabel(labelMetadata);
//   const response = await uploadLabelToProvider(rawDataLabel);

//   return response;
// }

module.exports = getAllUsers;