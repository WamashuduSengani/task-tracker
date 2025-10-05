import React, { createContext, useContext, useReducer } from 'react';
import { Task, TaskContextType, CreateTaskRequest, UpdateTaskRequest, TaskFilters, ApiError } from '../types';
import { taskService } from '../services/taskService';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'FETCH_TASKS_START' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_ERROR'; payload: string }
  | { type: 'CREATE_TASK_START' }
  | { type: 'CREATE_TASK_SUCCESS'; payload: Task }
  | { type: 'CREATE_TASK_ERROR'; payload: string }
  | { type: 'UPDATE_TASK_START' }
  | { type: 'UPDATE_TASK_SUCCESS'; payload: Task }
  | { type: 'UPDATE_TASK_ERROR'; payload: string }
  | { type: 'DELETE_TASK_START' }
  | { type: 'DELETE_TASK_SUCCESS'; payload: number }
  | { type: 'DELETE_TASK_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
    case 'CREATE_TASK_START':
    case 'UPDATE_TASK_START':
    case 'DELETE_TASK_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        error: null,
      };

    case 'CREATE_TASK_SUCCESS':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        isLoading: false,
        error: null,
      };

    case 'UPDATE_TASK_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        isLoading: false,
        error: null,
      };

    case 'DELETE_TASK_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        isLoading: false,
        error: null,
      };

    case 'FETCH_TASKS_ERROR':
    case 'CREATE_TASK_ERROR':
    case 'UPDATE_TASK_ERROR':
    case 'DELETE_TASK_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = async (filters?: TaskFilters): Promise<void> => {
    dispatch({ type: 'FETCH_TASKS_START' });
    
    try {
      const tasks = await taskService.getAllTasks(filters);
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: tasks });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ 
        type: 'FETCH_TASKS_ERROR', 
        payload: apiError.message || 'Failed to fetch tasks' 
      });
    }
  };

  const createTask = async (taskData: CreateTaskRequest): Promise<void> => {
    dispatch({ type: 'CREATE_TASK_START' });
    
    try {
      const newTask = await taskService.createTask(taskData);
      dispatch({ type: 'CREATE_TASK_SUCCESS', payload: newTask });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ 
        type: 'CREATE_TASK_ERROR', 
        payload: apiError.message || 'Failed to create task' 
      });
      throw error;
    }
  };

  const updateTask = async (id: number, updates: UpdateTaskRequest): Promise<void> => {
    dispatch({ type: 'UPDATE_TASK_START' });
    
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: updatedTask });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ 
        type: 'UPDATE_TASK_ERROR', 
        payload: apiError.message || 'Failed to update task' 
      });
      throw error;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    dispatch({ type: 'DELETE_TASK_START' });
    
    try {
      await taskService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK_SUCCESS', payload: id });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ 
        type: 'DELETE_TASK_ERROR', 
        payload: apiError.message || 'Failed to delete task' 
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: TaskContextType = {
    tasks: state.tasks,
    isLoading: state.isLoading,
    error: state.error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    clearError,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};