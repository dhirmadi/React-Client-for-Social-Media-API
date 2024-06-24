import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './RandomImage.css';

const RandomImage = ({ setImageId, setFetchImage }) => {
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
      setImageId(response.data.id); // Pass the image ID to the parent component
    } catch (error) {
      console.error('Error fetching the image:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, getAccessTokenSilently, setImageId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchImage();
      setFetchImage(() => fetchImage); // Set the fetchImage function in the parent component
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect, fetchImage, setFetchImage]);

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
