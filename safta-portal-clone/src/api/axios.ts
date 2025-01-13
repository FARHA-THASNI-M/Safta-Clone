import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://dev-portal.safta.sa/api/v1'
   
  });
  export default instance