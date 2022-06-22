import { configureStore } from '@reduxjs/toolkit';
import workorderReducer from './workorder/workorderSlice';

export const store = configureStore({
    reducer: {
        workorder: workorderReducer
    }
})