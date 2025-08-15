import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '../utils/api';

// Define the User interface
interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the auth store
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  // Actions
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user data
      user.value = userData;
      isAuthenticated.value = true;
      
      return { success: true, message: '登录成功' };
    } catch (error: any) {
      const message = error.response?.data?.message || '登录失败';
      return { success: false, message };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/auth/register', { username, email, password });
      const { user: userData, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user data
      user.value = userData;
      isAuthenticated.value = true;
      
      return { success: true, message: '注册成功' };
    } catch (error: any) {
      const message = error.response?.data?.message || '注册失败';
      return { success: false, message };
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear user data
    user.value = null;
    isAuthenticated.value = false;
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/auth/me');
        user.value = response.data.user;
        isAuthenticated.value = true;
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        user.value = null;
        isAuthenticated.value = false;
      }
    }
  };

  // Initialize auth status on app start
  checkAuthStatus();

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus
  };
});