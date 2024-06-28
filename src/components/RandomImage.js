import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './RandomImage.css';

const RandomImage = ({ setImageId, setFetchImage }) => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempImageData, setTempImageData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const preloadImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }, []);

  const fetchImage = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${apiUrl}/image`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTempImageData(response.data); // Update tempImageData with the fetched image data

      // Preload the image in the background
      await preloadImage(response.data.image_url);

      // Image is preloaded, update state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching the image:', error);
      setLoading(false); // Stop loading on error
    }
  }, [apiUrl, getAccessTokenSilently, preloadImage]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchImage();
      setFetchImage(fetchImage); // Set the fetchImage function in the parent component
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect, fetchImage, setFetchImage]);

  const handleImageLoad = () => {
    setImageData(tempImageData); // Update the actual image data when the image has loaded
    setImageId(tempImageData.id); // Pass the image ID to the parent component
  };

  const handleClick = () => {
    if (!loading) {
      fetchImage(); // Load a new image when clicked, if not currently loading
    }
  };

  return (
    <div className="image-container">
      {loading && (
        <div className="spinner">
          <ClipLoader color="#000" loading={loading} size={150} />
        </div>
      )}
      {tempImageData && !loading && (
        <img
          src={tempImageData.image_url}
          alt={tempImageData.id}
          onLoad={handleImageLoad}
          onClick={handleClick}
          style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default RandomImage;
