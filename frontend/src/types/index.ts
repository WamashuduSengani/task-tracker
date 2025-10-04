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