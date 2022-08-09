import {
    TextInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Space,
    Modal,
    PasswordInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../assets/dynostic-logo.svg';
import { $authAxios } from '../helpers/axiosHelper';

export default function Register() {
    const navigate = useNavigate();

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

    const requestRegistration = async () => {
        const payload = {
            registration: {
                username: form.values.username,
                password: form.values.password
            }
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

    const registrationPasswordOnly = async () => {
        let result = await requestRegistration();
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

        await registrationPasswordOnly();
        
        setIsLoading(false);
        setSuccessModalOpened(true);
    }

    return (
        <div>
            <div>
                <Space h="2.3rem" />
                <Container size="xs" align="center">
                    <img src={AppLogo} width="240rem"></img>
                </Container>

                <Container size="xs" style={{ marginTop: 10 }} >
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