import axios from 'axios';
import { responseInterceptor, errorInteceptor } from './Interceptors';
// import { reportProgress } from './progressManager';
const Api = axios.create({
    // baseURL: process.env.NODE_ENV === 'production' ?
    // '' : 'http://localhost:5122/api/v1',
    baseURL: 'http://localhost:5122/api/v1',
});

Api.interceptors.request.use(config => {
    /* const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } */


    // CASO QUEIRA PEGAR A PORCENTAGEM DO PROGRESSO
    /* config.onDownloadProgress = progressEvent => {
        if (progressEvent.total) {
            let percent = (progressEvent.loaded / progressEvent.total);
            percent = Math.round(percent * 100);

            reportProgress(percent); // usa função global
        }
    }; */

    return config;
});

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInteceptor(error),
);

export { Api };