import api from './api';

// Register user
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // The interceptor unwraps the response, so we just return response.data
  return response.data;
};

// Login user
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  
  console.log("Login Response:", response.data);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    
    // --- FIX: Uncomment and update this line ---
    // We now save the entire response data (which includes token AND user object)
    // This allows AuthContext to restore the session on refresh.
    localStorage.setItem('user', JSON.stringify(response.data)); 
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const AuthService = {
  register,
  login,
  logout,
};

export default AuthService;