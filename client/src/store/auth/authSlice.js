import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from 'jwt-decode';

const initialState = {
    token: '',
    webAuthnRegistrations: []
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
        }
    }
})

export const {
    setToken,
    setWebAuthnRegistrations,
    saveRegistration
} = authSlice.actions;

const decodedToken = token => jwt_decode(token);

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

export default authSlice.reducer;