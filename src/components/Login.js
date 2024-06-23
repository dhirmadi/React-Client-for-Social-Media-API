import React from 'react';
import useAuthService from '../services/useAuthService';

const Login = () => {
  const { login, logout, isAuthenticated } = useAuthService();

  return (
    <div>
      <h2>Login</h2>
      {!isAuthenticated ? (
        <button onClick={login}>Log In</button>
      ) : (
        <button onClick={logout}>Log Out</button>
      )}
    </div>
  );
};

export default Login;
