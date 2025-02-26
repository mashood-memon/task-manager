import React from 'react';
import { Plus, BarChart3, ListTodo } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Analytics from './components/Analytics';
import type { Task, TaskFormData } from './types';

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    due_date: '2024-03-20',
    priority: 'high',
    status: 'in_progress',
    category: 'Documentation',
    created_at: '2024-03-10',
    user_id: 'user1',
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests',
    due_date: '2024-03-15',
    priority: 'medium',
    status: 'pending',
    category: 'Code Review',
    created_at: '2024-03-10',
    user_id: 'user1',
  },
];

function App() {
  const [tasks, setTasks] = React.useState<Task[]>(MOCK_TASKS);
  const [showForm, setShowForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [showAnalytics, setShowAnalytics] = React.useState(false);

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      created_at: new Date().toISOString(),
      user_id: 'user1',
    };
    setTasks([...tasks, newTask]);
    setShowForm(false);
    toast.success('Task created successfully!');
  };

  const handleUpdateTask = (data: TaskFormData) => {
    if (!editingTask) return;
    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? { ...task, ...data } : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast.success('Task deleted successfully!');
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    toast.success('Task status updated!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {showAnalytics ? <ListTodo size={18} /> : <BarChart3 size={18} />}
              {showAnalytics ? 'Show Tasks' : 'Show Analytics'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </div>

        {showForm || editingTask ? (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              initialData={editingTask || undefined}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        ) : showAnalytics ? (
          <Analytics tasks={tasks} />
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;