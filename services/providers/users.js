const getAllUsersFromDB = require("../../db/users");

const getAllUsers = async () => {
  const response = await getAllUsersFromDB();
  return response;
}

// const createLabel = async labelMetadata => {
//   const rawDataLabel = createFugaLabel(labelMetadata);
//   const response = await uploadLabelToProvider(rawDataLabel);

//   return response;
// }

module.exports = getAllUsers;