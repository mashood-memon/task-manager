import React from 'react';
import { Plus, BarChart3, ListTodo, LogOut } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { isToday, isThisWeek, isBefore, parseISO, startOfToday, format } from 'date-fns';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Analytics from './components/Analytics';
import TaskFilters, { FilterOptions } from './components/TaskFilters';
import { AuthContext } from './context/AuthContext';
import { taskService } from './services/taskService';
import type { Task, TaskFormData } from './types';
import Auth from './components/Auth';

function App() {
  const auth = React.useContext(AuthContext);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState<FilterOptions>({
    priority: 'all',
    status: 'all',
    category: 'all',
    dueDate: 'all'
  });

  // Fetch tasks when component mounts
  React.useEffect(() => {
    if (auth?.isAuthenticated) {
      taskService.getTasks()
        .then(fetchedTasks => {
          setTasks(fetchedTasks);
          setLoading(false);
        })
        .catch(error => {
          toast.error('Failed to fetch tasks');
          setLoading(false);
        });
    }
  }, [auth?.isAuthenticated]);

  // Filter tasks based on selected filters
const filteredTasks = React.useMemo(() => {
  // First filter the tasks
  const filtered = tasks.filter(task => {
    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }

    // Due date filter
    if (filters.dueDate !== 'all') {
      const taskDate = format(parseISO(task.due_date), 'yyyy-MM-dd');
      
      switch (filters.dueDate) {
        case 'today':
          if (!isToday(parseISO(task.due_date))) return false;
          break;
        case 'week':
          if (!isThisWeek(parseISO(task.due_date))) return false;
          break;
        case 'overdue':
          if (!isBefore(parseISO(task.due_date), startOfToday())) return false;
          break;
        default:
          // Handle custom date
          if (filters.customDate && taskDate !== filters.customDate) {
            return false;
          }
      }
    }

    return true;
  });

  // Then sort by status and due date
  return filtered.sort((a, b) => {
    // Define status priority order
    const statusOrder = {
      pending: 0,
      in_progress: 1,
      completed: 2
    };

    // First sort by status
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // If status is same, sort by due date (earlier dates first)
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
}, [tasks, filters]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks([...tasks, newTask]);
      setShowForm(false);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      const updatedTask = await taskService.updateTask(editingTask._id, data);
      setTasks(tasks.map((task) =>
        task._id === editingTask._id ? updatedTask : task
      ));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const currentTask = tasks.find(task => task._id === taskId);
      if (!currentTask) return;

      const updatedTask = await taskService.updateTask(taskId, {
        ...currentTask,
        status
      });

      setTasks(tasks.map((task) =>
        task._id === taskId ? updatedTask : task
      ));
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  if (!auth?.isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-gray-600">Welcome, {auth.user?.username}</p>
          </div>
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
            <button
              onClick={() => auth.logout()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {!showForm && !showAnalytics && (
          <TaskFilters 
            tasks={tasks}
            onFilterChange={setFilters} 
          />
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : showForm || editingTask ? (
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
          <Analytics tasks={filteredTasks} />
        ) : (
          <TaskList
            tasks={filteredTasks}
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