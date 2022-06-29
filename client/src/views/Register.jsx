import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setToken, saveRegistration, selectRegisteredCredentials } from '../store/auth/authSlice';
import { register, authenticate } from '../helpers/webAuthHelper';

const BASE_URL = 'https://4f6a-2401-7400-c807-76c-40-890b-d3a3-c954.ap.ngrok.io';

export default function Register() {
    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);

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

    return (
        <div>
            <h1>Register</h1>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input placeholder="credential nickname" value={credentialNickname} onChange={(e) => setCredentialNickname(e.target.value)}></input>
            <button onClick={registerUser}>Submit</button>
            <button onClick={signIn}>Sign In</button>
        </div>
    )
}