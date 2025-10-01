import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const RegisterPage = () => {
  return (
    <div className="auth-container">
      <AuthForm isRegister={true} />
    </div>
  );
};

export default RegisterPage;