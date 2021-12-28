const { getFirestore } = require('firebase-admin/firestore');

// Firebase App lo necesito aca..
const firebaseApp = require('../loaders/firebase');
const { createFBUser } = require('./models/user');
const { getCountUsers, getAllUsers } = require('../services/providers/users');

const dbFS = getFirestore();

const deleteUserInFSByEmail = async email => {
  const usersRef = dbFS.collection('users');
  const snapshotDelete = await usersRef.where('email', '==', email).get();

  if (snapshotDelete.empty) return 'No matching documents.';

  snapshotDelete.forEach(async doc => {
    await usersRef.doc(doc.id).delete();
  });

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

  return { user: usersData[0], exist: true, count: usersData.length };
}


const getUsersStatsFromFS = async () => {
  const statsDoc = await dbFS.collection('users').doc('stats').get();
  if (!statsDoc.exists) throw createHttpError(400, 'DB Error retrieving all users stats from firestore, impossible to find');
  return statsDoc.data();
}

const updateTotalUsersFromFS = async () => {
  const statsDocRef = dbFS.collection('users').doc('stats');
  const totalUsersFromDB = await getCountUsers();
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

const getAndProccesWpUsers = async () => {
  const wpUsers = await getAllUsers();
  const fbUsers = wpUsers.map(wpuser => createFBUser(wpuser));
  return fbUsers;
}

const createUsersInFirestore = async () => {
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

module.exports = { getAllUsersFromFS, createUsersInFirestore, getUsersStatsFromFS, updateTotalUsersFromFS, deleteUserInFSByEmail, getUserInFSByEmail };