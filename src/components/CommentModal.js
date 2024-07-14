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
  const systemcontent = process.env.REACT_APP_OPENAI_SYSTEM_CONTENT;
  // const rolecontent = process.env.REACT_APP_OPENAI_ROLE_CONTENT;
  const [isIdentifying, setIsIdentifying] = useState(false);

  useEffect(() => {
    if (imageMetadata) {
      setDescription(imageMetadata.description || '');
      setTagline(imageMetadata.tagline || '');
      setHashtags(imageMetadata.hashtags || '');
    }
  }, [imageMetadata]);

  const handleSave = async () => {
    try {
      setIsIdentifying(true);
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
    } finally {
      setIsIdentifying(false); // After the API call
    }
  };

  const handleIdentify = async () => {
    try {
      setIsIdentifying(true);
      if (imageData && imageData.image_url) {
        console.log('Identifying image:', imageData.image_url);
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
    } finally {
      setIsIdentifying(false); // After the API call
    }
  };

  const handleDescription = async () => {
    try {
      setIsIdentifying(true);
      if (tagline) {
        const token = await getAccessTokenSilently();
        const response = await axios.post(`${apiUrl}/generatedescription`, { systemcontent, rolecontent:"Write me a caption of about 100-150 characters without hashtags for my photograph that shows ", prompt:tagline }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const descriptionWithoutQuotes = response.data.description.replace(/"/g, ''); // Remove all double quotes
        setDescription(descriptionWithoutQuotes);
      }
    } catch (error) {
      console.error('Error getting description:', error);
    } finally {
      setIsIdentifying(false); // After the API call
    }
  };

  const handleTags = async () => {
    try {
      setIsIdentifying(true);
      if (description) {
        const token = await getAccessTokenSilently();
        const response = await axios.post(`${apiUrl}/generatedescription`, { systemcontent, rolecontent:"Generate five amazing tags, no numbering, for a photo with the following description for social media: ", prompt:description }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHashtags(response.data.description);
      }
    } catch (error) {
      console.error('Error getting description:', error);
    } finally {
      setIsIdentifying(false); // After the API call
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
        <label htmlFor="tagline">Tagline</label>         
          <div className="tagline-container">
            <textarea
              id="tagline"
              rows="3"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            <button type="button" onClick={handleIdentify} disabled={isIdentifying}>Title</button>
          </div>
          <label htmlFor="description">Description</label>
          <div className="tagline-container">
            <textarea
              id="description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="button" onClick={handleDescription} disabled={isIdentifying}>Text</button>
          </div> 
          
          <label htmlFor="hashtags">Hashtags</label>
          <div className="tagline-container">
            <textarea
              id="hashtags"
              rows="5"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
            <button type="button" onClick={handleTags} disabled={isIdentifying}>Hash</button>
            </div>
        </div>
        <div className="modal-footer">
          <button type="button" onClick={onClose}>Close</button>
          <button type="button" onClick={handleSave} disabled={isIdentifying}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
