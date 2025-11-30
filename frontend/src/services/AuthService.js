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
  
  // Debug log to see exactly what we get back
  console.log("Login Response:", response.data);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    // If you send the user object on login, save it too:
    // localStorage.setItem('user', JSON.stringify(response.data.user)); 
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