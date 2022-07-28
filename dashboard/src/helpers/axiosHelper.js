import axios from 'axios';

const baseURL =
    (import.meta.env.MODE === "test" || import.meta.env.REACT_APP_IS_TESTING === 'true') ? 'http://localhost:5000' :
    import.meta.env.MODE === "development" ? 'https://dynostic-dev-api-oakg5bt7gq-as.a.run.app' :
    'https://dynostic-api-oakg5bt7gq-as.a.run.app';

export const $axios = axios.create({
    baseURL
})

export const $authAxios = axios.create({
    baseURL: 'https://dynostic-auth-oakg5bt7gq-as.a.run.app'
})
