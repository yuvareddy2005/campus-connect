import React, { useState } from 'react';

const AuthForm = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      console.log('Registering with:', formData);
      // We will add the API call here later
    } else {
      console.log('Logging in with:', { email, password });
      // We will add the API call here later
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
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </div>
  );
};

export default AuthForm;