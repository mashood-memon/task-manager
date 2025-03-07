export interface Task {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category?: string;  // Made optional
  user_id: string;
  created_at: string;
  updated_at: string; // Added updated_at field
}

// Using Omit and Pick for better type safety
export type TaskFormData = Omit<Task, '_id' | 'user_id' | 'created_at' | 'updated_at'>;

// Added type for partial updates
export type TaskUpdate = Partial<TaskFormData>;