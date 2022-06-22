import axios from 'axios';

export const $axios = axios.create({
    baseURL: 'http://localhost:5000',
    // baseURL: 'https://dynostic-api-oakg5bt7gq-as.a.run.app'
})