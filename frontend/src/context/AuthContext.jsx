import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import api from '../services/api';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Check for a user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Set the token for the global api instance
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    setLoading(false);
  }, []);

  // 4. Login function
  const login = async (email, password) => {
    const userData = await AuthService.login(email, password);
    setUser(userData);
    // The token is already stored in localStorage by AuthService
    // and the interceptor will now pick it up.
  };

  // 5. Logout function
  const logout = () => {
    AuthService.logout();
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  // 6. The value provided to the consumer components
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };