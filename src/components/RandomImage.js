import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './RandomImage.css';

function RandomImage() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  const fetchImage = async () => {
    setLoading(true);
    try {
      console.log('Fetching access token...');
      const token = await getAccessTokenSilently();
      console.log('Access token obtained:', token);

      console.log('Fetching image from API...');
      const response = await axios.get('http://127.0.0.1:5000/image', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API response:', response);

      if (response.data && response.data.image_url) {
        setImageUrl(response.data.image_url);
        console.log('Image URL:', response.data.image_url);
      } else {
        console.error('No image URL found in response');
        setError('No image URL found in response');
      }
    } catch (err) {
      console.error('There was an error fetching the image!', err);
      setError('There was an error fetching the image!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImage();
  }, [getAccessTokenSilently]);

  return (
    <div>
      {error && <p>{error}</p>}
      {loading ? (
        <div className="spinner"></div>
      ) : (
        imageUrl && (
          <img
            src={imageUrl}
            alt="Random from Dropbox"
            onClick={fetchImage}
            style={{ cursor: 'pointer' }}
          />
        )
      )}
    </div>
  );
}

export default RandomImage;
