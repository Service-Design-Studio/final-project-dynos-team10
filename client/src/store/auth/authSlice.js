import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from 'jwt-decode';

const initialState = {
    token: '',
    webAuthnRegistrations: [],
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setWebAuthnRegistrations: (state, action) => {
            state.webAuthnRegistrations = action.payload;
        },
        saveRegistration: (state, action) => {
            state.webAuthnRegistrations = [...state.webAuthnRegistrations, action.payload];
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        }
    }
})

export const {
    setToken,
    setWebAuthnRegistrations,
    saveRegistration,
    setIsAuthenticated
} = authSlice.actions;

const decodedToken = token => jwt_decode(token);

export const selectToken = state => state.auth.token;
export const selectDecodedToken = state => decodedToken(state.auth.token);
export const selectWebAuthnRegistrations = state => state.auth.webAuthnRegistrations;
export const selectRegisteredCredentials = state => {
    return state.auth.webAuthnRegistrations.map(reg => ({
        id: reg.rawId,
        type: reg.type
    }))
}
export const selectCurrentUserId = (state) => {
    const decoded = decodedToken(state.auth.token);
    return parseInt(decoded.aud[0], 10)
}
export const selectIsAuthenticated = state => state.auth.isAuthenticated;

export default authSlice.reducer;