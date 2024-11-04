const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Firebase Admin SDK initialization
const serviceAccount = require('../../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// User sign-up
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    res.status(200).send({ token: customToken });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
