import { authenticate } from '../helpers/webAuthHelper';
import { setToken, selectRegisteredCredentials, setIsAuthenticated, selectIsAuthenticated } from '../store/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { React, useEffect, useState } from 'react';
import AppLogo from '../assets/dynostic-logo.svg';
import { FaQuestionCircle } from 'react-icons/fa';

import {
    TextInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Space,
    ActionIcon,
    Tooltip,
    PasswordInput,
    Group,
    Checkbox
  } from '@mantine/core';

import { $authAxios } from '../helpers/axiosHelper';
import { useForm } from '@mantine/form';

export default function Login() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const registeredCredentials = useSelector(selectRegisteredCredentials);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        // on mounted, if already authenticated, go to homepage
        // exclude dev environment, i.e. dev environment can visit login page to debug
        if (isAuthenticated && process.env.NODE_ENV !== "development") {
            navigate('/');
        }
    }, [])

    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },
        validate: {
            username: (value) => (value.length <= 0 ? 'Username is required' : null),
            password: (value) => (value.length <= 0 ? 'Password is required' : null)
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
        setLoginLoading(true);

        const validation = form.validate();
        if (validation.hasErrors) {
            // has errors
            setLoginLoading(false);
            return;
        }

        let result = await requestLogin();
        console.log({result});
        if (!result) {
            setLoginLoading(false);
            return;
        }

        const { challenge } = result.data;
        const pubKeyCredential = await Login.authenticateExposed(challenge, registeredCredentials);

        result = await commitLogin(pubKeyCredential, challenge);
        if (!result) {
            setLoginLoading(false);
            return;
        }

        const { token } = result.data;
        console.log({token});

        dispatch(setToken(token));
        dispatch(setIsAuthenticated(true));
        setLoginLoading(false);

        // on successful login, redirect
        navigate(state?.from.pathname || '/');
    }

    useEffect(() => {
        Login.authenticateExposed = async (challenge, registeredCredentials) => {
            return await authenticate(challenge, registeredCredentials);
        }
        window.loginComponent = Login;
    }, [])

    return (
        <div>
            <Space h="2.3rem"/>

            <Container align="center">
                <img src={AppLogo} width="240rem"></img>
            </Container>

            <Container style={{ marginTop: 10 }}>

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
                        {...form.getInputProps('username')}/>
                    <PasswordInput 
                        label="Password" 
                        placeholder="Password" 
                        required 
                        {...form.getInputProps('password')}
                        rightSection={<Tooltip
                            label=''
                            position="bottom"
                            placement="start"
                            wrapLines
                            width={200}>
                            <ActionIcon>
                                <FaQuestionCircle/>
                            </ActionIcon>
                        </Tooltip>}
                        mt="md"/>
                    <Button onClick={signIn} fullWidth mt="xl" className="login-btn" loading={loginLoading}>
                        Sign In
                    </Button>
                </Paper>

            </Container>

        </div>
    )
}