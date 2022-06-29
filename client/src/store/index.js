import { configureStore } from '@reduxjs/toolkit';
import workorderReducer from './workorder/workorderSlice';
import authReducer from './auth/authSlice';
import { loadState } from '../browserStorage';

export const store = configureStore({
    reducer: {
        workorder: workorderReducer,
        auth: authReducer
    },
    devTools: true,
    preloadedState: loadState()
})