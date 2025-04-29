const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middlewares/verifyToken'); 

dotenv.config();

const app = express();

// Parse cookies on **every** request, before routes
app.use(cookieParser());

// Enable CORS + credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

const authorizeRole = require('./middlewares/authorizeRole');

app.use(
  '/api/admin',
  verifyToken,
  authorizeRole('admin'),
  require('./routes/adminRoutes')
);


// Parse JSON bodies
app.use(express.json());

// Swagger, static, and your routes
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', (req, res) => res.send('🎬 Welcome to the Video Streaming API! Visit /api-docs for Swagger UI.'));
app.get('/ping', (req, res) => res.send('pong'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/stream/hls', express.static(path.join(__dirname, 'uploads/hls')));

module.exports = app;
