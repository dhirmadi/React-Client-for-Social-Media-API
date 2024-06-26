import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './RandomImage.css';

const RandomImage = ({ setImageId, setFetchImage }) => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true to show spinner initially
  const [tempImageData, setTempImageData] = useState(null); // Temporary state to hold new image data
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
      setTempImageData(response.data); // Set the temporary image data
    } catch (error) {
      console.error('Error fetching the image:', error);
      setLoading(false); // Stop loading on error
    }
  }, [apiUrl, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchImage();
      setFetchImage(() => fetchImage); // Set the fetchImage function in the parent component
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect, fetchImage, setFetchImage]);

  const handleImageLoad = () => {
    setImageData(tempImageData); // Update the actual image data when the image has loaded
    setImageId(tempImageData.id); // Pass the image ID to the parent component
    setLoading(false); // Update state when image is loaded
  };

  return (
    <div className="image-container">
      {loading && (
        <div className="spinner">
          <ClipLoader color="#000" loading={loading} size={150} />
        </div>
      )}
      {tempImageData && (
        <img
          src={tempImageData.image_url}
          alt={tempImageData.id}
          onLoad={handleImageLoad}
          onClick={!loading ? fetchImage : undefined}
          style={{ display: loading ? 'none' : 'block', maxWidth: '100%', height: 'auto' }} // Hide image until fully loaded
        />
      )}
    </div>
  );
};

export default RandomImage;
