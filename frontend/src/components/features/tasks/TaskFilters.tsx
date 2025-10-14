import React, { useState, useEffect, useCallback } from 'react';
import { TaskFilters, Task } from '../../../types';
import { Button, Input } from '../../ui';

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFilters) => void;
  currentFilters: TaskFilters;
  isLoading?: boolean;
}

export const TaskFiltersComponent = ({ 
  onFiltersChange, 
  currentFilters, 
  isLoading = false 
}: TaskFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(currentFilters);
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');

  useEffect(() => {
    const filtersToSend = { ...localFilters, search: searchTerm };
    Object.keys(filtersToSend).forEach(k => {
      if (filtersToSend[k as keyof TaskFilters] === undefined || filtersToSend[k as keyof TaskFilters] === '') {
        delete filtersToSend[k as keyof TaskFilters];
      }
    });
    onFiltersChange(filtersToSend);
  }, [localFilters, searchTerm]);

  const handleFilterChange = useCallback((key: keyof TaskFilters, value: any) => {
    const cleanValue = value === '' ? undefined : value;
    setLocalFilters(prev => ({ ...prev, [key]: cleanValue }));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setLocalFilters({});
    setSearchTerm('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== undefined && value !== '') || searchTerm.trim() !== '';

  return (
    <div className="task-filters">
      <div className="task-filters-header">
        <h3>Filter Tasks</h3>
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="secondary"
            onClick={clearFilters}
            disabled={isLoading}
          >
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="task-filters-body">
        <div className="filter-row">
          <Input
            id="search"
            name="search"
            type="text"
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            className="filter-input"
          />
          
          <div className="input-group">
            <label htmlFor="status" className="input-label">
              Status
            </label>
            <select
              id="status"
              value={localFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as Task['status'])}
              className="input filter-select"
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DELAYED">Delayed</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <Input
            id="dueDateAfter"
            name="dueDateAfter"
            type="date"
            label="Due Date From"
            value={localFilters.dueDateAfter || ''}
            onChange={(e) => handleFilterChange('dueDateAfter', e.target.value)}
            className="filter-input"
          />
          
          <Input
            id="dueDateBefore"
            name="dueDateBefore"
            type="date"
            label="Due Date To"
            value={localFilters.dueDateBefore || ''}
            onChange={(e) => handleFilterChange('dueDateBefore', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
    </div>
  );
};