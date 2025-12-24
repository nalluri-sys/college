// Custom authentication service for admin login
const API_URL = 'http://localhost:5000/api';

export interface AdminUser {
  email: string;
  role: 'admin';
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AdminUser;
}

export const adminAuthService = {
  // Login with custom credentials
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
    }
    
    return data;
  },

  // Logout
  async logout(): Promise<void> {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear token from localStorage
    localStorage.removeItem('adminToken');
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('adminToken');
  },

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  },

  // Clear token
  clearToken(): void {
    localStorage.removeItem('adminToken');
  }
};
