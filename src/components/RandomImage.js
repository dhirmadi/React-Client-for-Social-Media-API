import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './RandomImage.css';

const RandomImage = forwardRef(({ setImageId, setFetchImage }, ref) => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${apiUrl}/image`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Preload the image in the background
      await preloadImage(response.data.image_url);

      // Image is preloaded, update state
      setImageData(response.data); // Update the actual image data when the image is preloaded
      setImageId(response.data.id); // Pass the image ID to the parent component
      setLoading(false);
    } catch (error) {
      console.error('Error fetching the image:', error);
      setLoading(false); // Stop loading on error
    }
  }, [apiUrl, getAccessTokenSilently, preloadImage, setImageId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchImage();
      setFetchImage(() => fetchImage); // Set the fetchImage function in the parent component
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect, fetchImage, setFetchImage]);

  useImperativeHandle(ref, () => ({
    setLoading
  }));

  const handleClick = () => {
    if (!loading) {
      setLoading(true); // Show the spinner immediately
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
      {imageData && !loading && (
        <img
          src={imageData.image_url}
          alt={imageData.id}
          onClick={handleClick}
          style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }}
        />
      )}
    </div>
  );
});

export default RandomImage;
