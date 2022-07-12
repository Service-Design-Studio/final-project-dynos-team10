import { configureStore } from '@reduxjs/toolkit';
import workorderReducer from './workorder/workorderSlice';
import authReducer from './auth/authSlice';
import { loadState } from '../browserStorage';
import layoutReducer from "./"

// import todosReducer from './features/todos/todosSlice'
// import filtersReducer from './features/filters/filtersSlice'

export const store = configureStore({
    reducer: {
        workorder: workorderReducer,
        auth: authReducer,
        // layout: layoutReducer

    },
    devTools: true,
    preloadedState: loadState()
})