const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://indianfolk2.firebaseio.com" // Update with your project ID
  });

module.exports = admin;
