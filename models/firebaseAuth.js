const { db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const usersCollection = db.collection('users');

// Signup
async function signup({ email, password }) {
    const userSnapshot = await usersCollection.where('email', '==', email).get();
    if (!userSnapshot.empty) {
      throw new Error('User already exists');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUserRef = usersCollection.doc();
    await newUserRef.set({
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role: 'user' // default role assigned
    });
  
    const token = jwt.sign({ id: newUserRef.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
    return { token };
  }
  

// Login
async function login({ email, password }) {
  const userSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (userSnapshot.empty) {
    throw new Error('User not found');
  }

  const userData = userSnapshot.docs[0].data();
  const userId = userSnapshot.docs[0].id;

  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

  return { token };
}

// Get User by ID
async function getUserById(id) {
  const userDoc = await usersCollection.doc(id).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
}

module.exports = {
  signup,
  login,
  getUserById,
};