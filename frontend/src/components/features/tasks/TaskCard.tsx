import React from 'react';
import { Task } from '../../../types';
import { TaskStatusBadge } from '../../ui/TaskStatusBadge';
import { Button } from '../../ui';
import { taskService } from '../../../services/taskService';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  onStatusChange?: (taskId: number, status: Task['status']) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const isOverdue = taskService.isOverdue(task);
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    onStatusChange?.(task.id, newStatus);
  };

  const nextStatus = (): Task['status'] | null => {
    switch (task.status) {
      case 'NEW':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'COMPLETED';
      default:
        return null;
    }
  };

  const next = nextStatus();

  return (
    <div className={`task-card ${isOverdue ? 'task-card-overdue' : ''}`}>
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>
      
      <div className="task-card-body">
        <p className="task-description">{task.description}</p>
        
        <div className="task-meta">
          {task.dueDate && (
            <div className="task-due-date">
              <span className="task-meta-label">Due:</span>
              <span className={`task-due-date-value ${isOverdue ? 'overdue' : ''}`}>
                {taskService.formatDate(task.dueDate)}
              </span>
            </div>
          )}
          
          <div className="task-created-date">
            <span className="task-meta-label">Created:</span>
            <span className="task-created-date-value">
              {taskService.formatDate(task.createdDate)}
            </span>
          </div>
          
          {task.assignedUserName && (
            <div className="task-assigned">
              <span className="task-meta-label">Assigned to:</span>
              <span className="task-assigned-value">{task.assignedUserName}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="task-card-actions">
        <div className="task-status-actions">
          <select 
            value={task.status} 
            onChange={handleStatusChange}
            className="task-status-select"
          >
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELAYED">Delayed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          
          {next && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onStatusChange?.(task.id, next)}
              className="task-next-status-btn"
            >
              Mark as {taskService.getStatusLabel(next)}
            </Button>
          )}
        </div>
        
        <div className="task-crud-actions">
          {onEdit && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};