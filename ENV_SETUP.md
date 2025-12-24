# Environment Variables Setup

## Frontend Environment Variables

Create a `.env.local` file in the root directory (never commit this):

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For GitHub Pages Deployment

Create `.env.production` for production builds:

```env
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Backend Environment Variables

Create a `.env` file in the `backend/` directory (never commit this):

```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=50000000
```

### For Production (Render/Railway/Heroku)

Add these environment variables in your hosting provider's dashboard:

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CORS_ORIGIN=https://nalluri-sys.github.io/vvit-website/
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=50000000
```

## How to Get Supabase Keys

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to Settings → API
4. Copy:
   - **SUPABASE_URL**: Project URL
   - **SUPABASE_ANON_KEY**: anon public key (for frontend)
   - **SUPABASE_SERVICE_ROLE_KEY**: service_role key (for backend only)

⚠️ **NEVER share service_role_key publicly!**

## GitHub Secrets Setup

For CI/CD, add these secrets to your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret" and add:

### Essential Secrets

```
RENDER_API_KEY=your_render_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Optional Secrets (for other services)

```
VERCEL_TOKEN=your_vercel_token
HEROKU_API_KEY=your_heroku_api_key
RAILWAY_API_TOKEN=your_railway_token
```

## How to Get Service Tokens

### Render API Key
1. Go to https://dashboard.render.com
2. Account → API Tokens
3. Create new token

### Railway Token
1. Go to https://railway.app
2. Account → Tokens
3. Create new token

### Vercel Token
1. Go to https://vercel.com
2. Account → Tokens
3. Create new token

## Local Development Setup

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Create Environment Files

**Root `.env.local`:**
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_key>
```

**Backend `.env`:**
```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
CORS_ORIGIN=http://localhost:5173
```

### 3. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Access at: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Access at: http://localhost:3000

## Production Environment Variables

After deploying to GitHub Pages and your backend hosting service, update:

1. **Frontend API calls** - change `VITE_BACKEND_URL` to production URL
2. **Backend CORS** - update `CORS_ORIGIN` to GitHub Pages URL
3. **Supabase Settings** - ensure production project is used

## Verification Checklist

- [ ] `.env*` files are in `.gitignore`
- [ ] No secrets are committed to GitHub
- [ ] Environment variables are set in hosting provider dashboards
- [ ] Frontend correctly references production backend URL
- [ ] Backend CORS allows frontend domain
- [ ] Supabase credentials are valid for your project
