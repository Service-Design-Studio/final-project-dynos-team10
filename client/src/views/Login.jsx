import { authenticate } from '../helpers/webAuthHelper';
import { setToken, selectRegisteredCredentials, setIsAuthenticated, selectIsAuthenticated } from '../store/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import axios from 'axios';

const BASE_URL = 'https://dynostic-auth-oakg5bt7gq-as.a.run.app';

export default function Login() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [username, setUsername] = useState('');

    useEffect(() => {
        // on mounted, if already authenticated, go to homepage
        if (isAuthenticated) {
            navigate('/');
        }
    }, [])


    const signIn = async () => {
        let result = await axios.post(`${BASE_URL}/session`, {
            username
        });
        console.log({result});
        const { challenge } = result.data;
        const pubKeyCredential = await authenticate(challenge, registeredCredentials);

        result = await axios.post(`${BASE_URL}/session/callback`, {
            public_key_credential: pubKeyCredential,
            username,
            challenge
        })
        const { token } = result.data;
        console.log({token});

        dispatch(setToken(token));
        dispatch(setIsAuthenticated(true));

        // on successful login, redirect
        navigate(state?.from.pathname || '/');
    }

    return (
        <div>
            <h1>Login</h1>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <button onClick={signIn}>Sign In</button>
        </div>
    )
}