const db = require('../config/db');

const UserModel = {
  // 🔍 Find user by email
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  // 🆕 Create new user (email, password, role)
  create: (email, passwordHash, role, callback) => {
    db.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role],
      callback
    );
  },

  // 🔁 Find user by ID (for /me)
  findById: (id, callback) => {
    db.query(
      'SELECT id, email, role, created_at FROM users WHERE id = ?',
      [id],
      callback
    );
  }
};

module.exports = UserModel;
