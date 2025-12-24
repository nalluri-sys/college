const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// Admin credentials storage (in-memory). In production, use a database.
const admins = new Map();

// Helper to add an admin
function addAdmin(email, password) {
  admins.set(email.toLowerCase(), { email, password });
}

// Seed default admin from env or fallback (change defaults in production)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vvit.edu';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
addAdmin(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);

// Optional signup secret to protect admin registration
const ADMIN_SIGNUP_SECRET = process.env.ADMIN_SIGNUP_SECRET || 'change-me';

// Simple token storage (in production, use a real database)
const validTokens = new Set();

// Generate simple token
function generateToken() {
  return 'token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Verify token
function verifyToken(token) {
  return validTokens.has(token);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, UPLOAD_DIR)));

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Keep original filename
    cb(null, file.originalname);
  }
});

// File filter to accept only specific file types
const fileFilter = function (req, file, cb) {
  // Allowed file types for educational materials
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, and TXT files are allowed.'));
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  }
});

// Authentication middleware - verify admin token
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    if (!verifyToken(token)) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// In-memory database for materials (replace with real database in production)
let materials = [];
let materialIdCounter = 1;

// Routes

// Admin signup (requires ADMIN_SIGNUP_SECRET)
app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password, secret } = req.body;

    if (!email || !password || !secret) {
      return res.status(400).json({ error: 'Email, password, and secret are required' });
    }

    if (secret !== ADMIN_SIGNUP_SECRET) {
      return res.status(403).json({ error: 'Invalid signup secret' });
    }

    const key = email.toLowerCase();
    if (admins.has(key)) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    addAdmin(email, password);
    const token = generateToken();
    validTokens.add(token);

    setTimeout(() => validTokens.delete(token), 24 * 60 * 60 * 1000);

    return res.json({
      success: true,
      message: 'Signup successful',
      token,
      user: { email, role: 'admin' }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// Admin login with stored credentials
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = admins.get((email || '').toLowerCase());
    if (admin && admin.password === password) {
      const token = generateToken();
      validTokens.add(token);

      // Token expires in 24 hours
      setTimeout(() => {
        validTokens.delete(token);
      }, 24 * 60 * 60 * 1000);

      return res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          email: admin.email,
          role: 'admin'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Admin logout
app.post('/api/auth/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      validTokens.delete(token);
    }

    return res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload single file (Admin only)
app.post('/api/upload/single', verifyAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const material = {
      id: materialIdCounter++,
      title: req.body.title || req.file.originalname,
      subject: req.body.subject || 'General',
      semester: req.body.semester || '1',
      type: req.body.type || 'notes',
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };

    materials.push(material);

    res.json({
      message: 'File uploaded successfully',
      material: material
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple files (Admin only)
app.post('/api/upload/multiple', verifyAdmin, upload.array('files', 12), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedMaterials = req.files.map(file => {
      const material = {
        id: materialIdCounter++,
        title: req.body.title || file.originalname,
        subject: req.body.subject || 'General',
        semester: req.body.semester || '1',
        type: req.body.type || 'notes',
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
        uploadedAt: new Date().toISOString()
      };
      materials.push(material);
      return material;
    });

    res.json({
      message: `${req.files.length} files uploaded successfully`,
      materials: uploadedMaterials
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all materials
app.get('/api/materials', (req, res) => {
  const { semester, subject, type } = req.query;
  let filteredMaterials = [...materials];

  if (semester) {
    filteredMaterials = filteredMaterials.filter(m => m.semester === semester);
  }
  if (subject) {
    filteredMaterials = filteredMaterials.filter(m => m.subject === subject);
  }
  if (type) {
    filteredMaterials = filteredMaterials.filter(m => m.type === type);
  }

  res.json(filteredMaterials);
});

// Get single material
app.get('/api/materials/:id', (req, res) => {
  const material = materials.find(m => m.id === parseInt(req.params.id));
  if (!material) {
    return res.status(404).json({ error: 'Material not found' });
  }
  res.json(material);
});

// Delete material (Admin only)
app.delete('/api/materials/:id', verifyAdmin, (req, res) => {
  const materialIndex = materials.findIndex(m => m.id === parseInt(req.params.id));
  
  if (materialIndex === -1) {
    return res.status(404).json({ error: 'Material not found' });
  }

  const material = materials[materialIndex];
  const filePath = path.join(__dirname, UPLOAD_DIR, material.filename);

  // Delete file from disk
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from materials array
  materials.splice(materialIndex, 1);

  res.json({ message: 'Material deleted successfully' });
});

// Download file
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Upload directory: ${path.join(__dirname, UPLOAD_DIR)}`);
});
