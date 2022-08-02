import { createContext } from 'react';
import { baseURL } from './axiosHelper';

function getSocketUrl(token) {
    return `${baseURL}/ws?token=${token}`;
}

const CableConsumerContext = createContext();

export { CableConsumerContext as default, getSocketUrl };