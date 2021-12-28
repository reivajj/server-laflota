const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');

const serviceAccount = require('../fbAdminKeys.json');

const firebaseApp = initializeApp({
  credential: cert(serviceAccount)
});
console.log("Firebase connected.");

module.exports = firebaseApp;
