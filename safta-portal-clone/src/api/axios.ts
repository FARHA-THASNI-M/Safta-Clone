import axios from 'axios';

export default axios.create({
    baseURL: 'https://dev-portal.safta.sa/api'
})