const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

// 🚀 Signup Controller
exports.signup = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  // 🕵️ Check if user already exists
  UserModel.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    if (result?.length > 0)
      return res.status(400).json({ message: 'Email already exists' });

    const passwordHash = bcrypt.hashSync(password, 10);

    // 👤 New users always default to "user" role
    const role = 'user';

    UserModel.create(email, passwordHash, role, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server Error' });
      return res.status(201).json({ message: 'User created' });
    });
  });
};

// 🔐 Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;

  UserModel.findByEmail(email, (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 🔐 Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful' });
  });
};


// Me controller (protected)
exports.me = (req, res) => {
  // req.user was set by verifyJWT
  UserModel.findById(req.user.id, (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ message: 'User not found' });
    // never send password hash
    const { password_hash, ...user } = results[0];
    res.json(user);
  });
};

// Logout controller
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',           // ← same path as when it was set
  });
  // double‑check by explicitly setting a blank cookie too:
  res.setHeader(
    'Set-Cookie',
    'token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax'
  );
  res.json({ message: 'Logged out successfully' });
};