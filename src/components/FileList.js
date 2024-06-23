import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await apiService.listFiles();
        setFiles(files);
      } catch (error) {
        console.error('Failed to fetch files', error);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>File List</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
