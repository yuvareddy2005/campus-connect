import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Show a loading message while the context is checking for a user
  if (loading) {
    return <div>Loading...</div>;
  }

  // If authenticated, render the child route. Otherwise, navigate to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;