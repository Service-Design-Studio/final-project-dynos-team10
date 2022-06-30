import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setToken } from "../store/auth/authSlice";
import axios from 'axios';

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const dispatch = useDispatch();
    const accessToken = useSelector(selectToken);

    /**
     * This function ASSUMES there is already a JWT token
     * This is for verifying the user is allowed to access private routes
     * Hence it only sets isAuthenticated but not the token,
     * since this function does not set a new token but merely verify it
     */
    const verifyToken = async () => {
        const result = await axios.get('https://dynostic-api-oakg5bt7gq-as.a.run.app/verify-jwt', {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        console.log({result});
        if (result.data.token_valid) {
            setIsAuthenticated(true);
        } else {
            // do sth here before immediately logging out user?
            logout();
        }
    }

    /**
     * This function must explicitly receive a token after a new successful login
     * @param {string} token JWT token
     */
    const successfulLoginCallback = (token) => {
        dispatch(setToken(token));
        setIsAuthenticated(true);
    }

    const logout = () => {
        // TODO: tell server this token is invalid?

        dispatch(setToken('')); // clear token
        setIsAuthenticated(false);
    }

    return {
        isAuthenticated,
        verifyToken,
        logout,
        successfulLoginCallback
    }
}