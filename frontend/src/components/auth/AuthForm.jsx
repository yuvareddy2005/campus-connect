import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // State for error messages

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      if (isRegister) {
        const response = await AuthService.register(name, email, password);
        console.log('Registration successful:', response.data);
        // We could automatically log the user in here or redirect them.
      } else {
        // --- THIS PART CHANGES ---
        const userData = await AuthService.login(email, password);
        console.log('Login successful:', userData);
        navigate('/');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || 'An error occurred.';
      setError(errorMessage);
      console.error('Authentication error:', err.response);
    }
  };

  return (
    <div className="form-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={onSubmit}>
        {isRegister && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        {/* Display the error message if it exists */}
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </div>
  );
};

export default AuthForm;