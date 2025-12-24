# VVIT Materials Hub - Backend Server

Express.js backend with Multer for file uploads and local storage.

## Features

- **File Upload**: Single and multiple file uploads using Multer
- **Local Storage**: Files stored in local `uploads/` directory
- **File Types**: PDF, DOC, DOCX, PPT, PPTX, TXT
- **File Size Limit**: 10MB (configurable)
- **REST API**: Complete CRUD operations for materials
- **Static File Serving**: Uploaded files accessible via HTTP

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

**Important**: Replace the Supabase credentials with your actual values from the Supabase dashboard.

## Running the Server

### Development mode with auto-reload:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
All upload and delete endpoints require admin authentication. Include the Supabase session token in the Authorization header:

```
Authorization: Bearer <supabase_access_token>
```

### Health Check
- **GET** `/api/health` - Check server status (No auth required)

### Upload Files (Admin Only)
- **POST** `/api/upload/single` - Upload single file
  - Headers: `Authorization: Bearer <token>`
  - Form data: `file` (file), `title`, `subject`, `semester`, `type`
  
- **POST** `/api/upload/multiple` - Upload multiple files (max 12)
  - Headers: `Authorization: Bearer <token>`
  - Form data: `files[]` (files), `subject`, `semester`, `type`

### Materials CRUD
- **GET** `/api/materials` - Get all materials (No auth required)
  - Query params: `semester`, `subject`, `type`
  
- **GET** `/api/materials/:id` - Get single material (No auth required)
  
- **DELETE** `/api/materials/:id` - Delete material and its file (Admin only)
  - Headers: `Authorization: Bearer <token>`

### Download (No auth required)
- **GET** `/api/download/:filename` - Download file
- **GET** `/uploads/:filename` - Direct file access (static)

## Multer Configuration

### Storage Strategy
```javascript
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: 'basename-timestamp-random.ext'
});
```

### File Filter
Accepts only:
- PDF (.pdf)
- Word documents (.doc, .docx)
- PowerPoint (.ppt, .pptx)
- Text files (.txt)

### Limits
- File size: 10MB (default)
- Max files per request: 12 (for multiple uploads)

## Error Handling

The server handles:
- Authentication errors (401 Unauthorized)
- Authorization errors (403 Forbidden - not admin)
- Multer errors (file size, file type)
- File not found errors
- Invalid request errors
- Server errors

### Common Error Responses

**401 Unauthorized**
```json
{ "error": "No authorization token provided" }
{ "error": "Invalid or expired token" }
```

**403 Forbidden**
```json
{ "error": "Access denied. Admin privileges required." }
``**Authentication**: Uses Supabase for user authentication and admin role verification
- **Admin-only uploads**: Only users with admin role in `user_roles` table can upload/delete files
- Currently uses in-memory storage for material metadata
- Replace `materials` array with real database (MongoDB, PostgreSQL, etc.) for production
- Files are stored with unique names to prevent conflicts
- CORS enabled for frontend integration
- Public endpoints: health check, materials list/get, downloads
- Protected endpoints: upload, delete (require admin authentication)
{ "error": "File size too large. Maximum size is 10MB." }
{ "error": "Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, and TXT files are allowed." }
```

## Directory Structure

```
backend/
├── server.js          # Main Express server
├── package.json       # Dependencies
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── uploads/          # Uploaded files (auto-created)
```

## Development Notes

- Currently uses in-memory storage for material metadata
- Replace `materials` array with real database (MongoDB, PostgreSQL, etc.) for production
- Files are stored with unique names to prevent conflicts
- CORS enabled for frontend integration
