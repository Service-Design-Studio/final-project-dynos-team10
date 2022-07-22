import { $authAxios } from '../helpers/axiosHelper';
import { React, useState } from 'react';
import { useDispatch } from "react-redux";
import { saveRegistration } from '../store/auth/authSlice';
import { register } from '../helpers/webAuthHelper';
import { useNavigate } from 'react-router-dom';
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
  Modal, 
  PasswordInput,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [successModalOpened, setSuccessModalOpened] = useState(false);

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            credentialNickname: ''
        },
        validate: {
            username: (value) => (value.length <= 0 ? 'Username is required' : null),
            password: (value) => (value.length <= 0 ? 'Password is required' : null),
            confirmPassword: (value) => {
                if (value.length <= 0) {
                    return 'Please enter your password again';
                }
                return value !== form.values.password ? 'Passwords do not match' : null
            }
        }
    })

    const requestRegistration = async (withWebAuth=false) => {
        const payload = {
            registration: {
                username: form.values.username,
                password: form.values.password
            }
        }
        if (withWebAuth) {
            payload.authentication_method = '1';
        }

        try {
            return await $authAxios.post('registration', payload);
            
        } catch (e) {
            const errors = e.response.data?.errors;
            if (errors && errors.includes('Username has already been taken')) {
                form.setErrors({ username: 'Username is not unique' });
            }
            return;
        }
    }

    const registerCredential = async (resultData) => {
        const { challenge, rp, user, pubKeyCredParams } = resultData.create_options;
        const { user_attributes: userAttributes } = resultData;
        try {
            const pubKeyCredential = await register(challenge, rp, user, pubKeyCredParams);
            dispatch(saveRegistration(pubKeyCredential)); // save to redux -> localStorage
            return { pubKeyCredential, userAttributes, challenge };
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const commitRegistration = async (data) => {
        try {
            const {pubKeyCredential, userAttributes, challenge} = data;
            return await $authAxios.post('registration/callback', {
                public_key_credential: pubKeyCredential,
                user_attributes: userAttributes,
                challenge,
                credential_nickname: form.values.credentialNickname
            });
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const registrationWithWebAuth = async () => {
        let result = await requestRegistration(true);
        console.log({result});
        if (!result) {
            setIsLoading(false);
            return;
        }

        const credentialData = await Register.registerCredentialExposed(result.data);
        console.log({credentialData});
        if (!credentialData) {
            setIsLoading(false);
            return;
        }

        result = await commitRegistration(credentialData);
        console.log({result});
    }

    const registrationPasswordOnly = async () => {
        let result = await requestRegistration(false);
        console.log({result});
        if (!result) {
            setIsLoading(false);
            return;
        }
    }

    const registerUser = async() => {
        setIsLoading(true);
        const validation = form.validate();
        if (validation.hasErrors) {
            // has errors
            setIsLoading(false);
            return;
        }

        if (form.values.credentialNickname) {
            await registrationWithWebAuth()
        } else {
            await registrationPasswordOnly();
        }
        
        setIsLoading(false);
        setSuccessModalOpened(true);
    }

    // TO ALLOW METHOD STUBBING FOR registerCredential()
    useEffect(() => {
        Register.registerCredentialExposed = async (resultData) => {
            return await registerCredential(resultData);
        }
        window.registerComponent = Register;
    }, [])

    return (
        <div>
            <div>
                <Space h="2.3rem" />
                <Container align="center">
                    <img src={AppLogo} width="240rem"></img>
                </Container>

                <Container style={{ marginTop: 10 }} >
                    <Title
                        align="center"
                        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                    >
                        Register
                    </Title>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Have an account already?{' '}
                        <Anchor href="#" size="sm" onClick={() => navigate('/login')}>
                            Login here
                        </Anchor>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <TextInput 
                            label="Username" 
                            placeholder="Username" 
                            required
                            {...form.getInputProps('username')} />
                        <PasswordInput 
                            label="Password" 
                            placeholder="Password" 
                            required 
                            mt="md" 
                            {...form.getInputProps('password')} />
                        <PasswordInput 
                            label="Confirm Password" 
                            placeholder="Confirm Password" 
                            required 
                            mt="md" 
                            {...form.getInputProps('confirmPassword')}/>
                        <TextInput
                            label={
                                <Group noWrap>
                                    <div>
                                        <Text>Credential Nickname</Text>
                                        <Text color="grey" component="small" size="xs">For using your device's biometric authentication</Text>
                                    </div>
                                    <Tooltip
                                        label={'A "Credential" is what identifies a login method using your device\'s biometric authentication. Since this is your first sign up, give it a good name such as "face-id" if you are using facial recognition etc.'}
                                        position="bottom"
                                        placement="start"
                                        wrapLines
                                        width={300}
                                    >
                                        <ActionIcon>
                                            <FaQuestionCircle />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            }
                            placeholder="Credential Nickname"
                            {...form.getInputProps('credentialNickname')}
                            mt="md"
                        />
                        {/* <Group position="apart" mt="md">
                        <Checkbox label="Remember me" />
                        <Anchor onClick={(event) => event.preventDefault()} href="#" size="sm">
                            Forgot password?
                        </Anchor>
                        </Group> */}
                        <Button loading={isLoading} onClick={registerUser} className="register-btn" fullWidth mt="xl">
                            Register
                        </Button>
                    </Paper>
                </Container>
            </div>
            <Modal
                title="Successful Registration"
                opened={successModalOpened}
                withCloseButton={false}
                centered
            >
                <Button className="redirect-login-btn" onClick={() => navigate('/login')}>
                    Log In Now
                </Button>
            </Modal>     
        </div>
    )
}