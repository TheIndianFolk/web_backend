const db = require('../config/db');

// Admin: Video analytics
exports.getVideoStats = (req, res) => {
  const sql = `
    SELECT 
      v.id,
      v.title,
      COUNT(h.id) AS total_views,
      SUM(h.watched_seconds) AS total_watch_time
    FROM videos v
    LEFT JOIN video_watch_history h ON v.id = h.video_id
    GROUP BY v.id, v.title
    ORDER BY total_watch_time DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

exports.getSummary = (req, res) => {
  const usersSql = 'SELECT COUNT(*) AS total_users FROM users';
  const videosSql = 'SELECT COUNT(*) AS total_videos FROM videos';

  db.query(usersSql, (err, userResult) => {
    if (err) return res.status(500).json({ message: 'Server error (users)' });

    db.query(videosSql, (err, videoResult) => {
      if (err) return res.status(500).json({ message: 'Server error (videos)' });

      res.json({
        total_users: userResult[0].total_users,
        total_videos: videoResult[0].total_videos
      });
    });
  });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'User deleted successfully' });
    });
  };
  