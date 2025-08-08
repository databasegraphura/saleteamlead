// src/utils/authUtils.js

const TOKEN_KEY = 'jwtToken'; // Key for storing JWT in localStorage
const USER_KEY = 'currentUser'; // Key for storing user data in localStorage

// Stores the JWT token in localStorage
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Retrieves the JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Removes the JWT token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Stores the current user object (after stringifying) in localStorage
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Retrieves and parses the current user object from localStorage
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  console.log(user);
  
  return user ? JSON.parse(user) : null;
};

// Removes the current user object from localStorage
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Clears all authentication-related data from localStorage
export const clearAuthData = () => {
  removeToken();
  removeUser();
};