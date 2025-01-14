import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://dev-portal.safta.sa/api/v1',
   headers:{
    "Content-Type": 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
   }
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status ===401) {
            localStorage.clear();
            window.location.href = '/login';

        }
        return  Promise.reject(error);
    }
  );

  instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
  )
  export default instance;