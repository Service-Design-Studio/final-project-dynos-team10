import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setToken, saveRegistration, selectRegisteredCredentials, selectToken } from '../store/auth/authSlice';
import { register, authenticate } from '../helpers/webAuthHelper';

const BASE_URL = 'https://dynostic-auth-oakg5bt7gq-as.a.run.app';

export default function Register() {
    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);
    const accessToken = useSelector(selectToken);

    const [username, setUsername] = useState('');
    const [credentialNickname, setCredentialNickname] = useState('');

    const registerUser = async() => {
        let result = await axios.post(`${BASE_URL}/registration`, {
            registration: {
                username
            }
        });
        console.log({result});
        const { challenge, rp, user, pubKeyCredParams } = result.data.create_options;
        const { user_attributes: userAttributes } = result.data;
        const pubKeyCredential = await register(challenge, rp, user, pubKeyCredParams);
        dispatch(saveRegistration(pubKeyCredential)); // save to redux -> localStorage

        result = await axios.post(`${BASE_URL}/registration/callback`, {
            public_key_credential: pubKeyCredential,
            user_attributes: userAttributes,
            challenge,
            credential_nickname: credentialNickname
        })
        console.log({result});
    }

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
    }

    const validateSignIn = async () => {
        let result = await axios.get('https://dynostic-api-oakg5bt7gq-as.a.run.app/verify-jwt', {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        console.log({result});
        if (result.data.token_valid) {
            alert('You are already logged in!');
        } else {
            alert('Something went wrong, you are NOT logged in');
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input placeholder="credential nickname" value={credentialNickname} onChange={(e) => setCredentialNickname(e.target.value)}></input>
            <button onClick={registerUser}>Step 1: Register</button>
            <button onClick={signIn}>Step 2: Sign In</button>
            <button onClick={validateSignIn}>Step 3: Validate signed in</button>
        </div>
    )
}