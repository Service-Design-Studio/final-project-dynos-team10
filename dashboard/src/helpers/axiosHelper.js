import axios from 'axios';

export const baseURL =
    (import.meta.env.MODE === "test") ? 'http://localhost:5000' :
    import.meta.env.MODE === "development" ? 'https://dynostic-dev-api-oakg5bt7gq-as.a.run.app' :
    'https://dynostic-api-oakg5bt7gq-as.a.run.app';

export const $axios = axios.create({
    baseURL
})

export const $authAxios = axios.create({
    baseURL: 'https://dynostic-auth-oakg5bt7gq-as.a.run.app'
})

export const $functionsAxios = axios.create({
    baseURL: 'https://asia-southeast1-tsh-qc.cloudfunctions.net'
})