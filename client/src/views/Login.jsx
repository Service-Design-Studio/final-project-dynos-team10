import { authenticate } from '../helpers/webAuthHelper';
import { setToken, selectRegisteredCredentials } from '../store/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import axios from 'axios';
import useAuth from '../hooks/useAuth';

const BASE_URL = 'https://dynostic-auth-oakg5bt7gq-as.a.run.app';

export default function Login() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { successfulLoginCallback } = useAuth();

    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);

    const [username, setUsername] = useState('');

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

        // dispatch(setToken(token));
        successfulLoginCallback(token);

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