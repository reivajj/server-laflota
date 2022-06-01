const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');

// Firebase App lo necesito aca..
const { getCountUsersWP, getAllUsersWP } = require('../../services/providers/users');
const { createFBUser } = require('../models/user');
const { batchActions } = require('../utils');
const { ACTIVE, MIGRATED } = require('../../utils/utils')

const dbFS = admin.firestore();
const auth = admin.auth();

const deleteUserInFSAndAuthByEmail = async (email, onlyInUsers) => {
  const usersRef = dbFS.collection('users');
  const snapshotDelete = await usersRef.where('email', '==', email.toLowerCase()).get();

  if (snapshotDelete.empty) return 'No matching documents.';

  let userId = "";
  snapshotDelete.forEach(async doc => {
    userId = doc.id;
    await usersRef.doc(doc.id).delete();
  });

  const elementStatsDbRef = dbFS.collection('users').doc('stats');
  await elementStatsDbRef.update({ total: admin.firestore.FieldValue.increment(-1) });

  if (onlyInUsers) return "Delete only in users successed";

  const usersByEmailRef = dbFS.collection('usersByEmail').doc(email);
  const snapshotByEmailDelete = await usersByEmailRef.delete();

  const usersByEmailStatsDbRef = dbFS.collection('usersByEmail').doc('stats');
  await usersByEmailStatsDbRef.update({ total: admin.firestore.FieldValue.increment(-1) });

  const deleteAuthUser = await auth.deleteUser(userId);
  return "Delete successed";
}

const getUserInFSByEmail = async email => {
  const usersRef = dbFS.collection('users');
  const snapshotGet = await usersRef.where('email', '==', email.toLowerCase()).get();

  if (snapshotGet.empty) return { exist: false };

  let usersData = {};
  snapshotGet.forEach(doc => {
    usersData = doc.data();
  });

  return { user: usersData, exist: true, count: usersData.length };
}

const updateAllUsersFS = async infoToUpdate => {
  const snapshot = await dbFS.collection('users').get();
  let usersRefs = [];
  let updateWith = [];

  snapshot.forEach((doc) => {
    updateWith.push(infoToUpdate);
    usersRefs.push(doc.ref);
  });

  const result = await batchActions(usersRefs, "update", updateWith, "", "users", batchSize = 200);
  return result;
}

const updateUserInFSByEmail = async (email, fieldsToUpdate) => {
  const usersRef = dbFS.collection('users');
  const snapshotGet = await usersRef.where('email', '==', email).limit(1).get();

  if (snapshotGet.empty) return { exist: false };

  const resultUpdate = await snapshotGet.docs[0].ref.update(fieldsToUpdate);
  const snapshotGetUpdated = await usersRef.where('email', '==', email).limit(1).get();

  let usersData = [];
  snapshotGetUpdated.forEach(doc => {
    usersData.push(doc.data());
  });

  return { user: usersData[0], exist: true, count: usersData.length, resultUpdate };
}

const createAuthUserWihtUuid = async (userEmail, newPassword, id) => {
  let result = await auth.createUser({ email: userEmail, uid: id, password: newPassword }).catch(error => error);
  return `SUCCESS: Auth User Created: ${userEmail}`;
}

const updatePasswordByEmailInFS = async (userEmail, newPassword) => {
  const userDataFS = await getUserInFSByEmail(userEmail);
  let newData = { password: newPassword };

  // Para los que entran por primera vez y fueron migrados.
  if (userDataFS.user.userStatus === MIGRATED) newData.userStatus = ACTIVE;

  let updateAuthUser = await auth.updateUser(userDataFS.user.id, { password: newPassword }).catch(error => {
    console.log(error);
    return "Error al actualizar el Auth User";
  });

  let updateUserDocResult = await updateUserInFSByEmail(userEmail, newData);
  return updateUserDocResult;
}

const getArtistsFromUserIdFS = async ownerId => {
  console.log("ARTIST OWNER ID: ", ownerId)
  const artistsSnap = await dbFS.collection('artists').where('ownerId', '==', ownerId).get();
  if (artistsSnap.empty) return { emtpy: true };

  let artistsData = [];
  artistsSnap.forEach(artistDoc => artistsData.push(artistDoc.data()));
  return artistsData;
}

