export const API_BASE_URL = 'http://localhost:8080/api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'OVERDUE';
  dueDate: string | null;
  createdDate: string;
  assignedUserId: number | null;
  assignedUserName: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: Task['status'];
  dueDate?: string | null;
}

export interface TaskFilters {
  status?: Task['status'];
  dueDateBefore?: string;
  dueDateAfter?: string;
  assignedUserId?: number;
  search?: string;
}

export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (task: CreateTaskRequest) => Promise<void>;
  updateTask: (id: number, updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  clearError: () => void;
}