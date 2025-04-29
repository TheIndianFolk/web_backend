const UserModel = require('./UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Signup using MySQL
async function signup({ email, password }) {
  return new Promise((resolve, reject) => {
    UserModel.findByEmail(email, (err, result) => {
      if (err) return reject(new Error('Server Error'));
      if (result?.length > 0) return reject(new Error('Email already exists'));

      const passwordHash = bcrypt.hashSync(password, 10);
      const role = 'user';

      UserModel.create(email, passwordHash, role, (err) => {
        if (err) return reject(new Error('Server Error'));
        resolve({ message: 'User created' });
      });
    });
  });
}

// Login using MySQL
async function login({ email, password }) {
  return new Promise((resolve, reject) => {
    UserModel.findByEmail(email, (err, results) => {
      if (err || results.length === 0) return reject(new Error('Invalid email or password'));

      const user = results[0];
      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) return reject(new Error('Invalid email or password'));

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      resolve({ token });
    });
  });
}

// Get user by ID using MySQL
async function getUserById(id) {
  return new Promise((resolve, reject) => {
    UserModel.findById(id, (err, results) => {
      if (err || results.length === 0) return resolve(null);

      const user = results[0];
      resolve(user);
    });
  });
}

module.exports = {
  signup,
  login,
  getUserById,
};
