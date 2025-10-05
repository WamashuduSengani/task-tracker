import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TaskProvider, useTasks } from '../contexts/TaskContext';
import { Button } from '../components/ui';
import { TaskList, TaskForm } from '../components/features/tasks';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

const DashboardContent = () => {
  const { user, logout } = useAuth();
  const { createTask, updateTask } = useTasks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = () => {
    setShowCreateForm(true);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data as UpdateTaskRequest);
      } else {
        await createTask(data as CreateTaskRequest);
      }
      handleCloseForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Tracker Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <TaskList
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask}
          />
        </div>
      </main>

      {showCreateForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              task={editingTask || undefined}
              onSubmit={handleSubmitTask}
              onCancel={handleCloseForm}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const DashboardPage = () => {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
};