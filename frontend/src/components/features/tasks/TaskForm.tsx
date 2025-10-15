import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../../types';
import { Button, Input } from '../../ui';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const TaskForm = ({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let formattedDueDate = formData.dueDate
        ? `${formData.dueDate}T00:00:00`
        : undefined;

      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formattedDueDate,
      };

      await onSubmit(submitData);

      // Clear form if creating new task
      if (!task) {
        setFormData({
          title: '',
          description: '',
          dueDate: '',
        });
      }
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save task. Please try again.');
    }
  };

  return (
    <div className="task-form">
      <div className="task-form-header">
        <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="task-form-body">
        {submitError && (
          <div className="error-banner">
            {submitError}
          </div>
        )}
        
        <Input
          id="title"
          name="title"
          type="text"
          label="Task Title"
          value={formData.title}
          onChange={handleInputChange}
          error={errors.title}
          placeholder="Enter task title"
          maxLength={200}
        />
        
        <div className="input-group">
          <label htmlFor="description" className="input-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            className={`input textarea ${errors.description ? 'input-error' : ''}`}
            rows={4}
            maxLength={1000}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>
        
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          label="Due Date (Optional)"
          value={formData.dueDate}
          onChange={handleInputChange}
          error={errors.dueDate}
        />
        
        <div className="task-form-actions">
          <Button
            type="submit"
            loading={isLoading}
            className="task-submit-btn"
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};