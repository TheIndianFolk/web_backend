module.exports = {
  "openapi": "3.0.0",
  "info": {
    "title": "Video Streaming API",
    "version": "1.0.0",
    "description": "Centralized Swagger documentation for all APIs"
  },
  "servers": [
    {
      "url": "http://localhost:8000"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "paths": {
    "/ping": {
      "get": {
        "summary": "Health check",
        "tags": [
          "Test"
        ],
        "responses": {
          "200": {
            "description": "pong"
          }
        }
      }
    },
    "/api/auth/signup": {
      "post": {
        "summary": "Register a new user",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email",
                  "password"
                ],
                "properties": {
                  "email": {
                    "type": "string",
                    "example": "testing@example.com"
                  },
                  "password": {
                    "type": "string",
                    "example": "Testing1234"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User created"
          },
          "400": {
            "description": "Email already exists"
          }
        }
      }
    },
    "/api/auth/login": {
      "post": {
        "summary": "Login and receive JWT",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email",
                  "password"
                ],
                "properties": {
                  "email": {
                    "type": "string",
                    "example": "testing@example.com"
                  },
                  "password": {
                    "type": "string",
                    "example": "Testing1234"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Token returned"
          },
          "400": {
            "description": "Invalid credentials"
          }
        }
      }
    },
    "/api/auth/me": {
      "get": {
        "summary": "Get authenticated user info",
        "tags": [
          "Auth"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "User info"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/user/profile": {
      "get": {
        "summary": "Get user profile",
        "tags": [
          "User"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "User profile"
          }
        }
      },
      "put": {
        "summary": "Update email or password",
        "tags": [
          "User"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string",
                    "example": "updated@example.com"
                  },
                  "password": {
                    "type": "string",
                    "example": "newpassword123"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Profile updated"
          }
        }
      }
    },
    "/api/user/watchlist": {
      "get": {
        "summary": "Get user's watchlist",
        "tags": [
          "User"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Watchlist returned"
          }
        }
      },
      "post": {
        "summary": "Toggle video in/out of watchlist",
        "tags": [
          "User"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "video_id"
                ],
                "properties": {
                  "video_id": {
                    "type": "integer",
                    "example": 1
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Watchlist updated"
          }
        }
      }
    },
    "/api/user/history": {
      "get": {
        "summary": "Get watch history",
        "tags": [
          "User"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Watch history with watched_seconds"
          }
        }
      }
    },
    "/api/videos": {
      "get": {
        "summary": "List all videos",
        "tags": [
          "Videos"
        ],
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            },
            "description": "Search videos by title"
          },
          {
            "name": "category_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer"
            },
            "description": "Filter by category ID"
          },
          {
            "name": "sub_category_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer"
            },
            "description": "Filter by subcategory ID"
          }
        ],
        "responses": {
          "200": {
            "description": "List of videos"
          }
        }
      },
      "post": {
        "summary": "Upload or embed a video (admin only)",
        "tags": [
          "Videos"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "title",
                  "youtube_url",
                  "thumbnail_url",
                  "duration",
                  "category_id"
                ],
                "properties": {
                  "title": {
                    "type": "string",
                    "example": "My Test Movie"
                  },
                  "description": {
                    "type": "string",
                    "example": "Short description..."
                  },
                  "youtube_url": {
                    "type": "string",
                    "example": "https://youtube.com/watch?v=abc123"
                  },
                  "s3_url": {
                    "type": "string",
                    "example": ""
                  },
                  "thumbnail_url": {
                    "type": "string",
                    "example": "https://example.com/image.jpg"
                  },
                  "duration": {
                    "type": "integer",
                    "example": 1200
                  },
                  "category_id": {
                    "type": "integer",
                    "example": 1
                  },
                  "sub_category_id": {
                    "type": "integer",
                    "example": 1
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Video uploaded or embedded successfully"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/videos/{id}": {
      "get": {
        "summary": "Get video by ID",
        "tags": [
          "Videos"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "ID of the video to fetch"
          }
        ],
        "responses": {
          "200": {
            "description": "Video details"
          },
          "404": {
            "description": "Video not found"
          }
        }
      },
      "delete": {
        "summary": "Delete a video by ID (admin only)",
        "tags": [
          "Videos"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "ID of the video to delete"
          }
        ],
        "responses": {
          "200": {
            "description": "Video deleted successfully"
          },
          "404": {
            "description": "Video not found"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/videos/category/{slug}": {
      "get": {
        "summary": "Get videos by category slug",
        "tags": [
          "Videos"
        ],
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "Category slug"
          }
        ],
        "responses": {
          "200": {
            "description": "List of videos under category"
          }
        }
      }
    },

    //Catergories
    "/api/categories": {
      get: {
        summary: "Get all categories",
        tags: ["Categories"],
        responses: {
          200: {
            description: "List of all categories",
          }
        }
      },
      post: {
        summary: "Create a new category",
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug"],
                properties: {
                  name: { type: "string", example: "Action" },
                  slug: { type: "string", example: "action" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Category created" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/api/subcategories": {
      get: {
        summary: "Get all subcategories",
        tags: ["Subcategories"],
        responses: {
          200: {
            description: "List of all subcategories",
          }
        }
      },
      post: {
        summary: "Create a new subcategory",
        tags: ["Subcategories"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug", "category_id"],
                properties: {
                  name: { type: "string", example: "Thriller" },
                  slug: { type: "string", example: "thriller" },
                  category_id: { type: "integer", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Subcategory created" },
          401: { description: "Unauthorized" }
        }
      }
    },

    //Tracking & Analytics
    "/api/user/history": {
      post: {
        summary: "Update watch time for a video",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["video_id", "watched_seconds"],
                properties: {
                  video_id: { type: "integer", example: 2 },
                  watched_seconds: { type: "integer", example: 900 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Watch time recorded" },
          200: { description: "Watch time updated" },
          400: { description: "Missing required fields" },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/api/admin/video-stats": {
      get: {
        summary: "Admin: Get total views and watch time per video",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Video stats fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      title: { type: "string" },
                      total_views: { type: "integer" },
                      total_watch_time: { type: "integer" }
                    }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" }
        }
      }
    },

    //Admin Panel
    "/api/admin/summary": {
      get: {
        summary: "Get total users and videos (admin dashboard)",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard summary",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total_users: { type: "integer", example: 12 },
                    total_videos: { type: "integer", example: 34 }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/api/videos/{id}": {
      put: {
        summary: "Update video details (admin)",
        tags: ["Videos"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Video ID"
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Updated Title" },
                  description: { type: "string", example: "Updated description" },
                  youtube_url: { type: "string", example: "https://youtube.com/watch?v=xyz" },
                  s3_url: { type: "string", example: "" },
                  thumbnail_url: { type: "string", example: "https://example.com/updated-thumb.jpg" },
                  duration: { type: "integer", example: 1500 },
                  category_id: { type: "integer", example: 1 },
                  sub_category_id: { type: "integer", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Video updated" },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/api/admin/users/{id}": {
      delete: {
        summary: "Delete a user (admin)",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID"
          }
        ],
        responses: {
          200: { description: "User deleted successfully" },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/api/videos/upload": {
      post: {
        summary: "Upload a raw video, transcode with FFmpeg, and save to S3",
        tags: ["Videos"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["video", "title", "thumbnail_url", "duration", "category_id"],
                properties: {
                  video: {
                    type: "string",
                    format: "binary",
                    description: "Raw video file to upload"
                  },
                  title: {
                    type: "string",
                    example: "My FFmpeg Video"
                  },
                  thumbnail_url: {
                    type: "string",
                    example: "https://example.com/image.jpg"
                  },
                  duration: {
                    type: "integer",
                    example: 900
                  },
                  category_id: {
                    type: "integer",
                    example: 1
                  },
                  sub_category_id: {
                    type: "integer",
                    example: 2
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Video uploaded, processed, and saved to S3" },
          400: { description: "No file uploaded or missing fields" },
          500: { description: "Processing or S3 error" }
        }
      }
    },
  }
};
