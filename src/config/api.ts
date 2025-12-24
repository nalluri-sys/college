// API Configuration
// In production (GitHub Pages), use relative paths or disable API calls
// In development, use localhost:5000

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// For GitHub Pages deployment, we don't have a backend API
// So we'll use mock/empty responses for production
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : '/api'; // This will 404 on GitHub Pages, but we'll handle it gracefully

export const hasBackendAPI = isDevelopment;

export function getApiUrl(path: string): string {
  if (isDevelopment) {
    return `http://localhost:5000${path}`;
  }
  // In production on GitHub Pages, return empty or handle gracefully
  return path;
}
