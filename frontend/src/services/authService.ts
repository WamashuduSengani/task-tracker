import axios from 'axios';
import { API_BASE_URL, User, LoginRequest, RegisterRequest, AuthResponse, ApiError } from '../types';

const API_URL = `${API_BASE_URL}/auth`;

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const apiError: ApiError = {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        timestamp: new Date().toISOString(),
      };
      throw apiError;
    }
    throw error;
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/register', userData);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/refresh', { refreshToken });
    return response.data;
  },

  setAuthToken(token: string | null) {
    if (token) {
      authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete authApi.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  saveTokens(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    this.setAuthToken(token);
  },

  extractUserFromAuthResponse(authResponse: AuthResponse): User {
    return {
      id: authResponse.userId,
      username: authResponse.username,
      email: '', 
      role: authResponse.role as 'USER' | 'ADMIN'
    };
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.setAuthToken(null);
  },
};