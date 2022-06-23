import axios from 'axios';

const baseURL = process.env.NODE_ENV === "development" ? 'http://localhost:5000' : 'https://dynostic-api-oakg5bt7gq-as.a.run.app';

export const $axios = axios.create({
    // baseURL: 'http://localhost:5000',
    // baseURL: 'https://dynostic-api-oakg5bt7gq-as.a.run.app',
    baseURL
})