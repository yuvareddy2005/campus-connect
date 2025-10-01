import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const RegisterPage = () => {
  return (
    <div>
      <h1>Register Page</h1>
      <AuthForm isRegister={true} />
    </div>
  );
};

export default RegisterPage;