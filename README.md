# Video Streaming Backend API Reference

## Test Route
```
GET /ping  
*Health check route — should return `pong`*
```

---

## Auth APIs
```
POST /api/auth/signup  
*Register with email and password*

POST /api/auth/login  
*Login and receive JWT token*

GET /api/auth/me  
*Get current user info (requires JWT token in `Authorization` header)*
```

---

## User APIs

### Profile
```
GET /api/user/profile  
*Get profile of logged-in user*

PUT /api/user/profile  
*Update user email and/or password*
```

### Watchlist
```
GET /api/user/watchlist  
*Get user's saved videos*

POST /api/user/watchlist  
*Toggle a video in/out of watchlist (send { "video_id": number })*
```

### Watch History
```
GET /api/user/history  
*Get watch history with watched_seconds for each video*
```

---

## Video APIs
```
GET /api/videos                     # List all videos
GET /api/videos/:id                  # Get single video details
GET /api/videos/category/:slug       # List videos by category
POST /api/videos                     # Upload or embed video (admin only)
DELETE /api/videos/:id               # Delete a video (admin only)
```

---

## Category & Subcategory APIs
```
GET /api/categories        # List all categories
POST /api/categories       # Add a new category
GET /api/subcategories      # List all subcategories
POST /api/subcategories     # Add a new subcategory
```

---

## View Tracking & Analytics
```
POST /api/user/history      # Save or update watched time (per video/user)
GET /api/admin/video-stats   # Admin view: total views and total watch time per video
```

---

## Admin Panel APIs
```
GET /api/admin/summary       # Get total users and videos
PUT /api/videos/:id          # Edit video details (title, URL, category, etc.)
DELETE /api/admin/users/:id  # Delete user by ID
GET /api/videos              # Filter videos by search, category_id, sub_category_id
```

---

# Project Progress

---

## File Upload + FFmpeg Transcoding & S3 Integration
```
POST /api/videos/upload      # Upload raw video, transcode with FFmpeg, upload to S3, and save in DB
```

- Upload handled using `multer`
- Transcoding via `fluent-ffmpeg` to `.mp4`
- File pushed to AWS S3 using `aws-sdk`
- Video metadata and `s3_url` saved in `videos` table
- Swagger UI documented
- JWT protected and tested

