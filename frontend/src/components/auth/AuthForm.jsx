import React, { useState, useContext } from 'react'; // 1. Import useContext
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // 2. Import our AuthContext
import AuthService from '../../services/AuthService';

const AuthForm = ({ isRegister = false }) => {
  const { login } = useContext(AuthContext); // 3. Get the login function from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await AuthService.register(name, email, password);
        navigate('/login');
      } else {
        // 4. Use the login function from the context
        await login(email, password);
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </div>
  );
};

export default AuthForm;