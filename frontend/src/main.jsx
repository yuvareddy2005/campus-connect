import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* 2. Wrap the App component */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
