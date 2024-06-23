// src/RandomImages.js
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const RandomImages = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [imageData, setImageData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${apiUrl}/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImageData(response.data);
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };

    if (isAuthenticated) {
      fetchImage();
    } else {
      loginWithRedirect();
    }
  }, [getAccessTokenSilently, isAuthenticated, loginWithRedirect, apiUrl]);

  return (
    <div>
      {imageData ? (
        <img src={imageData.image_url} alt={imageData.id} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default RandomImages;
