import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://ecommerce-64rm.onrender.com',
  headers: {
      "Content-Type": "application/json",
  },
  withCredentials: true
});

// Add interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
          // Clear user data on auth error
          localStorage.removeItem('user');
          // Optionally redirect to login
          window.location.href = '/login';
      }
      return Promise.reject(error);
  }
);

export default axiosInstance;