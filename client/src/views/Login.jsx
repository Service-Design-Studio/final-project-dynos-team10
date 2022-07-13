import { authenticate } from '../helpers/webAuthHelper';
import { setToken, selectRegisteredCredentials, setIsAuthenticated, selectIsAuthenticated } from '../store/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { React, useEffect } from 'react';
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
import { useForm } from '@mantine/form';

export default function Login() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        // on mounted, if already authenticated, go to homepage
        // exclude dev environment, i.e. dev environment can visit login page to debug
        if (isAuthenticated && process.env.NODE_ENV !== "development") {
            navigate('/');
        }
    }, [])

    const form = useForm({
        initialValues: {
            username: ''
        },
        validate: {
            username: (value) => (value.length <= 0 ? 'Username is required' : null)
        }
    })

    const requestLogin = async () => {
        try {
            return await $authAxios.post('session', {
                username: form.values.username
            });
        } catch(e) {
            const errors = e.response.data?.errors;
            if (errors && errors.includes("Username doesn't exist")) {
                form.setErrors({ username: "Username doesn't exist" });
            }
        }
    }

    const commitLogin = async (pubKeyCredential, challenge) => {
        try {
            return await $authAxios.post(`session/callback`, {
                public_key_credential: pubKeyCredential,
                username: form.values.username,
                challenge
            })
        } catch (e) {
            console.error(e);
        }
    }


    const signIn = async () => {
        const validation = form.validate();
        if (validation.hasErrors) {
            // has errors
            return;
        }

        let result = await requestLogin();
        console.log({result});
        if (!result) {
            return;
        }

        const { challenge } = result.data;
        const pubKeyCredential = await authenticate(challenge, registeredCredentials);

        result = await commitLogin(pubKeyCredential, challenge);
        if (!result) {
            return;
        }

        const { token } = result.data;
        console.log({token});

        dispatch(setToken(token));
        dispatch(setIsAuthenticated(true));

        // on successful login, redirect
        navigate(state?.from.pathname || '/');
    }

    return (
        <div>
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
                    <TextInput
                        label="Username"
                        placeholder="Username"
                        required
                        {...form.getInputProps('username')}
                    />
                    <Button onClick={signIn} fullWidth mt="xl" className="login-btn">
                        Log In
                    </Button>
                </Paper>
            </Container>

        </div>
    )
}