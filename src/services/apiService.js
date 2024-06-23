import axios from 'axios';
import authService from './authService';

const apiService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = await authService().getToken();

    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
  listFiles: async () => {
    const token = await authService().getToken();

    const response = await axios.get('/api/files', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default apiService;
