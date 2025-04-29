const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getProfile = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT id, email, created_at FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    res.json(result[0]);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { email, password } = req.body;

  const updates = [];
  const values = [];

  if (email) {
    updates.push('email = ?');
    values.push(email);
  }
  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    updates.push('password_hash = ?');
    values.push(hash);
  }

  if (!updates.length) return res.status(400).json({ message: 'Nothing to update' });

  values.push(userId);
  db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values, (err) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    res.json({ message: 'Profile updated' });
  });
};

exports.getWatchlist = (req, res) => {
  const userId = req.user.id;
  db.query(`
    SELECT v.* FROM watchlist w
    JOIN videos v ON v.id = w.video_id
    WHERE w.user_id = ?
  `, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    res.json(result);
  });
};

exports.toggleWatchlist = (req, res) => {
  const userId = req.user.id;
  const { video_id } = req.body;

  db.query('SELECT * FROM watchlist WHERE user_id = ? AND video_id = ?', [userId, video_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' });

    if (result.length > 0) {
      db.query('DELETE FROM watchlist WHERE user_id = ? AND video_id = ?', [userId, video_id], (err) => {
        if (err) return res.status(500).json({ message: 'Server Error' });
        return res.json({ message: 'Removed from watchlist' });
      });
    } else {
      db.query('INSERT INTO watchlist (user_id, video_id) VALUES (?, ?)', [userId, video_id], (err) => {
        if (err) return res.status(500).json({ message: 'Server Error' });
        return res.json({ message: 'Added to watchlist' });
      });
    }
  });
};

exports.getHistory = (req, res) => {
  const userId = req.user.id;
  db.query(`
    SELECT v.*, h.watched_seconds, h.created_at FROM history h
    JOIN videos v ON v.id = h.video_id
    WHERE h.user_id = ?
    ORDER BY h.created_at DESC
  `, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    res.json(result);
  });
};

exports.updateWatchHistory = (req, res) => {
  const { video_id, watched_seconds } = req.body;
  const user_id = req.user.id;

  if (!video_id || !watched_seconds) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if record exists
  const checkSql = 'SELECT * FROM video_watch_history WHERE user_id = ? AND video_id = ?';
  db.query(checkSql, [user_id, video_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length > 0) {
      // Update existing
      const updateSql = `
        UPDATE video_watch_history
        SET watched_seconds = ?
        WHERE user_id = ? AND video_id = ?
      `;
      db.query(updateSql, [watched_seconds, user_id, video_id], (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        return res.json({ message: 'Watch time updated' });
      });
    } else {
      // Insert new
      const insertSql = `
        INSERT INTO video_watch_history (user_id, video_id, watched_seconds)
        VALUES (?, ?, ?)
      `;
      db.query(insertSql, [user_id, video_id, watched_seconds], (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        return res.status(201).json({ message: 'Watch time recorded' });
      });
    }
  });
};
