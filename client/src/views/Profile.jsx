import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUserId, selectToken, saveRegistration } from "../store/auth/authSlice";
import { $authAxios } from "../helpers/axiosHelper";
import { register } from "../helpers/webAuthHelper";
import { useForm } from "@mantine/form";
import { Button, Card, Container, Group, ScrollArea, Text, TextInput, Loader, Center } from "@mantine/core";

export default function Profile() {
    const dispatch = useDispatch();

    const userId = useSelector(selectCurrentUserId);
    const accessToken = useSelector(selectToken);
    const [username, setUsername] = useState('');
    const [userCredentials, setUserCredentials] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

    const form = useForm({
        initialValues: {
            credentialNickname: ''
        },
        validate: {
            credentialNickname: (value) => (value.length <= 0 ? 'Credential nickname is required' : null),
        }
    })

    const getUserData = async () => {
        if (!userId) {
            return;
        }

        setIsLoadingUserInfo(true);
        let response = await $authAxios.get(`users/${userId}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const user = response.data.result;
        console.log({user});
        setUsername(user.username);

        response = await $authAxios.get(`users/${userId}/credentials`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const savedCredentials = response.data.result;
        console.log({savedCredentials});
        setUserCredentials(savedCredentials);
        setIsLoadingUserInfo(false);
    }

    const requestNewCredential = async () => {
        return await $authAxios.post('credential', {
            user_id: userId
        });
    }

    const registerCredential = async (resultData) => {
        const { challenge, rp, user, pubKeyCredParams } = resultData.create_options;
        try {
            const pubKeyCredential = await register(challenge, rp, user, pubKeyCredParams);
            dispatch(saveRegistration(pubKeyCredential)); // save to redux -> localStorage
            return { pubKeyCredential, challenge };
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const commitCredential = async (data) => {
        try {
            const { pubKeyCredential, challenge } = data;
            return await $authAxios.post('credential/callback', {
                public_key_credential: pubKeyCredential,
                user_id: userId,
                challenge,
                credential_nickname: form.values.credentialNickname
            });
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const createNewCredential = async () => {
        setIsLoading(true);
        const validation = form.validate();
        if (validation.hasErrors) {
            // has errors
            setIsLoading(false);
            return;
        }

        let result = await requestNewCredential();
        console.log({result});

        const credentialData = await Profile.registerCredentialExposed(result.data);
        console.log({credentialData});
        if (!credentialData) {
            setIsLoading(false);
            return;
        }

        result = await commitCredential(credentialData);
        console.log({result});
        setIsLoading(false);
        getUserData();
    }

    useEffect(() => {
        Profile.registerCredentialExposed = async (resultData) => {
            return await registerCredential(resultData);
        }
        window.profileComponent = Profile;

        getUserData();
    }, [])

    return (
        <Container>
            {
                userId ?
                <>
                    <Text weight={500} size="lg">Your Registered Credentials</Text>
                    <Group mb="md" align="flex-end" noWrap position="apart">
                        <TextInput
                            label="Add New Credential" 
                            placeholder="Credential Nickname" 
                            required
                            {...form.getInputProps('credentialNickname')}
                            sx={{ flexGrow: 1 }}
                        />
                        <Button
                            onClick={createNewCredential}
                            loading={isLoading}
                        >
                            Add
                        </Button>
                    </Group>
                    <ScrollArea style={{ height: .5*window.innerHeight }}>
                        {isLoadingUserInfo ?
                        <Center>
                            <Loader size="md"/> 
                        </Center>
                        :
                        userCredentials.map(el => 
                            (
                                <Card
                                    shadow="sm"
                                    mb="md"
                                    key={el.id}
                                >
                                    <Text>{el.nickname}</Text>
                                </Card>
                            )
                        )}
                    </ScrollArea>
                </> :
                <Text size="xl">You are not logged in!</Text>
            }
        </Container>
    )
}