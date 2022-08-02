import { createConsumer } from '@rails/actioncable';
import { createContext } from 'react';
import { baseURL } from './axiosHelper';

function getSocketUrl() {
    const token = '';
    return `${baseURL}/ws?token=${token}`;
}

const consumer = createConsumer(getSocketUrl());

const CableConsumerContext = createContext(consumer);

export { CableConsumerContext as default, consumer };