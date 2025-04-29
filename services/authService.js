const { database } = require('../config/dbChoice');
const mysqlAuth = require('../models/mysqlAuth');
const firebaseAuth = require('../models/firebaseAuth');

// signupUser already exists
async function signupUser(data) {
  if (database === 'mysql') {
    return await mysqlAuth.signup(data);
  } else if (database === 'firebase') {
    return await firebaseAuth.signup(data);
  }
}

// loginUser already exists
async function loginUser(data) {
  if (database === 'mysql') {
    return await mysqlAuth.login(data);
  } else if (database === 'firebase') {
    return await firebaseAuth.login(data);
  }
}

// 🔥 you must ADD this
async function getUserById(id) {
  if (database === 'mysql') {
    return await mysqlAuth.getUserById(id);
  } else if (database === 'firebase') {
    return await firebaseAuth.getUserById(id);
  }
}

module.exports = {
  signupUser,
  loginUser,
  getUserById,
};
