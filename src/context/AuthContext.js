// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Our auth API service
import { getUser, clearAuthData } from '../utils/authUtils'; // Utilities for local storage

// Create the Auth Context
export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null); // Stores current user object
  const [loading, setLoading] = useState(true); // To indicate if auth state is being loaded
  // No useNavigate here; navigation is handled by components consuming this context

  // On initial load, try to load user from local storage
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUserState(storedUser);
    }
    setLoading(false); // Done checking initial auth state
  }, []); // Empty dependency array means this runs only once on mount

  // --- Authentication Functions ---

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUserState(userData);
      return userData; // Return user data for calling component to handle navigation
    } catch (error) {
      setUserState(null); // Clear user state on error
      clearAuthData(); // Clear any partial/old data from local storage
      throw error; // Re-throw to be handled by the calling component (e.g., AuthPage)
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(userData);
      setUserState(newUser);
      return newUser; // Return user data for calling component to handle navigation
    } catch (error) {
      setUserState(null);
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout(); // Call backend logout endpoint
    } catch (error) {
      console.warn("Logout failed on backend, but clearing client data locally.", error);
      // Even if backend logout endpoint fails, clear local data for UI consistency
    } finally {
      setUserState(null); // Clear user state in React
      clearAuthData(); // Clear all local storage auth data (token, user)
      // Navigation to /login is handled by components consuming this context (e.g., Navbar)
      setLoading(false);
    }
  };

  // The value provided by the context to consuming components
  const authContextValue = {
    user,
    isAuthenticated: !!user, // Convenience boolean for checking if logged in
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};