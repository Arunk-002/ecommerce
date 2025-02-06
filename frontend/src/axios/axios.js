import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://ecommerce-64rm.onrender.com/', 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});

export default axiosInstance;
