import axios from 'axios';
import apiConfig from '../constants/Api';

axios.defaults.baseURL = apiConfig.BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.accept = 'application/json';
axios.defaults.headers['Content-Type'] = 'application/json';
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  //console.log('interceptor', config);
  return config;
});

export default axios;
