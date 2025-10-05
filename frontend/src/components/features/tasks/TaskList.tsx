import React, { useState, useEffect } from 'react';
import { Task, TaskFilters } from '../../../types';
import { useTasks } from '../../../contexts/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskFiltersComponent } from './TaskFilters';
import { Button } from '../../ui';

interface TaskListProps {
  onCreateTask?: () => void;
  onEditTask?: (task: Task) => void;
}

export const TaskList = ({ onCreateTask, onEditTask }: TaskListProps) => {
  const { tasks, isLoading, error, fetchTasks, updateTask, deleteTask, clearError } = useTasks();
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const serverFilters: TaskFilters = {};
      if (filters.status) {
        serverFilters.status = filters.status;
      }
      fetchTasks(serverFilters);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleStatusChange = async (taskId: number, status: Task['status']) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleRefresh = () => {
    fetchTasks(filters);
  };

  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.dueDateBefore) {
      const beforeDate = new Date(filters.dueDateBefore);
      filteredTasks = filteredTasks.filter(task =>
        task.dueDate && new Date(task.dueDate) <= beforeDate
      );
    }

    if (filters.dueDateAfter) {
      const afterDate = new Date(filters.dueDateAfter);
      filteredTasks = filteredTasks.filter(task =>
        task.dueDate && new Date(task.dueDate) >= afterDate
      );
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  const getTaskStats = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.status === 'COMPLETED').length;
    const inProgress = filteredTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const overdue = filteredTasks.filter(task => task.status === 'OVERDUE').length;
    
    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  if (isLoading && tasks.length === 0) {
    return (
      <div className="task-list-loading">
        <div className="spinner" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div className="task-list-title">
          <h2>Your Tasks</h2>
          <div className="task-stats">
            <span className="stat">Total: {stats.total}</span>
            <span className="stat">Completed: {stats.completed}</span>
            <span className="stat">In Progress: {stats.inProgress}</span>
            {stats.overdue > 0 && (
              <span className="stat overdue">Overdue: {stats.overdue}</span>
            )}
          </div>
        </div>
        
        <div className="task-list-actions">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
          
          {onCreateTask && (
            <Button
              onClick={onCreateTask}
              disabled={isLoading}
            >
              Create Task
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button 
            onClick={clearError}
            className="error-close"
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {showFilters && (
        <TaskFiltersComponent
          currentFilters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />
      )}

      <div className="task-list-body">
        {filteredTasks.length === 0 ? (
          <div className="task-list-empty">
            <h3>No tasks found</h3>
            <p>
              {Object.keys(filters).length > 0
                ? 'Try adjusting your filters or create a new task to get started.'
                : tasks.length === 0 
                  ? 'Create your first task to get started!'
                  : 'No tasks match your current filters.'}
            </p>
            {onCreateTask && (
              <Button onClick={onCreateTask}>
                {tasks.length === 0 ? 'Create Your First Task' : 'Create New Task'}
              </Button>
            )}
          </div>
        ) : (
          <div className={`task-grid ${isLoading ? 'loading' : ''}`}>
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};