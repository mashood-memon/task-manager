import React from 'react';
import { format } from 'date-fns';
import type { Task } from '../types';

interface TaskFiltersProps {
  tasks: Task[];
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priority: Task['priority'] | 'all';
  status: Task['status'] | 'all';
  category: string;
  dueDate: 'all' | 'today' | 'week' | 'overdue' | string;
  customDate?: string;
}

export default function TaskFilters({ tasks, onFilterChange }: TaskFiltersProps) {
  const [filters, setFilters] = React.useState<FilterOptions>({
    priority: 'all',
    status: 'all',
    category: 'all',
    dueDate: 'all'
  });

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set(tasks.map(task => task.category).filter(Boolean));
    return Array.from(categories).sort();
  }, [tasks]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    if (key === 'dueDate') {
      if (value === 'custom') {
        setShowDatePicker(true);
        return;
      } else {
        setShowDatePicker(false);
      }
    }

    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCustomDateChange = (date: string) => {
    const newFilters = { 
      ...filters, 
      dueDate: date,
      customDate: date 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <div className="flex gap-2">
            <select
              value={showDatePicker ? 'custom' : filters.dueDate}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Due Today</option>
              <option value="week">Due This Week</option>
              <option value="overdue">Overdue</option>
              <option value="custom">Custom Date</option>
            </select>
            {showDatePicker && (
              <input
                type="date"
                min={today}
                value={filters.customDate || today}
                onChange={(e) => handleCustomDateChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}