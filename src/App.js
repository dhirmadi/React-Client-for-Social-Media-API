import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import RandomImage from './components/RandomImage';
import HeaderNav from './components/HeavderNav';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './App.css';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [roles, setRoles] = useState([]);
  const [imageId, setImageId] = useState(null);
  const [fetchImage, setFetchImage] = useState(() => () => {});
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiNamespace = process.env.REACT_APP_API_NAMESPACE;
  const randomImageRef = useRef(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const decodedToken = jwtDecode(token);
          const userRoles = decodedToken[apiNamespace]; // Use the correct namespace for your roles
          setRoles(userRoles || []);
        } catch (error) {
          console.error('Error fetching user roles:', error);
        }
      }
    };

    fetchRoles();
  }, [isAuthenticated, getAccessTokenSilently, apiNamespace]);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleAction = async (action) => {
    try {
      // Set loading to true before API call
      if (randomImageRef.current) {
        randomImageRef.current.setLoading(true);
      }

      const token = await getAccessTokenSilently();
      const payload = { action, uniqueID: imageId };
      await axios.post(
        `${apiUrl}/move`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchImage(); // Fetch a new image after the action is completed
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  const isReviewer = roles.includes('reviewer');
  const canViewImage = roles.includes('user') || roles.includes('reviewer');

  return (
    <Router>
      <div className="app-container">
      <HeaderNav 
          isAuthenticated={isAuthenticated} 
          loginWithRedirect={loginWithRedirect} 
          handleLogout={handleLogout} 
        />
        <div className="content">
          {isAuthenticated && canViewImage && (
            <RandomImage ref={randomImageRef} setImageId={setImageId} setFetchImage={setFetchImage} />
          )}
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
