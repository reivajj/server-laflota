const admin = require('firebase-admin');
const firebaseApp = require('../../loaders/firebase');

// Firebase App lo necesito aca..
const { getCountUsersWP, getAllUsersWP } = require('../../services/providers/users');
const { createFBUser } = require('../models/user');

const dbFS = admin.firestore();
const auth = admin.auth();

const deleteUserInFSByEmail = async email => {
  const usersRef = dbFS.collection('users');
  const snapshotDelete = await usersRef.where('email', '==', email).get();

  if (snapshotDelete.empty) return 'No matching documents.';

  snapshotDelete.forEach(async doc => {
    await usersRef.doc(doc.id).delete();
  });

  const elementStatsDbRef = dbFS.collection('users').doc('stats');
  await elementStatsDbRef.update({ total: admin.firestore.FieldValue.increment(-1) });

  const usersByEmailRef = dbFS.collection('usersByEmail').doc(email);
  const snapshotByEmailDelete = await usersByEmailRef.delete();

  const usersByEmailStatsDbRef = dbFS.collection('usersByEmail').doc('stats');
  await usersByEmailStatsDbRef.update({ total: admin.firestore.FieldValue.increment(-1) });

  return "Delete successed";
}

const getUserInFSByEmail = async email => {
  const usersRef = dbFS.collection('users');
  const snapshotGet = await usersRef.where('email', '==', email).get();

  if (snapshotGet.empty) return { exist: false };

  let usersData = [];
  snapshotGet.forEach(doc => {
    usersData.push(doc.data());
  });

  return { user: usersData, exist: true, count: usersData.length };
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

const getArtistsFromUserIdFS = async ownerId => {
  const artistsSnap = await dbFS.collection('artists').where('ownerId', '==', ownerId).get();
  if (artistsSnap.empty) return { emtpy: true };

  let artistsData = [];
  artistsSnap.forEach(artistDoc => artistsData.push(artistDoc.data()));
  return artistsData;
}

const getUserArtistsInFSByEmail = async email => {
  const userDataFS = await getUserInFSByEmail(email);
  const artistsFromOwnerIdFS = await getArtistsFromUserIdFS(userDataFS.user[0].id);
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

  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
    allUsers.push(doc.data());
  });

  if (!allUsers) throw createHttpError(400, 'DB Error retrieving all users from firestore:', { properties: allUsers });

  return allUsers;
}

const updatePasswordByEmailInFS = async (userEmail, newPassword) => {
  console.log("DATA: ", { userEmail, newPassword });
  const userDataFS = await getUserInFSByEmail(userEmail);
  console.log("UID: ", userDataFS.user);
  auth.updateUser(userDataFS.user[0].id, {
    password: newPassword,
  })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON());
      return userRecord;
    })
    .catch((error) => {
      console.log('Error updating user:', error);
    });

}

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

const createUsersInFS = async () => {
  let batch = dbFS.batch();
  let counter = 0;
  let totalCounter = 0;
  const promises = [];

  const wpUsersToUploadToFS = await getAndProccesWpUsers();

  for (const user of wpUsersToUploadToFS) {
    const docRef = dbFS.collection("users").doc(user.id);
    batch.set(docRef, {
      ...user
    });

    counter++;

    if (counter >= 500) {
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

module.exports = {
  getAllUsersFromFS, createUsersInFS, getUsersStatsFromFS, updateTotalUsersFromFS, deleteUserInFSByEmail,
  getUserInFSByEmail, updateUserInFSByEmail, deleteAllUsersNotInFB, getUserArtistsInFSByEmail, updatePasswordByEmailInFS
};