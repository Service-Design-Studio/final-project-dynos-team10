import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import AppLogo from '../assets/dynostic-logo.svg';

import {
    TextInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Space,
    PasswordInput,
    Loader,
    Center
} from '@mantine/core';

import { $authAxios } from '../helpers/axiosHelper';
import { useForm } from '@mantine/form';
import { AuthContext } from '../router';

export default function Login() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, setAccessToken } = useContext(AuthContext);

    const [loginLoading, setLoginLoading] = useState(false);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);

    useEffect(() => {
        // if (isAuthenticated && import.meta.env.MODE !== "development") {
        //     navigate('/');
        // }
        setAuthCheckLoading(true);
        setTimeout(() => {
            if (isAuthenticated) navigate(state?.from.pathname || '/');
            setTimeout(() => {
                setAuthCheckLoading(false);
            }, 500)
        }, 1000)
    }, [isAuthenticated])

    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },
        validate: {
            username: (value) => (value.length <= 0 ? 'Username is required' : null),
        }
    })

    const requestLogin = async () => {
        const payload = {
            username: form.values.username,
            password: form.values.password
        }

        try {
            return await $authAxios.post('session', payload);
        } catch(e) {
            const errors = e.response.data?.errors;
            if (errors) {
                if (errors.includes("Username doesn't exist")) {
                    form.setErrors({ username: "Username doesn't exist" });
                } else if (errors.includes("Password is incorrect")) {
                    form.setErrors({password: 'Password is incorrect'});
                }
            }
        }
    }

    const signInPasswordOnly = async () => {
        // here we validate additionally that password field is non-empty
        if (form.values.password === '') {
            form.setFieldError('password', 'Password is required');
            setLoginLoading(false);
            return;
        }

        let result = await requestLogin();
        console.log({result});
        if (!result) {
            setLoginLoading(false);
            return;
        }
        const { token } = result.data;
        console.log({token});
        return token;
    }

    const signIn = async () => {
        setLoginLoading(true);

        const validation = form.validate();
        if (validation.hasErrors) {
            // has errors
            setLoginLoading(false);
            return;
        }
        let token;
        token = await signInPasswordOnly();
        if (!token) {
            return;
        }

        setAccessToken(token);
        setIsAuthenticated(true);
        setLoginLoading(false);

        // on successful login, redirect
        navigate(state?.from.pathname || '/');
    }

    return (
        authCheckLoading ?
        <Center style={{ width: window.innerWidth, height: window.innerHeight,flexDirection: 'column' }}>
            <Loader variant="bars" size={200} />
            <Text weight={700} style={{ fontSize: '28px' }}>Please wait for a moment</Text>
        </Center> :
        <>
            <Space h="2.3rem"/>
            <Container align="center">
                <img src={AppLogo} width="240rem"></img>
            </Container>

            <Container size="xs" style={{ marginTop: 10 }}>

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
                        {...form.getInputProps('password')}
                        mt="md"
                    />
                    <Button mt="xl" onClick={() => signIn(false)} className="login-btn" loading={loginLoading} fullWidth>
                        Sign In
                    </Button>
                </Paper>

            </Container>
        </>
    )
}