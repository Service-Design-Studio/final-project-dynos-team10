import { $authAxios } from '../helpers/axiosHelper';
import { React, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setToken, saveRegistration, selectRegisteredCredentials, selectToken } from '../store/auth/authSlice';
import { register, authenticate } from '../helpers/webAuthHelper';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../assets/dynostic-logo.svg';
import { FaQuestionCircle } from 'react-icons/fa';

import {
  TextInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Space,
  ActionIcon,
  Tooltip
} from '@mantine/core';

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
            <Space h="1.8rem"/>
            <Container align="center">
                <img src={AppLogo} width="240rem"></img>
            </Container>

            <Container size={420} my={10}>
            
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
                <TextInput label="Username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                <TextInput 
                    label="Credential Nickname" 
                    placeholder="Credential Nickname" 
                    required 
                    value={credentialNickname} 
                    onChange={(e) => setCredentialNickname(e.target.value)}
                    rightSection={
                        <Tooltip
                            label='A "Credential" is what identifies a login method. Since this is your first sign up, give it a good name such as "face-id" if you are using facial recognition etc.'
                            position="bottom"
                            placement="start"
                            wrapLines
                            width={200}
                        >
                            <ActionIcon>
                                <FaQuestionCircle/>
                            </ActionIcon>
                        </Tooltip>
                    }
                    mt="md" />
                {/* <Group position="apart" mt="md">
                <Checkbox label="Remember me" />
                </Group> */}
                <Button onClick={registerUser} fullWidth mt="xl">
                    Register
                </Button>
            </Paper>
            </Container>

        </div> 
    )
}