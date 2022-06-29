import axios from 'axios';
import { useState } from 'react';
import { create, get } from '@github/webauthn-json';

const getRegistrations = () => {
    const registrations = JSON.parse(
        localStorage.webAuthnRegistrations || "[]"
    );
    return registrations;
}

const setRegistrations = registrations => {
    localStorage.webAuthnRegistrations = JSON.stringify(registrations, null, " ");
}

const saveRegistration = registration => {
    const registrations = getRegistrations();
    registrations.push(registration);
    setRegistrations(registrations);
}

const registeredCredentials = () => {
    return getRegistrations().map(reg => ({
        id: reg.rawId,
        type: reg.type
    }))
}

const register = async (challenge, rp, user, pubKeyCredParams) => {
    // what about attestation?
    const newRegistration = await create({
        publicKey: {
            challenge,
            rp,
            user,
            pubKeyCredParams,
            excludeCredentials: registeredCredentials(),
            authenticatorSelection: {
                authenticatorAttachment: 'cross-platform', // play around with these values
                userVerification: 'required',
                requireResidentKey: false
            },
            extensions: {
                credProps: true
            }
        }
    })
    console.log({newRegistration});
    // saveRegistration(newRegistration); // save to localStorage
    return newRegistration;
}


export default function Register() {
    const [username, setUsername] = useState('');
    const [credentialNickname, setCredentialNickname] = useState('');

    const registerUser = async() => {
        let result = await axios.post('http://localhost:8000/registration', {
            registration: {
                username
            }
        });
        console.log({result});
        const { challenge, rp, user, pubKeyCredParams } = result.data.create_options;
        const { user_attributes: userAttributes } = result.data;
        const pubKeyCredential = await register(challenge, rp, user, pubKeyCredParams);


        // const opts = {
        //     attestation: 'none',
        //     authenticatorSelection: {
        //         authenticatorAttachment: 'platform',
        //         userVerification: 'required',
        //         requireResidentKey: false
        //     }
        // };

        result = await axios.post('http://localhost:8000/registration/callback', {
            public_key_credential: pubKeyCredential,
            user_attributes: userAttributes,
            challenge,
            credential_nickname: credentialNickname
        })
    }

    return (
        <div>
            <h1>Register</h1>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input placeholder="credential nickname" value={credentialNickname} onChange={(e) => setCredentialNickname(e.target.value)}></input>
            <button onClick={registerUser}>Submit</button>
        </div>
    )
}