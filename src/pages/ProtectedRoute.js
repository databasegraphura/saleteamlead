// src/pages/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading spinner while auth status is being fetched
  if (loading) {
    return <LoadingSpinner />;
  }

  
    if (!isAuthenticated) {
      console.log("User is not authenticated, redirecting to login page...");
      // imperatively navigate to login page
      navigate('/login', { replace: true });
    }
 

  // While redirecting, render null or a placeholder to avoid rendering protected content
  if (!isAuthenticated) {
    return null; 
  }

  // Render nested routes when authenticated
  return <Outlet />;
};

export default ProtectedRoute;
