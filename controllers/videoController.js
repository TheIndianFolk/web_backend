const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const crypto = require('crypto');

exports.getAllVideos = (req, res) => {
  const {
    search,
    category,
    subCategory,
    sortBy
  } = req.query;

  let sql = 'SELECT * FROM videos WHERE 1';
  const params = [];

  if (search) {
    sql += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }

  if (category) {
    sql += ' AND category_id = ?';
    params.push(category);
  }

  if (subCategory) {
    sql += ' AND sub_category_id = ?';
    params.push(subCategory);
  }

  // Sorting logic
  if (sortBy === 'date') {
    sql += ' ORDER BY created_at DESC';
  } else if (sortBy === 'views') {
    sql += ' ORDER BY views DESC';
  } else if (sortBy === 'duration') {
    sql += ' ORDER BY duration DESC';
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({
      videos: results,
      total: results.length,
    });
  });
};


exports.getVideoById = (req, res) => {
    const videoId = req.params.id;
  
    db.query('SELECT * FROM videos WHERE id = ?', [videoId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Server Error' });
      if (results.length === 0) return res.status(404).json({ message: 'Video not found' });
  
      res.json(results[0]);
    });
  };
  
exports.getVideosByCategory = (req, res) => {
const { slug } = req.params;

const sql = `
    SELECT v.* FROM videos v
    JOIN categories c ON v.category_id = c.id
    WHERE c.slug = ?
`;

db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    res.json(results);
});
};

exports.createVideo = (req, res) => {
    const {
      title,
      description,
      youtube_url,
      s3_url,
      thumbnail_url,
      duration,
      category_id,
      sub_category_id
    } = req.body;
  
    const sql = `
      INSERT INTO videos 
      (title, description, youtube_url, s3_url, thumbnail_url, duration, category_id, sub_category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      title,
      description,
      youtube_url,
      s3_url,
      thumbnail_url,
      duration,
      category_id,
      sub_category_id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server Error' });
      res.status(201).json({ message: 'Video added', video_id: result.insertId });
    });
  };
  
exports.deleteVideo = (req, res) => {
const { id } = req.params;

db.query('DELETE FROM videos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Video not found' });

    res.json({ message: 'Video deleted successfully' });
});
};

exports.updateVideo = (req, res) => {
  const body = req.body || {};       // ensure it's always an object
  const { id } = req.params;

  // Fields you allow clients to update
  const updatable = [
    'title',
    'description',
    'youtube_url',
    's3_url',
    'thumbnail_url',
    'duration',
    'category_id',
    'sub_category_id',
  ];

  // Build SET clauses for only the fields actually sent
  const setClauses = [];
  const values = [];

  updatable.forEach((field) => {
    if (body[field] !== undefined) {
      setClauses.push(`\`${field}\` = ?`);
      values.push(body[field]);
    }
  });

  if (setClauses.length === 0) {
    return res.status(400).json({ message: 'No valid fields provided to update.' });
  }

  // Finalize SQL
  values.push(id);
  const sql = `
    UPDATE videos
    SET ${setClauses.join(', ')}
    WHERE id = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('DB error in updateVideo:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    return res.json({ message: 'Video updated' });
  });
};


  exports.uploadAndProcessVideo = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No video file uploaded' });
  
    const inputPath = req.file.path;
    const hlsId = crypto.randomBytes(8).toString('hex');
    const outputDir = path.join(__dirname, '..', 'uploads', 'hls', hlsId);
    const outputPath = path.join(outputDir, 'index.m3u8');
  
    fs.mkdirSync(outputDir, { recursive: true });
  
    ffmpeg(inputPath)
      .outputOptions([
        '-profile:v baseline', // HLS compatibility
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
      ])
      .output(outputPath)
      .on('end', () => {
        fs.unlinkSync(inputPath); // clean original file
  
        const hlsUrl = `/stream/hls/${hlsId}/index.m3u8`;
        res.status(201).json({ message: 'HLS stream ready', hls_url: hlsUrl });
      })
      .on('error', (err) => {
        console.error('FFmpeg HLS Error:', err);
        res.status(500).json({ message: 'Error creating HLS stream' });
      })
      .run();
  };

  // AWS config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.uploadAndProcessVideo = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No video file uploaded' });

  const inputPath = req.file.path;
  const outputFilename = `${Date.now()}_processed.mp4`;
  const outputPath = path.join(__dirname, '..', 'uploads', 'processed', outputFilename);

  ffmpeg(inputPath)
    .outputOptions('-preset veryfast')
    .toFormat('mp4')
    .on('end', () => {
      // ✅ Read file & upload to S3
      const fileContent = fs.readFileSync(outputPath);
      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `videos/${outputFilename}`,
        Body: fileContent,
        ContentType: 'video/mp4'
      };

      s3.upload(s3Params, (err, data) => {
        if (err) {
          console.error('S3 Upload Error:', err);
          return res.status(500).json({ message: 'Error uploading to S3' });
        }

        // ✅ Save to DB
        const s3Url = data.Location;
        const sql = `
          INSERT INTO videos (title, s3_url, thumbnail_url, duration, category_id, sub_category_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        const { title, thumbnail_url, duration, category_id, sub_category_id } = req.body;

        db.query(sql, [title, s3Url, thumbnail_url, duration, category_id, sub_category_id], (err, result) => {
          if (err) return res.status(500).json({ message: 'Error saving video in DB' });

          // ✅ Clean up files
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          res.status(201).json({ message: 'Video uploaded and saved', s3_url: s3Url });
        });
      });
    })
    .on('error', (err) => {
      console.error('FFmpeg Error:', err);
      res.status(500).json({ message: 'Error processing video' });
    })
    .save(outputPath);
};