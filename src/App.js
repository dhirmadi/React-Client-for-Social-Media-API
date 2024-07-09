import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import RandomImage from './components/RandomImage';
import HeaderNav from './components/HeaderNav';
import FooterNav from './components/FooterNav';
import CommentModal from './components/CommentModal';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement
import axios from 'axios';
import './App.css';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [roles, setRoles] = useState([]);
  const [imageId, setImageId] = useState(null);
  const [imageURL, setImageURL] = useState(null);
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
    }
  }
  
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

  const handleCommentSave = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${apiUrl}/storecomment`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Comment saved:', response.data);
    } catch (error) {
      console.error('Error saving comment:', error);
    }
    toggleModal(); // Close modal after save
  };

   // handling requests to remove a file
   const removeAction = async () => {
    try {
      // Set loading to true before API call
      if (randomImageRef.current) {
        randomImageRef.current.setLoading(true);
      }

      const token = await getAccessTokenSilently();
      const payload = { uniqueID: imageId };
      await axios.post(
        `${apiUrl}/delete`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchImage(); // Fetch a new image after the action is completed
    } catch (error) {
      console.error(`Error removing file:`, error);
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
            <Routes>
              <Route path="/" element={<RandomImage ref={randomImageRef}  setImageURL={setImageURL} setImageId={setImageId} setFetchImage={setFetchImage} folder="default" />} />
              <Route path="/review" element={<RandomImage ref={randomImageRef}  setImageURL={setImageURL} setImageId={setImageId} setFetchImage={setFetchImage} folder="review" />} />
              <Route path="/approve" element={<RandomImage ref={randomImageRef}  setImageURL={setImageURL} setImageId={setImageId} setFetchImage={setFetchImage} folder="approve" />} />
              <Route path="/delete" element={<RandomImage ref={randomImageRef}  setImageURL={setImageURL} setImageId={setImageId} setFetchImage={setFetchImage} folder="delete" />} />
              <Route path="/rework" element={<RandomImage ref={randomImageRef}  setImageURL={setImageURL} setImageId={setImageId} setFetchImage={setFetchImage} folder="rework" />} />
            </Routes>
          )}
        </div>
        <CommentModal isOpen={isModalOpen} onSave={handleCommentSave} onClose={toggleModal} imageID={imageId} imageMetadata={imageMetadata} imageData={{ id: imageId, image_url: imageURL }}/>
        <div className="footer">
          <FooterNav
            isAuthenticated={isAuthenticated}
            isReviewer={isReviewer}
            handleAction={handleAction}            
            removeAction={removeAction}
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
