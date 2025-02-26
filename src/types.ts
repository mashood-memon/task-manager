export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  created_at: string;
  user_id: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: Task['priority'];
  category: string;
  status: Task['status'];
}