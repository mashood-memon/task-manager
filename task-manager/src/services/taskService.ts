import axios from 'axios';
import type { Task, TaskFormData } from '../types';

const API_URL = 'http://localhost:5000';

// Add interceptor to handle errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || 'An error occurred';
    throw new Error(message);
  }
);

export const taskService = {
  getTasks: () => 
    axios.get<Task[]>(`${API_URL}/tasks`).then(res => res.data),
  
  createTask: (task: TaskFormData) => 
    axios.post<Task>(`${API_URL}/tasks`, task).then(res => res.data),
  
  updateTask: (id: string, task: Partial<Task>) => 
    axios.put<Task>(`${API_URL}/tasks/${id}`, task).then(res => res.data),
  
  deleteTask: (id: string) => 
    axios.delete(`${API_URL}/tasks/${id}`).then(res => res.data)
};