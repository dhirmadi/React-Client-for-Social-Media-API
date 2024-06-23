import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import RandomImage from './components/RandomImage';
import './App.css';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <Router>
      <div className="app-container">
        <div className="header-footer">
          {!isAuthenticated ? (
            <button className="auth-button" onClick={() => loginWithRedirect()}>Log In</button>
          ) : (
            <button className="auth-button" onClick={handleLogout}>Log Out</button>
          )}
        </div>
        <div className="content">
          {isAuthenticated && <RandomImage />}
        </div>
        <div className="header-footer footer">
          {isAuthenticated && (
            <div className="button-container">
              <button className="footer-button">Approve</button>
              <button className="footer-button">Repair</button>
              <button className="footer-button">Remove</button>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const RootApp = () => (
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    audience={audience}
  >
    <App />
  </Auth0Provider>
);

export default RootApp;
