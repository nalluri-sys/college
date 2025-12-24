# Running the Full Stack Application

## Prerequisites
- Node.js (v16 or higher)
- npm or bun

## Setup Instructions

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Start the Backend Server
Open a terminal and run:
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

### 4. Start the Frontend Development Server
Open another terminal and run:
```bash
npm run dev
```
Frontend runs on `http://localhost:8080`

## Usage

1. Access the application at `http://localhost:8080`
2. Navigate to Admin Login and sign in
3. Upload materials using the Admin Dashboard
4. Files are stored locally in `backend/uploads/`
5. Browse and download materials from the Materials page

## API Integration

The frontend automatically proxies API requests:
- `/api/*` → `http://localhost:5000/api/*`
- `/uploads/*` → `http://localhost:5000/uploads/*`

See `backend/README.md` for detailed API documentation.
