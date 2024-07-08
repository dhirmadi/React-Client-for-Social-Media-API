import React, { useState } from 'react';
import './CommentModal.css';

const CommentModal = ({ isOpen, onSave, onClose, imageID }) => {
    const [image, setImage] = useState('');
    const [tagline, setTagline] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [caption, setCaption] = useState('');
    if (!isOpen) return null;

    const handleSubmit = (event) => {
      event.preventDefault();
      onSave({ imageID, tagline, hashtags, caption });
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Leave a Comment</h2>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="imageID" value={imageID} />
            <input type="text" placeholder="Tagline" required value={tagline} onChange={(e) => setTagline(e.target.value)} />
            <input type="text" placeholder="Hashtags" required value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
            <textarea placeholder="Caption" required value={caption} onChange={(e) => setCaption(e.target.value)} />
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
    );
  };

export default CommentModal;