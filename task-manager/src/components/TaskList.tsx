import React from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Circle, Clock, Edit, Trash2 } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
};

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const newStatus = task.status === 'completed' 
                    ? 'pending' 
                    : task.status === 'pending' 
                    ? 'in_progress' 
                    : 'completed';
                  onStatusChange(task._id, newStatus);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                {React.createElement(statusIcons[task.status], { size: 20 })}
              </button>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{task.description}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>Due: {formatDate(task.due_date)}</span>
              <span>Category: {task.category || 'Uncategorized'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}