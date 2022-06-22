import axios from 'axios';

export const $axios = axios.create({
    baseURL: 'http://localhost:5000'
})