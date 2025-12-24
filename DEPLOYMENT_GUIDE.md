# Deployment Guide

## Project Structure

```
vvit-website/
├── src/                 # Frontend (React + Vite)
├── backend/             # Backend (Node.js + Express)
├── dist/                # Built frontend (deployed to GitHub Pages)
└── .github/workflows/   # CI/CD pipelines
```

## Frontend Deployment (GitHub Pages)

### 1. GitHub Pages Configuration

1. Go to your repository settings: https://github.com/nalluri-sys/vvit-website/settings/pages
2. Under "Build and deployment":
   - **Source**: Deploy from a branch (or GitHub Actions)
   - **Branch**: `gh-pages` (automatically created by the workflow)
3. Your site will be available at: `https://nalluri-sys.github.io/vvit-website/`

### 2. Vite Configuration for GitHub Pages

Update `vite.config.ts` if you want to deploy to a subdirectory:

```typescript
export default defineConfig({
  base: '/vvit-website/',  // Only if deploying to subdirectory
  // ... rest of config
})
```

If deploying to a custom domain, remove or adjust the `base` setting.

### 3. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
- ✅ Builds the frontend when you push to `main`
- ✅ Deploys to GitHub Pages
- ✅ No manual intervention needed

## Backend Deployment

GitHub Pages **cannot** host backends. Choose one:

### Option 1: Render (Free Tier Available)
1. Sign up at https://render.com
2. Connect your GitHub account
3. Create a new Web Service
4. Select the `backend` directory as root
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables in Render dashboard

### Option 2: Railway (Simple & Fast)
1. Sign up at https://railway.app
2. Connect GitHub repository
3. Select `backend` folder
4. Deploy automatically

### Option 3: Vercel (Supports Node.js)
1. Go to https://vercel.com
2. Import your GitHub repo
3. Set root directory to `backend`
4. Deploy

### Option 4: Heroku (Traditional)
1. Sign up at https://heroku.com
2. Install Heroku CLI
3. Add `Procfile` to backend:
   ```
   web: npm start
   ```
4. Deploy with Heroku CLI

## Environment Variables

### Frontend (.env)
```
VITE_BACKEND_URL=https://your-backend-url.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

### Backend (.env in backend/)
```
NODE_ENV=production
PORT=3000
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
CORS_ORIGIN=https://nalluri-sys.github.io/vvit-website
```

## Manual Deployment Steps

### Frontend to GitHub Pages
```bash
# Build the frontend
npm run build

# Deploy using gh-pages (if configured)
npm run deploy
```

### Backend to Your Hosting Service
```bash
cd backend
npm install
npm start
```

## Monitoring & Logs

### GitHub Actions Logs
1. Go to your repository
2. Click "Actions" tab
3. View workflow runs and logs

### Backend Logs
Check your hosting provider's dashboard for logs:
- **Render**: Dashboard → Web Service → Logs
- **Railway**: Project → Logs
- **Vercel**: Deployments → Logs
- **Heroku**: `heroku logs --tail`

## CI/CD Pipeline

The automated workflow (`.github/workflows/deploy.yml`):

1. **On Push to Main**:
   - Install dependencies
   - Build frontend (Vite)
   - Deploy to GitHub Pages
   - Test backend (optional)

2. **Pull Requests**:
   - Run linting
   - Build to verify no errors
   - (Does not deploy)

## Troubleshooting

### GitHub Pages shows old content
```bash
# Clear cache
git rm -r --cached .
git add .
git commit -m "Clear cache"
git push
```

### Build fails in GitHub Actions
- Check workflow logs in Actions tab
- Verify all dependencies are in package.json
- Check for hardcoded local paths

### CORS errors with backend
- Update `CORS_ORIGIN` in backend `.env`
- Ensure frontend makes requests to correct backend URL

### Backend not starting
```bash
# Test locally
cd backend
npm install
npm start

# Check logs on your hosting service
```

## Best Practices

✅ **Do:**
- Keep secrets in GitHub Secrets, not in code
- Use environment variables for configuration
- Test locally before pushing
- Add meaningful commit messages
- Use branch protection rules

❌ **Don't:**
- Commit `.env` files
- Deploy node_modules
- Use hardcoded URLs
- Leave console.logs in production code

## Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Render Deployment](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