const getUserArtistsInFSByEmail = async email => {
  const userDataFS = await getUserInFSByEmail(email);
  console.log("USER DATA: ", userDataFS);
  const artistsFromOwnerIdFS = await getArtistsFromUserIdFS(userDataFS.user.id);
  return artistsFromOwnerIdFS;
}

const getUsersStatsFromFS = async () => {
  const statsDoc = await dbFS.collection('users').doc('stats').get();
  if (!statsDoc.exists) throw createHttpError(400, 'DB Error retrieving all users stats from firestore, impossible to find');
  return statsDoc.data();
}

const updateTotalUsersFromFS = async () => {
  const statsDocRef = dbFS.collection('users').doc('stats');
  const totalUsersFromDB = await getCountUsersWP();
  const updateResponse = statsDocRef.update({ total: totalUsersFromDB });
  return updateResponse;
}

const getAllUsersFromFS = async () => {
  const snapshot = await dbFS.collection('users').get();
  const allUsers = [];
  snapshot.forEach((doc) => allUsers.push(doc.data()));
  if (!allUsers) throw createHttpError(400, 'DB Error retrieving all users from firestore:', { properties: allUsers });
  return allUsers;
}

const getUserByIdFromFS = async userId => {
  const userSnap = await dbFS.collection('users').doc(userId).get();
  if (!userSnap.exists) return { data: "USER_NOT_EXISTS"};
  if (!userSnap) throw createHttpError(400, 'DB Error retrieving all users from firestore:', { properties: allUsers });
  return userSnap.data();
}

// Y esto???
const deleteWpUsersNotLoggedInFS = async () => {
  let queryRef = dbFS.collection('users').where("idLaFlota", "<=", 10000);
  // queryRef = queryRef.limit(5);
  let queryResultSnapshot = await queryRef.get();

  if (queryResultSnapshot.empty) return "Docs not found."

  let deleteResults = [];
  queryResultSnapshot.forEach(async userDoc => {
    let deleteResult = await userDoc.ref.delete();
    deleteResults.push(deleteResult);
  })

  return deleteResults;
}

const deleteAllUsersNotInFB = async () => {
  const response = await deleteWpUsersNotLoggedInFS();
  return response;
}

const getAndProccesWpUsers = async () => {
  const wpUsers = await getAllUsersWP();
  const fbUsers = wpUsers.map(wpuser => createFBUser(wpuser));
  return fbUsers;
}

const createUsersInUsersAndEmailCollectionFS = async usersAsFbModels => {
  let batch = dbFS.batch();
  let counter = 0;
  let totalCounter = 0;
  const promises = [];

  for (const user of usersAsFbModels) {
    const docRef = dbFS.collection("users").doc(user.id);
    const docEmailRef = dbFS.collection("usersByEmail").doc(user.email);
    batch.set(docRef, { ...user });
    batch.set(docEmailRef, { ...user });

    counter++;

    if (counter >= 250) {
      console.log(`Committing batch of ${counter}`);
      promises.push(batch.commit());
      totalCounter += counter;
      counter = 0;
      batch = dbFS.batch();
    }
  }

  if (counter) {
    console.log(`Committing batch of ${counter}`);
    promises.push(batch.commit());
    totalCounter += counter;
  }
  await Promise.all(promises);
  console.log(`Committed total of ${totalCounter}`);

  return `Total creates ${totalCounter}`;
}

//=====================================================MIGRATION==========================================================\\

module.exports = {
  getAllUsersFromFS, createUsersInUsersAndEmailCollectionFS, getUsersStatsFromFS, updateTotalUsersFromFS, deleteUserInFSAndAuthByEmail,
  getUserInFSByEmail, updateUserInFSByEmail, deleteAllUsersNotInFB, getUserArtistsInFSByEmail, updatePasswordByEmailInFS,
  updateAllUsersFS, createAuthUserWihtUuid, getUserByIdFromFS
};