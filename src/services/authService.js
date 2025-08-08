// src/services/authService.js
import api from './api'; // Our configured axios instance
import { setToken, setUser, clearAuthData } from '../utils/authUtils'; // Utilities for storing/removing auth data

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, data: { user } } = response.data;

      // Store token and user data locally (if not purely HttpOnly cookies)
      setToken(token);
      setUser(user);

      return user;
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to be handled by the component
    }
  },

  signup: async (userData) => {
    try {
      // The signup endpoint expects name, email, password, passwordConfirm, refId, role
      const response = await api.post('/auth/signup', userData);
      const { token, data: { user } } = response.data;

      // Store token and user data locally (if not purely HttpOnly cookies)
      setToken(token);
      setUser(user);

      return user;
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to be handled by the component
    }
  },

  logout: async () => {
    try {
      await api.get('/auth/logout');
      clearAuthData(); // Clear all local storage auth data
      // No need to return anything, just clear client state
    } catch (error) {
      console.error('Logout failed:', error.response ? error.response.data : error.message);
      // Even if backend logout fails, clear local data for UI consistency
      clearAuthData();
      throw error;
    }
  },
  
  // Future: refreshToken implementation if needed
  // refreshToken: async () => { ... }
};

export default authService;