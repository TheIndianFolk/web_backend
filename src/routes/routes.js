const express = require('express');
const admin = require('../../config/firebase');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName, mobileNumber } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        res.status(201).json({ uid: userRecord.uid });
    } catch (error) {
        // Handle the specific error for duplicate email
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: "Email is already in use. Please try logging in." });
        }
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await admin.auth().getUserByEmail(email);
        // Here, you would typically validate the password.
        // Firebase Admin SDK doesn't provide direct password verification.
        // You might need to handle this with Firebase Authentication SDK on the client-side.
        res.json({ uid: user.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;