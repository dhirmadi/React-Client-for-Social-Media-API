import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const RandomImages = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchImage = async () => {
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
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchImage();
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2
        }}>
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      )}
      {imageData && (
        <img
          src={imageData.image_url}
          alt={imageData.id}
          onClick={fetchImage}
          style={{ cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
        />
      )}
      {!imageData && !loading && (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default RandomImages;
