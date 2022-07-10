import { $authAxios } from '../helpers/axiosHelper';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setToken, saveRegistration, selectRegisteredCredentials, selectToken } from '../store/auth/authSlice';
import { register, authenticate } from '../helpers/webAuthHelper';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);
    const accessToken = useSelector(selectToken);

    const [username, setUsername] = useState('');
    const [credentialNickname, setCredentialNickname] = useState('');
    // const [users, setUsers] = useState([]);

    const registerUser = async() => {
        let result = await $authAxios.post('registration', {
            registration: {
                username
            }
        });
        console.log({result});
        const { challenge, rp, user, pubKeyCredParams } = result.data.create_options;
        const { user_attributes: userAttributes } = result.data;
        const pubKeyCredential = await register(challenge, rp, user, pubKeyCredParams);
        dispatch(saveRegistration(pubKeyCredential)); // save to redux -> localStorage

        result = await $authAxios.post('registration/callback', {
            public_key_credential: pubKeyCredential,
            user_attributes: userAttributes,
            challenge,
            credential_nickname: credentialNickname
        })
        console.log({result});

        navigate('/login'); // redirect to login on successful register
    }

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