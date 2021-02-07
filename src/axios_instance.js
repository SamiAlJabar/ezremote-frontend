const axios = require("axios");
const defaultOptions = {
  baseURL: process.env.VUE_APP_API_URL
};
let axiosInstance = axios.create(defaultOptions);
axiosInstance.interceptors.request.use(function(config) {
  return config;
});

export default axiosInstance;
