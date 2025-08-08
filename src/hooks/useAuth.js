// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext itself

const useAuth = () => {
  const context = useContext(AuthContext); // Consume the AuthContext

  // Throw an error if the hook is used outside of an AuthProvider.
  // This is a good practice for debugging, as it clearly tells developers
  // if they've forgotten to wrap a part of their component tree with AuthProvider.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context; // Return the context value (user, isAuthenticated, loading, login, signup, logout)
};

export default useAuth;