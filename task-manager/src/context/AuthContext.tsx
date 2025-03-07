import React from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Set the token in localStorage
      localStorage.setItem('token', token);
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Check token on mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      axios.get('http://localhost:5000/profile')
        .then(response => setUser(response.data))
        .catch(() => {
          logout();
          toast.error('Session expired. Please login again.');
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}