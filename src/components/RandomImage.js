import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './RandomImage.css';

const RandomImage = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchImage = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${apiUrl}/image`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImageData(response.data);
    } catch (error) {
      console.error('Error fetching the image:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchImage();
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect, fetchImage]);

  return (
    <div className="image-container">
      {loading && (
        <div className="spinner">
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      )}
      {imageData && (
        <img
          src={imageData.image_url}
          alt={imageData.id}
          onClick={fetchImage}
          className={loading ? 'loading' : ''}
        />
      )}
      {!imageData && !loading && (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default RandomImage;
