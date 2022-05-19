const { v4: uuidv4 } = require('uuid');

const { getAllUsersFromDB } = require("../db/users");
const { getAllUsersFromFS, createUsersInUsersAndEmailCollectionFS, createAuthUserWihtUuid } = require("../firebase/firestore/user");
const { createFBUser } = require('../firebase/models/user');
const { createCsvWriter, readCsv, getArrayElementsInFsFromCsv } = require("../utils/csv.utils");

const csvWriterFsUsers = createCsvWriter({
  path: 'migration/0.users.InFS.csv',
  header: [{ id: "userIdWp", title: "userIdWp" }, { id: "email", title: "email" }, { id: "id", title: "id" }]
});

const csvWriterUserMissingInFS = createCsvWriter({
  path: 'migration/1.users.InWpMissingInFs.csv',
  header: [{ id: "userIdWp", title: "userIdWp" }, { id: "email", title: "email" }, { id: "id", title: "id" },
  { id: "userRegistrered", title: "userRegistrered" }]
});

const csvWriterUsersCreated = createCsvWriter({
  path: 'migration/2.users.migratedToFS.csv',
  header: [{ id: "email", title: "email" }, { id: "id", title: "id" }, { id: "status", title: "status" }]
});


const createCsvFromUsersInFS = async () => {
  let allUsers = await getAllUsersFromFS();
  allUsers = allUsers.filter(userInFs => userInFs.email && userInFs.email.length > 0).map(userInFs => {
    return { userIdWp: userInFs.userIdWp, email: userInFs.email.toLowerCase(), id: userInFs.id }
  });
  await csvWriterFsUsers.writeRecords(allUsers);
}

const createCsvFromUsersInWpNotInFS = async () => {
  let usersInFS = await getArrayElementsInFsFromCsv("migration/0.users.InFS.csv");
  let userWpIdsInFs = [...usersInFS].map(userInFs => userInFs.userIdWp);
  let userWpEmailsInFs = [...usersInFS].map(userInFs => userInFs.email);

  let usersInDB = await getAllUsersFromDB();

  let usersInDbAndNotInFsToCsv = usersInDB.filter(userInDb => !userWpIdsInFs.includes(userInDb.id)
    && !userWpEmailsInFs.includes(userInDb.userEmail))

    let usersInDBMissingInFS = usersInDbAndNotInFsToCsv.map(userInDB => {
    return { userIdWp: userInDB.id, email: userInDB.userEmail.toLowerCase(), id: uuidv4(), userRegistrered: userInDB.userRegistrered }
  })

  await csvWriterUserMissingInFS.writeRecords(usersInDBMissingInFS);

  return usersInDbAndNotInFsToCsv;
}

const createBulkAuthUsers = async usersAsFB => {
  let resultInfo = [];
  let counter = 0;
  for (let userAsFb of usersAsFB) {
    let resultCreateAuthUser = await createAuthUserWihtUuid(userAsFb.email, userAsFb.id, userAsFb.id);
    if (resultCreateAuthUser.indexOf("SUCCESS") !== 0) resultInfo.push({ email: userAsFb.email, id: userAsFb.id, status: "ERROR" });
    else resultInfo.push({ email: userAsFb.email, id: userAsFb.id, status: "OK" })
    counter++;
    console.log("CREATED: ", counter, " Auth Users");
  }
  return resultInfo;
}

const createFsUsersFromUsersDbCsv = async () => {
  // let usersInDB = await getArrayElementsInFsFromCsv("migration/users.test.csv");
  let usersInDB = await getArrayElementsInFsFromCsv("migration/1.users.InWpMissingInFs.csv");
  usersInDB = usersInDB.map(userInDB => createFBUser(userInDB));
  let createAuthUsersBulk = await createBulkAuthUsers(usersInDB);
  let createAllResponse = await createUsersInUsersAndEmailCollectionFS(usersInDB);

  await csvWriterUsersCreated.writeRecords(createAuthUsersBulk);
  return createAllResponse;
}

module.exports = { createCsvFromUsersInFS, createCsvFromUsersInWpNotInFS, createFsUsersFromUsersDbCsv }