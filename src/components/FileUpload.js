import React, { useState } from 'react';
import apiService from '../services/apiService';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        await apiService.uploadFile(selectedFile);
        alert('File uploaded successfully');
      } catch (error) {
        console.error('File upload failed', error);
      }
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default FileUpload;
