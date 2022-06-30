import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setToken, saveRegistration, selectRegisteredCredentials, selectToken } from '../store/auth/authSlice';
import { register, authenticate } from '../helpers/webAuthHelper';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://dynostic-auth-oakg5bt7gq-as.a.run.app';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);
    const accessToken = useSelector(selectToken);

    const [username, setUsername] = useState('');
    const [credentialNickname, setCredentialNickname] = useState('');
    // const [users, setUsers] = useState([]);

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

        navigate('/login'); // redirect to login on successful register
    }

    // const signIn = async () => {
    //     let result = await axios.post(`${BASE_URL}/session`, {
    //         username
    //     });
    //     console.log({result});
    //     const { challenge } = result.data;
    //     const pubKeyCredential = await authenticate(challenge, registeredCredentials);

    //     result = await axios.post(`${BASE_URL}/session/callback`, {
    //         public_key_credential: pubKeyCredential,
    //         username,
    //         challenge
    //     })
    //     const { token } = result.data;
    //     console.log({token});

    //     dispatch(setToken(token));
    // }

    // const validateSignIn = async () => {
    //     let result = await axios.get('https://dynostic-api-oakg5bt7gq-as.a.run.app/verify-jwt', {
    //         headers: {
    //             "Authorization": `Bearer ${accessToken}`
    //         }
    //     });
    //     console.log({result});
    //     if (result.data.token_valid) {
    //         alert('You are already logged in!');
    //     } else {
    //         alert('Something went wrong, you are NOT logged in');
    //     }
    // }

    // const getUsers = async () => {
    //     let result = await axios.get(`${BASE_URL}/users`, {
    //         headers: {
    //             "Authorization": `Bearer ${accessToken}`
    //         }
    //     });

    //     setUsers(result.data.result);
    // }

    return (
        <div>
            <h1>Register</h1>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input placeholder="credential nickname" value={credentialNickname} onChange={(e) => setCredentialNickname(e.target.value)}></input>
            <button onClick={registerUser}>Register</button>
            {/* <button onClick={signIn}>Step 2: Sign In</button> */}
            {/* <button onClick={validateSignIn}>Step 3: Validate signed in</button> */}
            {/* <button onClick={getUsers}>Check Login: Get Users</button> */}

            {/* <h1>Users</h1>
            {
                users.map(el => (
                    <div key={el.id}>
                        id: {el.id}, username: {el.username}
                    </div>
                ))
            } */}
        </div>
    )
}