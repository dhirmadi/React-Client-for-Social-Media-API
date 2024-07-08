import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './CommentModal.css'; // Ensure this path matches where your CSS is stored

const CommentModal = ({ isOpen, onSave, onClose, imageID, imageMetadata, imageData }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [hashtags, setHashtags] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (imageMetadata) {
      setDescription(imageMetadata.description || '');
      setTagline(imageMetadata.tagline || '');
      setHashtags(imageMetadata.hashtags || '');
    }
  }, [imageMetadata]);

  const handleSave = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${apiUrl}/storecomment`, {
        imageID,
        description,
        tagline,
        hashtags,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSave({ imageID, description, tagline, hashtags });
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  };

  const handleIdentify = async () => {
    try {
      if (imageData && imageData.image_url) {
        const token = await getAccessTokenSilently();
        const response = await axios.post(`${apiUrl}/identifyimage`, { image_link: imageData.image_url }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTagline(response.data.mood);
      }
    } catch (error) {
      console.error('Error identifying image:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Comment</h2>
        </div>
        <div className="modal-body">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="tagline">Tagline</label>
          <div className="tagline-container">
            <input
              type="text"
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            <button type="button" onClick={handleIdentify}>Identify</button>
          </div>
          <label htmlFor="hashtags">Hashtags</label>
          <input
            type="text"
            id="hashtags"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button type="button" onClick={onClose}>Close</button>
          <button type="button" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
