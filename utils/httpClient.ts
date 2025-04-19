import axios from 'axios';
const BASE_HOST = "http://localhost:5001/";

// Create an Axios instance
const httpClient = axios.create({
  baseURL: BASE_HOST, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
httpClient.interceptors.response.use(
  (response) => response.data, // Simplify response data extraction
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status code out of 2xx range
      console.error('API Error:', error.response.data.message || error.response.statusText);
    } else if (error.request) {
      // No response received from server
      console.error('Network Error:', error.message);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default httpClient;