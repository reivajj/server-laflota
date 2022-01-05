const admin = require('firebase-admin');

const serviceAccount = require('../fbAdminKeys.json');

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log("Firebase connected.");

module.exports = firebaseApp;
