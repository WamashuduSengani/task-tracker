import axios from 'axios';
import { API_BASE_URL, Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters, ApiError } from '../types';
import { authService } from './authService';

const API_URL = `${API_BASE_URL}/tasks`;

const taskApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

taskApi.interceptors.request.use(
  (config) => {
    const token = authService.getStoredToken();
    console.log('TaskService request interceptor:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

taskApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TaskService API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication error, clearing stored tokens');
      authService.clearTokens();
      const authEvent = new CustomEvent('auth-error', { detail: { status: error.response.status } });
      window.dispatchEvent(authEvent);
      return Promise.reject(error);
    }
    
    if (error.response?.status === 500 && error.response?.data?.message?.includes('User not found')) {
      console.warn('Server error due to invalid user token, clearing stored tokens');
      authService.clearTokens();
      const authEvent = new CustomEvent('auth-error', { detail: { status: 401 } });
      window.dispatchEvent(authEvent);
      return Promise.reject(error);
    }
    
    if (error.response?.data) {
      const apiError: ApiError = {
        message: error.response.data.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
        status: error.response.status,
        timestamp: new Date().toISOString(),
      };
      throw apiError;
    }
    throw error;
  }
);

export const taskService = {
  async getAllTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status.trim() !== '') {
      params.append('status', filters.status);
    }
    if (filters?.dueDateBefore && filters.dueDateBefore.trim() !== '') {
      params.append('dueDateBefore', filters.dueDateBefore);
    }
    if (filters?.dueDateAfter && filters.dueDateAfter.trim() !== '') {
      params.append('dueDateAfter', filters.dueDateAfter);
    }
    if (filters?.assignedUserId && filters.assignedUserId > 0) {
      params.append('assignedUserId', filters.assignedUserId.toString());
    }
    if (filters?.search && filters.search.trim() !== '') {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString();
      let url = '';
      if (queryString) {
        url = `?${queryString}`;
      }
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      if (url.startsWith('/?')) url = url.replace('/?', '?');
      const response = await taskApi.get<Task[]>(`${baseUrl}${url}`);
      return response.data;
  },

  async getTaskById(id: number): Promise<Task> {
    const response = await taskApi.get<Task>(`/${id}`);
    return response.data;
  },

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await taskApi.post<Task>('', task);
    return response.data;
  },

  async updateTask(id: number, updates: UpdateTaskRequest): Promise<Task> {
    const response = await taskApi.put<Task>(`/${id}`, updates);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await taskApi.delete(`/${id}`);
  },

  async assignTask(taskId: number, userId: number): Promise<Task> {
    const response = await taskApi.post<Task>(`/${taskId}/assign/${userId}`);
    return response.data;
  },

  async unassignTask(taskId: number): Promise<Task> {
    const response = await taskApi.post<Task>(`/${taskId}/unassign`);
    return response.data;
  },

  getStatusColor(status: Task['status']): string {
    switch (status) {
      case 'NEW':
        return '#3b82f6'; 
      case 'IN_PROGRESS':
        return '#f59e0b';
      case 'COMPLETED':
        return '#10b981'; 
      case 'DELAYED':
        return '#f97316';
      case 'OVERDUE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  },

  getStatusLabel(status: Task['status']): string {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'DELAYED':
        return 'Delayed';
      case 'OVERDUE':
        return 'Overdue';
      default:
        return status;
    }
  },

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'COMPLETED';
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};