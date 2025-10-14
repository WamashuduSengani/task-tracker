import React from 'react';
import { Task } from '../../types';
import { taskService } from '../../services/taskService';

interface TaskStatusBadgeProps {
  status: Task['status'];
  className?: string;
}

export const TaskStatusBadge = ({ status, className = '' }: TaskStatusBadgeProps) => {
  const color = taskService.getStatusColor(status);
  const label = taskService.getStatusLabel(status);

  return (
    <span 
      className={`task-status-badge ${className}`}
      style={{ 
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      {label}
    </span>
  );
};