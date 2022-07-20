import axios from 'axios';

const baseURL =
    process.env.NODE_ENV === "test" ? 'http://localhost:5000' :
    process.env.NODE_ENV === "development" ? 'https://dynostic-dev-api-oakg5bt7gq-as.a.run.app' :
    'https://dynostic-api-oakg5bt7gq-as.a.run.app';

export const $axios = axios.create({
    baseURL
})

export const $authAxios = axios.create({
    baseURL: 'https://dynostic-auth-oakg5bt7gq-as.a.run.app'
})