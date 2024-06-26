import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import RandomImage from './components/RandomImage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './App.css';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [roles, setRoles] = useState([]);
  const [imageId, setImageId] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiNamespace = process.env.REACT_APP_API_NAMESPACE;
  const [fetchImage, setFetchImage] = useState(() => () => {});

  useEffect(() => {
    const fetchRoles = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log('Coded Token:', token); 
          const decodedToken = jwtDecode(token);
          console.log('Decoded Token:', decodedToken);
          const userRoles = decodedToken[apiNamespace]; // Use the correct namespace for your roles
          setRoles(userRoles || []);
        } catch (error) {
          console.error('Error fetching user roles:', error);
        }
      }
    };

    fetchRoles();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleAction = async (action) => {
    try {
      const token = await getAccessTokenSilently();
      const payload = { action, uniqueID: imageId };
      axios.post(
        `${apiUrl}/move`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(response => {
        // Handle success if needed
      }).catch(error => {
        console.error(`Error performing ${action} action:`, error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
        }
      });
      // Fetch a new image immediately without waiting for the action to complete
      fetchImage();
    } catch (error) {
      console.error(`Error getting access token:`, error);
    }
  };

  const isReviewer = roles.includes('reviewer');
  const canViewImage = roles.includes('user') || roles.includes('reviewer');

  return (
    <Router>
      <div className="app-container">
        <div className="header">
          <div className="auth-button-container">
            {!isAuthenticated ? (
              <button className="auth-button" onClick={() => loginWithRedirect()}>Log In</button>
            ) : (
              <button className="auth-button" onClick={handleLogout}>Log Out</button>
            )}
          </div>
        </div>
        <div className="content">
          {isAuthenticated && canViewImage && <RandomImage setImageId={setImageId} setFetchImage={setFetchImage} />}
        </div>
        <div className="footer">
          {isAuthenticated && isReviewer && (
            <div className="button-container">
              <button className="footer-button" onClick={() => handleAction('approve')}>Publish</button>
              <button className="footer-button" onClick={() => handleAction('rework')}>Change</button>
              <button className="footer-button" onClick={() => handleAction('delete')}>Discard</button>
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
const redirectUri = process.env.REACT_APP_REDIRECT_URI || window.location.origin;

const RootApp = () => (
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: redirectUri, audience }}
  >
    <App />
  </Auth0Provider>
);

export default RootApp;
