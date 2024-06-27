import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const RandomImage = ({ setImageId, setFetchImage, action = 'default' }) => { // Assume action is passed as a prop or manage it internally
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempImageData, setTempImageData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchImage = useCallback(async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
  
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${apiUrl}/image`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          action, // Include the action in the API request
        },
      });
      setTempImageData(response.data);
      setLoading(false); // Move setLoading(false) here to ensure it's called only after data is fetched
    } catch (error) {
      console.error('Error fetching the image:', error);
      setLoading(false);
    }
  }, [apiUrl, getAccessTokenSilently, action, isAuthenticated, loginWithRedirect]); // Include isAuthenticated and loginWithRedirect in dependencies
  
  useEffect(() => {
      fetchImage();
      setFetchImage(() => fetchImage);
      }, [fetchImage, setFetchImage]);

  const handleImageLoad = () => {
    setImageData(tempImageData);
    setImageId(tempImageData.id);
    setLoading(false);
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
          style={{ display: loading ? 'none' : 'block', maxWidth: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
};

export default RandomImage;