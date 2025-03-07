import React from 'react';
import { Plus, BarChart3, ListTodo, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button"
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
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
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

  const filteredTasks = React.useMemo(() => {
    // First filter the tasks
    const filtered = tasks.filter(task => {
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.category !== 'all' && task.category !== filters.category) return false;

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
            if (filters.customDate && taskDate !== filters.customDate) return false;
        }
      }

      return true;
    });

    // Then sort by status and due date
    return filtered.sort((a, b) => {
      const statusOrder = { pending: 0, in_progress: 1, completed: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }, [tasks, filters]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks([...tasks, newTask]);
      setDialogOpen(false);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      const updatedTask = await taskService.updateTask(editingTask._id, data);
      setTasks(tasks.map(task => task._id === editingTask._id ? updatedTask : task));
      setEditingTask(null);
      setDialogOpen(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const currentTask = tasks.find(task => task._id === taskId);
      if (!currentTask) return;

      const updatedTask = await taskService.updateTask(taskId, { ...currentTask, status });
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  if (!auth?.isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground">Welcome, {auth.user?.username}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2"
            >
              {showAnalytics ? <ListTodo className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
              {showAnalytics ? 'Show Tasks' : 'Show Analytics'}
            </Button>
            
            <Button
              variant="default"
              onClick={() => {
                setEditingTask(null);
                setDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => auth.logout()}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {!showAnalytics && (
          <TaskFilters 
            tasks={tasks}
            onFilterChange={setFilters} 
          />
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : showAnalytics ? (
          <Analytics tasks={filteredTasks} />
        ) : (
          <>
            <TaskForm
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              initialData={editingTask}
            />
            <TaskList
              tasks={filteredTasks}
              onEdit={(task) => {
                setEditingTask(task);
                setDialogOpen(true);
              }}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;