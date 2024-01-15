// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-file.json'); // Replace with the path to your service account key file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-project-id.firebaseio.com', // Replace with your Firebase project URL
});

module.exports = admin;
