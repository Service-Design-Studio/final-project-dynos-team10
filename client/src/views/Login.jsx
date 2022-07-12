import { authenticate } from '../helpers/webAuthHelper';
import { setToken, selectRegisteredCredentials, setIsAuthenticated, selectIsAuthenticated } from '../store/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import AppLogo from '../assets/dynostic-logo.svg';

import {
    TextInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Space
  } from '@mantine/core';

import { $authAxios } from '../helpers/axiosHelper';

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
        let result = await $authAxios.post('session', {
            username
        });
        console.log({result});
        const { challenge } = result.data;
        const pubKeyCredential = await authenticate(challenge, registeredCredentials);

        result = await $authAxios.post(`session/callback`, {
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
            {/* <h1>Login</h1>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <button onClick={signIn}>Sign In</button> */}

            <Space h="2.3rem"/>
            <Container align="center">
                <img src={AppLogo} width="240rem"></img>
            </Container>

            <Container size={420} my={20}>
                <Title
                    align="center"
                    sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                    >
                    Login
                </Title>
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor href="#" size="sm" onClick={() => navigate('/register')}>
                        Register here
                    </Anchor>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <Button onClick={signIn} fullWidth mt="xl">
                        Log In
                    </Button>
                </Paper>
            </Container>

        </div>
    )
}