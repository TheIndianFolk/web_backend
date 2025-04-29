const { signupUser, loginUser, getUserById } = require('../services/authService');
const jwt = require('jsonwebtoken');

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    await signupUser({ email, password });

    return res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(400).json({ message: error.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token: accessToken } = await loginUser({ email, password });

    const refreshToken = jwt.sign(
      { email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(400).json({ message: error.message });
  }
};


// Refresh Token
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ message: 'Access token refreshed' });
  });
};


// Me Controller (protected)
exports.me = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.password || user.password_hash) {
      const { password, password_hash, ...safeUser } = user;
      return res.json(safeUser);
    }

    res.json(user);
  } catch (error) {
    console.error('Me Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.setHeader('Set-Cookie', [
    'accessToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
    'refreshToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
  ]);

  res.json({ message: 'Logged out successfully' });
};
