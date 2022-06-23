import { configureStore } from '@reduxjs/toolkit';
import workorderReducer from './workorder/workorderSlice';
import { loadState } from '../browserStorage';

export const store = configureStore({
    reducer: {
        workorder: workorderReducer
    },
    devTools: true,
    preloadedState: loadState()
})