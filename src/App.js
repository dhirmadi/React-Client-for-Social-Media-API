import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import RandomImage from './components/RandomImage';
import HeaderNav from './components/HeaderNav';
import FooterNav from './components/FooterNav';
import CommentModal from './components/CommentModal';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './App.css';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [roles, setRoles] = useState([]);
  const [imageId, setImageId] = useState(null);
  const [fetchImage, setFetchImage] = useState(() => () => {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageMetadata, setImageMetadata] = useState(null);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
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
          console.log('Fetched roles:', userRoles);
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

  const fetchCommentData = useCallback(async (uniqueID) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${apiUrl}/retrievecomment/${uniqueID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImageMetadata(response.data);
      setIsModalOpen(true); // Open modal after fetching the data
    } catch (error) {
      console.error('Error fetching comment data:', error);
    }
  }, [apiUrl, getAccessTokenSilently]);

  const handleCommentButtonClick = () => {
    if (imageId) {
      fetchCommentData(imageId);
    }
  };

  const handleCommentSave = (formData) => {
    console.log('Comment saved');
    console.log('Form Data:', formData);
    toggleModal(); // Close modal after save
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
            <Routes>
              <Route path="/" element={<RandomImage ref={randomImageRef} setImageId={setImageId} setFetchImage={setFetchImage} folder="default" />} />
              <Route path="/review" element={<RandomImage ref={randomImageRef} setImageId={setImageId} setFetchImage={setFetchImage} folder="review" />} />
              <Route path="/approve" element={<RandomImage ref={randomImageRef} setImageId={setImageId} setFetchImage={setFetchImage} folder="approve" />} />
              <Route path="/delete" element={<RandomImage ref={randomImageRef} setImageId={setImageId} setFetchImage={setFetchImage} folder="delete" />} />
              <Route path="/rework" element={<RandomImage ref={randomImageRef} setImageId={setImageId} setFetchImage={setFetchImage} folder="rework" />} />
            </Routes>
          )}
        </div>
        <CommentModal isOpen={isModalOpen} onSave={handleCommentSave} onClose={toggleModal} imageID={imageId} imageMetadata={imageMetadata} />
        <div className="footer">
          <FooterNav
            isAuthenticated={isAuthenticated}
            isReviewer={isReviewer}
            handleAction={handleCommentButtonClick}            
            removeAction={handleCommentButtonClick}
            toggleModal={handleCommentButtonClick} 
          />
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
